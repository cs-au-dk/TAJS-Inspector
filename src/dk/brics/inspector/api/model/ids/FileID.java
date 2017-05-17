package dk.brics.inspector.api.model.ids;

public class FileID extends AbstractID {

    private static final String kind = "FILE";

    public FileID(int id) {
        super(kind, id);
    }

    public static FileID deSerialize(String fullID) {
        assert fullID.startsWith(kind);
        return new FileID(getNumberIDFromFullID(fullID));
    }
}
