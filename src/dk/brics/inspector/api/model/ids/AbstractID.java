package dk.brics.inspector.api.model.ids;

/**
 * Base class for ids. Supports simple naming scheme to facilitate easy client-debugging, the chosen naming scheme has no semantic consequence as long as different ids are unique when serialized.
 */
public abstract class AbstractID {

    private String kind;

    private int number;

    public AbstractID(String kind, int number) {
        this.kind = kind;
        this.number = number;
    }

    public static int getNumberIDFromFullID(String fullID) {
        return Integer.parseInt(fullID.split(":")[1]);
    }

    public static String serialize(AbstractID id) {
        return id == null ? null : String.format("%s:%s", id.kind, id.number);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AbstractID that = (AbstractID) o;

        if (number != that.number) return false;
        return kind != null ? kind.equals(that.kind) : that.kind == null;
    }

    @Override
    public int hashCode() {
        int result = kind != null ? kind.hashCode() : 0;
        result = 31 * result + number;
        return result;
    }
}
