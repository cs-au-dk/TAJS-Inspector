package dk.brics.inspector.api.model.values;

import dk.brics.inspector.api.model.ids.ObjectID;

public class DescribedObject implements SingleValue {

    public final String rendering;

    public final ObjectKind kind;

    public final ObjectID id;

    public DescribedObject(String rendering, ObjectKind kind, ObjectID id) {
        this.rendering = rendering;
        this.kind = kind;
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedObject that = (DescribedObject) o;

        if (rendering != null ? !rendering.equals(that.rendering) : that.rendering != null) return false;
        if (kind != that.kind) return false;
        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        int result = rendering != null ? rendering.hashCode() : 0;
        result = 31 * result + (kind != null ? kind.hashCode() : 0);
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }
}
