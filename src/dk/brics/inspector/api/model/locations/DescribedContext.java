package dk.brics.inspector.api.model.locations;

import dk.brics.inspector.api.model.ids.ContextID;

/**
 * Abstract context.
 */
public class DescribedContext {

    public final ContextID id;

    public final String rendering;

    public DescribedContext(String rendering, ContextID id) {
        this.id = id;
        this.rendering = rendering;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedContext that = (DescribedContext) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        return rendering != null ? rendering.equals(that.rendering) : that.rendering == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (rendering != null ? rendering.hashCode() : 0);
        return result;
    }
}
