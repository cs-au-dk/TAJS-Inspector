package dk.brics.inspector.api.model.ids;

public class ContextID extends AbstractID {

    private static final String kind = "CONTEXT";

    public ContextID(int id) {
        super(kind, id);
    }

    public static ContextID deSerialize(String fullID) {
        assert fullID.startsWith(kind);
        return new ContextID(getNumberIDFromFullID(fullID));
    }
}
