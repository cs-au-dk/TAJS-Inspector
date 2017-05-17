package dk.brics.inspector.api.model.ids;

public class LocationID extends AbstractID {

    private static final String kind = "LOCATION";

    public LocationID(int id) {
        super(kind, id);
    }

    public static LocationID deSerialize(String fullID) {
        assert fullID.startsWith(kind);
        return new LocationID(getNumberIDFromFullID(fullID));
    }
}
