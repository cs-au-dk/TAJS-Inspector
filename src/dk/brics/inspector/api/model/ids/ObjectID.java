package dk.brics.inspector.api.model.ids;

public class ObjectID extends AbstractID {

    private static final String kind = "OBJECT";

    public ObjectID(int id) {
        super(kind, id);
    }

    public static ObjectID deSerialize(String fullID) {
        assert fullID.startsWith(kind);
        return new ObjectID(getNumberIDFromFullID(fullID));
    }
}
