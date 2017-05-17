package dk.brics.inspector.client;

import org.eclipse.jetty.util.resource.Resource;

import java.net.URL;

public class InspectorClient {

    private String resourceName;

    public InspectorClient(String resourceName) {
        this.resourceName = resourceName;
    }

    public static InspectorClient makeStandardClient() {
        return new InspectorClient("standard-js-client");
    }

    public Resource getResource() {
        URL resource = InspectorClient.class.getResource(resourceName);
        assert resource != null;
        return Resource.newResource(resource);
    }
}
