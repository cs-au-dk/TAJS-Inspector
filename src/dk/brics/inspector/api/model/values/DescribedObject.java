package dk.brics.inspector.api.model.values;

import dk.brics.inspector.api.model.ids.ObjectID;

/**
 * Description of an object value in the analysis.
 */
public class DescribedObject implements SingleValue {

    public final String rendering;

    public final boolean invokable;

    public final ObjectID id;

    public DescribedObject(String rendering, boolean invokable, ObjectID id) {
        this.rendering = rendering;
        this.invokable = invokable;
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedObject that = (DescribedObject) o;

        if (invokable != that.invokable) return false;
        if (rendering != null ? !rendering.equals(that.rendering) : that.rendering != null) return false;
        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        int result = rendering != null ? rendering.hashCode() : 0;
        result = 31 * result + (invokable ? 1 : 0);
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }
}
