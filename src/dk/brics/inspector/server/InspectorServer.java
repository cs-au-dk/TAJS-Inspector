package dk.brics.inspector.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import dk.brics.inspector.api.InspectorAPI;
import dk.brics.inspector.api.model.RelatedLocationKind;
import dk.brics.inspector.api.model.ids.AbstractID;
import dk.brics.inspector.api.model.ids.ContextID;
import dk.brics.inspector.api.model.ids.FileID;
import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.ids.ObjectID;
import dk.brics.inspector.client.InspectorClient;
import org.apache.log4j.Logger;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ErrorPageErrorHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.BindException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Path;
import java.util.Optional;
import java.util.function.Function;

/**
 * Servlet-based server. Exposes {@link InspectorAPI} on "/api/approximate-method-name".
 */
public class InspectorServer {

    private static final Logger log = Logger.getLogger(InspectorServer.class);

    private final static boolean TESTING = true;

    private final InspectorAPI api;

    private final InspectorClient client;

    private final Gson gson;

    /**
     * Constructor for a server that is ready to be started ({@link #startServer()}).
     *
     * @param api    implementation of {@link InspectorAPI}.
     * @param client implementation of the client side that interacts with this server.
     */
    public InspectorServer(InspectorAPI api, InspectorClient client) {
        this.api = api;
        this.client = client;
        this.gson = createGson();
    }

