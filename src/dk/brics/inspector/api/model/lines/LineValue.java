package dk.brics.inspector.api.model.lines;

import dk.brics.inspector.api.model.locations.DescribedLocation;
import dk.brics.inspector.api.model.values.CompositeValue;

/**
 * Value of a syntactic expression.
 */
public class LineValue {

    public final String identifier;

    public final DescribedLocation location;

    public final CompositeValue value;

    public final LineValueKind kind;

    public LineValue(LineValueKind kind, String identifier, CompositeValue value, DescribedLocation location) {
        this.kind = kind;
        this.location = location;
        this.identifier = identifier;
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LineValue lineValue = (LineValue) o;

        if (identifier != null ? !identifier.equals(lineValue.identifier) : lineValue.identifier != null) return false;
        if (location != null ? !location.equals(lineValue.location) : lineValue.location != null) return false;
        if (value != null ? !value.equals(lineValue.value) : lineValue.value != null) return false;
        return kind == lineValue.kind;
    }

    @Override
    public int hashCode() {
        int result = identifier != null ? identifier.hashCode() : 0;
        result = 31 * result + (location != null ? location.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (kind != null ? kind.hashCode() : 0);
        return result;
    }
}
