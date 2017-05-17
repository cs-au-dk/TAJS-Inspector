package dk.brics.inspector.api.model.options;

public class BoxedExperimentalOption {

    public final String kind;

    public final String value;

    public BoxedExperimentalOption(String kind, String value) {
        this.kind = kind;
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BoxedExperimentalOption that = (BoxedExperimentalOption) o;

        if (kind != null ? !kind.equals(that.kind) : that.kind != null) return false;
        return value != null ? value.equals(that.value) : that.value == null;
    }

    @Override
    public int hashCode() {
        int result = kind != null ? kind.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        return result;
    }
}
