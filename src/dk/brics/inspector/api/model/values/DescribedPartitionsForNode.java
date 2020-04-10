package dk.brics.inspector.api.model.values;

import java.util.Objects;
import java.util.Set;

/**
 * Description of a covering in a partitioned value in the analysis.
 */
public class DescribedPartitionsForNode {

    /**
     * String representing the node
     */
    public final String rendering;

    /**
     * The partitions that belongs to the corresponding node
     */
    public final Set<DescribedPartition> partitions;

    public DescribedPartitionsForNode(String rendering, Set<DescribedPartition> partitions) {
        this.rendering = rendering;
        this.partitions = partitions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DescribedPartitionsForNode that = (DescribedPartitionsForNode) o;
        return Objects.equals(rendering, that.rendering) &&
                Objects.equals(partitions, that.partitions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rendering, partitions);
    }
}
