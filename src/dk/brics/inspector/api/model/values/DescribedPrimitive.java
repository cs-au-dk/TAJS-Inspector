package dk.brics.inspector.api.model.values;


/**
 * Description of a primitive value in the analysis.
 */
public class DescribedPrimitive implements SingleValue {

    public final String rendering;

    public DescribedPrimitive(String rendering) {
        this.rendering = rendering;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedPrimitive that = (DescribedPrimitive) o;

        return rendering != null ? rendering.equals(that.rendering) : that.rendering == null;
    }

    @Override
    public int hashCode() {
        return rendering != null ? rendering.hashCode() : 0;
    }
}
