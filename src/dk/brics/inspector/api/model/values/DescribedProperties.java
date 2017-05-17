package dk.brics.inspector.api.model.values;

import java.util.Map;

public class DescribedProperties {

    public final CompositeValue prototype;

    public final CompositeValue internal;

    public final CompositeValue array;

    public final CompositeValue nonArray;

    public final Map<String, CompositeValue> properties;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedProperties that = (DescribedProperties) o;

        if (prototype != null ? !prototype.equals(that.prototype) : that.prototype != null) return false;
        if (internal != null ? !internal.equals(that.internal) : that.internal != null) return false;
        if (array != null ? !array.equals(that.array) : that.array != null) return false;
        if (nonArray != null ? !nonArray.equals(that.nonArray) : that.nonArray != null) return false;
        return properties != null ? properties.equals(that.properties) : that.properties == null;
    }

    @Override
    public int hashCode() {
        int result = prototype != null ? prototype.hashCode() : 0;
        result = 31 * result + (internal != null ? internal.hashCode() : 0);
        result = 31 * result + (array != null ? array.hashCode() : 0);
        result = 31 * result + (nonArray != null ? nonArray.hashCode() : 0);
        result = 31 * result + (properties != null ? properties.hashCode() : 0);
        return result;
    }

    public DescribedProperties(CompositeValue prototype, CompositeValue internal, CompositeValue array, CompositeValue nonArray, Map<String, CompositeValue> properties) {
        this.prototype = prototype;
        this.internal = internal;
        this.array = array;
        this.nonArray = nonArray;
        this.properties = properties;
    }
}
