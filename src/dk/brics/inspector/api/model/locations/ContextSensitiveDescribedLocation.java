package dk.brics.inspector.api.model.locations;

import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.ids.FileID;


/**
 * A syntactic location, qualified by a context.
 */
public class ContextSensitiveDescribedLocation extends DescribedLocation {

    public final DescribedContext context;

    public ContextSensitiveDescribedLocation(FileID fileID, SourceRange range, DescribedContext context, LocationID id, int order) {
        super(fileID, range, id, order);
        this.context = context;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        ContextSensitiveDescribedLocation that = (ContextSensitiveDescribedLocation) o;

        return context != null ? context.equals(that.context) : that.context == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (context != null ? context.hashCode() : 0);
        return result;
    }
}
