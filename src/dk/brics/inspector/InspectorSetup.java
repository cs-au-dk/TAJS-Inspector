package dk.brics.inspector;

import dk.brics.inspector.api.InspectorAPI;
import dk.brics.inspector.client.InspectorClient;
import dk.brics.inspector.server.InspectorServer;
import org.apache.log4j.Logger;

import java.awt.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * External handles for starting an {@link InspectorServer}.
 */
public class InspectorSetup {

    private static final Logger log = Logger.getLogger(InspectorSetup.class);

    /**
     * Starts a server, opens a browser, waits for the server to terminate.
     */
    @SuppressWarnings("unused") // used externally
    public static void simpleStart(InspectorAPI api) {
        InspectorClient client = InspectorClient.makeStandardClient();
        simpleStart(api, client);
    }

    public static void simpleStart(InspectorAPI api, InspectorClient client) {
        InspectorServer server = new InspectorServer(api, client);
        Thread serverThread = makeServerThread(server);
        serverThread.start();
        try {
            log.info("Waiting for server-thread to terminate...");
            serverThread.join();
            log.info("Server-thread has terminated.");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private static Thread makeServerThread(InspectorServer server) {
        return new Thread(() -> {
            InspectorServer.RunningServer runningServer = server.startServer();
            try {
                openBrowser(new URL("http", "localhost", runningServer.getURI().getPort(), runningServer.getURI().getPath()).toURI());
                try {
                    Thread.sleep(1000); // wait for the browser to start properly
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            } catch (URISyntaxException | MalformedURLException e) {
                throw new RuntimeException(e);
            }
            try {
                makeConsole(runningServer);
                log.info("Console access terminated. Waiting for server to terminate...");
                runningServer.join();
                log.info("Server has terminated.");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public static void main(String[] args) {
        makeConsole(null);
    }

    private static void makeConsole(InspectorServer.RunningServer server) {
        Console c = new Console();
        boolean INTERACTIVE = false;
        if (INTERACTIVE) {
            c.format("%n---%nWrite commands to interact with the server (write 'stop' to stop the server).%n");
            while (true) {
                String command = c.readLine("SERVER > ");
                if (command.equals("stop")) {
                    c.format("Got command '%s', stopping ...%n", command);
                    try {
                        server.stop();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    break;
                }
                c.format("Command '%s' not understood%n", command);
            }
        } else {
            c.format("%n---%n---%nPress <ENTER> to stop the server.%n---%n---%n");
            c.readLine("");
            try {
                server.stop();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    private static void openBrowser(URI uri) {
        try {
            if (Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(uri);
            } else {
                Runtime.getRuntime().exec("xdg-open " + uri);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static class Console {

        BufferedReader br;

        PrintStream ps;

        public Console() {
            br = new BufferedReader(new InputStreamReader(System.in));
            ps = System.out;
        }

        public String readLine(String out) {
            ps.format(out);
            try {
                return br.readLine();
            } catch (IOException e) {
                return null;
            }
        }

        public PrintStream format(String format, Object... objects) {
            return ps.format(format, objects);
        }
    }
}
