package dk.brics.inspector.api.model.values;

import java.util.Objects;
import java.util.Set;

/**
 * Description of a partitioned value in the analysis.
 */
public class DescribedPartitionedValue implements SingleValue {

    public final String rendering;

    public final Set<DescribedPartitionsForNode> partitions;

    public DescribedPartitionedValue(String rendering, Set<DescribedPartitionsForNode> partitions) {
        this.rendering = rendering;
        this.partitions = partitions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DescribedPartitionedValue that = (DescribedPartitionedValue) o;
        return Objects.equals(rendering, that.rendering) &&
                Objects.equals(partitions, that.partitions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rendering, partitions);
    }
}
