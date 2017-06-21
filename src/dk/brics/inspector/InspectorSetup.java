package dk.brics.inspector;

import dk.brics.inspector.api.InspectorAPI;
import dk.brics.inspector.client.InspectorClient;
import dk.brics.inspector.server.InspectorServer;
import org.apache.log4j.Logger;

import java.awt.*;
import java.io.IOException;
import java.net.URI;

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
        InspectorServer server = new InspectorServer(api, InspectorClient.makeStandardClient());
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
            openBrowser(runningServer.getURI());
            try {
                log.info("Waiting for server to terminate...");
                runningServer.join();
                log.info("Server has terminated.");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
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
}