    private static Gson createGson() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setPrettyPrinting();
        gsonBuilder.registerTypeAdapter(FileID.class, new IDTypeAdapter<>(s -> FileID.deSerialize(s)));
        gsonBuilder.registerTypeAdapter(ObjectID.class, new IDTypeAdapter<>(s -> ObjectID.deSerialize(s)));
        gsonBuilder.registerTypeAdapter(ContextID.class, new IDTypeAdapter<>(s -> ContextID.deSerialize(s)));
        gsonBuilder.registerTypeAdapter(LocationID.class, new IDTypeAdapter<>(s -> LocationID.deSerialize(s)));
        gsonBuilder.registerTypeAdapter(Path.class, (JsonSerializer<Path>) (path, type, jsonSerializationContext) -> new JsonPrimitive(path.toString()));
        return gsonBuilder.create();
    }

    /**
     * Starts the server.
     */
    public RunningServer startServer() {
        int port = TESTING ? 12345 : 0;
        Server server = new Server(port);
        server.setStopAtShutdown(true);
        server.setStopTimeout(0);
        WebAppContext handler = new WebAppContext();
        handler.setBaseResource(client.getResource());
        handler.setContextPath("/");

        handler.addServlet(new ServletHolder(new FilesServlet()), "/api/files");
        handler.addServlet(new ServletHolder(new FileServlet()), "/api/file");
        handler.addServlet(new ServletHolder(new InfoServlet()), "/api/info");
        handler.addServlet(new ServletHolder(new LineValuesServlet()), "/api/line-values");
        handler.addServlet(new ServletHolder(new GuttersServlet()), "/api/gutters");
        handler.addServlet(new ServletHolder(new AllocationLocationsServlet()), "/api/allocation-locations");
        handler.addServlet(new ServletHolder(new ObjectPropertiesServlet()), "/api/object-properties");
        handler.addServlet(new ServletHolder(new CallLocationsServlet()), "/api/call-locations");
        handler.addServlet(new ServletHolder(new EventHandlerRegistrationLocationsServlet()), "/api/event-handler-registration-locations");
        handler.addServlet(new ServletHolder(new RelatedLocationServlet()), "/api/related-locations");
        handler.addServlet(new ServletHolder(new EnclosingFunctionServlet()), "/api/enclosing-function");
        handler.addServlet(new ServletHolder(new PositionalLocationIDServlet()), "/api/positional-location-id");
        handler.addServlet(new ServletHolder(new ContextFilteringServlet()), "/api/filter-contexts");
        handler.addServlet(new ServletHolder(new KillServlet(server)), "/api/KILL");

        ErrorPageErrorHandler errorHandler = new ErrorPageErrorHandler();
        errorHandler.addErrorPage(404, "/index.html");
        handler.setErrorHandler(errorHandler);

        server.setHandler(handler);

        try {
            server.start();
        } catch (BindException e) {
            if (TESTING) {
                forceRestartServer(server, port);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        URI uri = server.getURI();
        log.info(String.format("Started server at %s", uri));

        return new RunningServer(server);
    }

    private void forceRestartServer(Server server, int port) {
        System.out.println("Sending kill-command to old server: shutting down in a few seconds.");

        try {
            URL url = new URL(server.getURI().toURL().getProtocol(), server.getURI().toURL().getHost(), port, "/api/KILL");
            url.openStream();
        } catch (IOException e1) {
            // squelch
        }
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e1) {
            throw new RuntimeException(e1);
        }
        try {
            server.start();
        } catch (Exception e1) {
            throw new RuntimeException(e1);
        }
    }

    private void writeAsJSON(HttpServletResponse response, Object object) throws IOException {
        response.setContentType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();
        out.write(gson.toJson(object));
        out.flush();
    }

    private ObjectID getObjectID(HttpServletRequest request) {
        String id = request.getParameter("objectID");
        return gson.fromJson('"' + id + '"', ObjectID.class); // hacky way to make gson do the work
    }

    private LocationID getLocationID(HttpServletRequest request) {
        String id = request.getParameter("locationID");
        return gson.fromJson('"' + id + '"', LocationID.class); // hacky way to make gson do the work
    }

    private FileID getFileID(HttpServletRequest request) {
        String id = request.getParameter("fileID");
        return gson.fromJson('"' + id + '"', FileID.class); // hacky way to make gson do the work
    }

    private boolean hasContextID(HttpServletRequest request) {
        return request.getParameterMap().containsKey("contextID");
    }

    private ContextID getContextID(HttpServletRequest request) {
        String id = request.getParameter("contextID");
        return gson.fromJson('"' + id + '"', ContextID.class); // hacky way to make gson do the work
    }

    private int getLine(HttpServletRequest request) {
        return Integer.parseInt(request.getParameter("line"));
    }

    private int getColumn(HttpServletRequest request) {
        return Integer.parseInt(request.getParameter("column"));
    }

    private static class IDTypeAdapter<T extends AbstractID> extends TypeAdapter<T> {

        private final Function<String, T> builder;

        public IDTypeAdapter(Function<String, T> builder) {
            this.builder = builder;
        }

        @Override
        public T read(JsonReader jsonReader) throws IOException {
            return builder.apply(jsonReader.nextString());
        }

        @Override
        public void write(JsonWriter jsonWriter, T id) throws IOException {
            jsonWriter.value(AbstractID.serialize(id));
        }
    }

    public static class RunningServer {

        private final Server server;

        public RunningServer(Server server) {
            this.server = server;
        }

        public URI getURI() {
            return server.getURI();
        }

        public void join() throws InterruptedException {
            server.join();
        }

        public void stop() throws Exception {
            server.stop();
        }

    }

    private class FilesServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getFileIDs());
        }
    }

    private class FileServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getFileDescription(getFileID(request)));
        }
    }

    private class GuttersServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getGutters(getFileID(request)));
        }
    }

    private class InfoServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getOptions());
        }
    }

    private class LineValuesServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getLineValues(getFileID(request), getLine(request)));
        }
    }

    private class AllocationLocationsServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getAllocationLocations(getObjectID(request)));
        }
    }

    private class ObjectPropertiesServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getObjectProperties(getObjectID(request), getLocationID(request)));
        }
    }

    private class CallLocationsServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getCallLocations(getObjectID(request)));
        }
    }

    private class EventHandlerRegistrationLocationsServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getEventHandlerRegistrationLocations(getObjectID(request)));
        }
    }

    private class RelatedLocationServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            boolean forwards = Boolean.parseBoolean(request.getParameter("forwards"));
            RelatedLocationKind kind = RelatedLocationKind.valueOf(request.getParameter("kind"));
            boolean intraprocedural = Boolean.parseBoolean(request.getParameter("intraprocedural"));
            writeAsJSON(response, api.getRelatedLocations(getLocationID(request), forwards, kind, intraprocedural));
        }
    }

    private class EnclosingFunctionServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            writeAsJSON(response, api.getEnclosingFunction(getLocationID(request)));
        }
    }

    private class PositionalLocationIDServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            Optional<ContextID> context = hasContextID(request) ? Optional.of(getContextID(request)) : Optional.empty();
            writeAsJSON(response, api.getPositionalLocationID(getFileID(request), getLine(request), getColumn(request), context));
        }
    }

    private class ContextFilteringServlet extends DefaultServlet {

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            String expression = request.getParameter("expression");
            writeAsJSON(response, api.getFilteredContexts(getLocationID(request), expression));
        }
    }

    private class KillServlet extends DefaultServlet {

        private final Server server;

        public KillServlet(Server server) {
            this.server = server;
        }

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            try {
                log.info("Server is shutting down... (received KILL command)");
                server.stop();
                log.info("Server has been shut down.");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
