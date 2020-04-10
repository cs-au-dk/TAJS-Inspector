package dk.brics.inspector.api.model.values;

import java.util.Objects;

/**
 * Description of an partition qualifier and its value.
 */
public class DescribedPartition {

    public final String rendering;

    public final CompositeValue value;

    public DescribedPartition(String rendering, CompositeValue value) {
        this.rendering = rendering;
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DescribedPartition that = (DescribedPartition) o;
        return Objects.equals(rendering, that.rendering) &&
                Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rendering, value);
    }
}
