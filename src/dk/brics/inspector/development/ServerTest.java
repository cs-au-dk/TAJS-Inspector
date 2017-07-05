package dk.brics.inspector.development;

import dk.brics.inspector.InspectorSetup;
import dk.brics.inspector.client.InspectorClient;
import dk.brics.inspector.server.InspectorServer;
import org.eclipse.jetty.util.resource.Resource;

import java.net.MalformedURLException;
import java.nio.file.Paths;

public class ServerTest {

    public static void main(String[] args) {
        if(true){
            InspectorSetup.simpleStart(new DummyAPI(), makeDevelopmentClient());
        }else {
            new InspectorServer(new DummyAPI(), makeDevelopmentClient()).startServer();
        }
    }

    public static InspectorClient makeDevelopmentClient() {
        return new InspectorDevelopmentClient();
    }

    private static class InspectorDevelopmentClient extends InspectorClient {

        public InspectorDevelopmentClient() {
            super(null);
        }

        @Override
        public Resource getResource() {
            try {
                return Resource.newResource(Paths.get("/home/esbena/_data/TAJS-Inspector/src_client").toUri());
            } catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
