package dk.brics.inspector.api.model.values;

import java.util.Map;

/**
 * Description of the properties of object in the analysis.
 */
public class DescribedProperties {

    public final Map<String, CompositeValue> metaProperties;

    public final Map<String, CompositeValue> properties;

    public DescribedProperties(Map<String, CompositeValue> metaProperties, Map<String, CompositeValue> properties) {
        this.metaProperties = metaProperties;

        this.properties = properties;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedProperties that = (DescribedProperties) o;

        if (metaProperties != null ? !metaProperties.equals(that.metaProperties) : that.metaProperties != null)
            return false;
        return properties != null ? properties.equals(that.properties) : that.properties == null;
    }

    @Override
    public int hashCode() {
        int result = metaProperties != null ? metaProperties.hashCode() : 0;
        result = 31 * result + (properties != null ? properties.hashCode() : 0);
        return result;
    }
}
