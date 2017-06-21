package dk.brics.inspector.api.model.locations;

import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.ids.FileID;

/**
 * Base class for locations.
 */
public abstract class DescribedLocation {

    public final FileID fileID;

    public final SourceRange range;

    public final LocationID id;

    public final int order;

    public DescribedLocation(FileID fileID, SourceRange range, LocationID id, int order) {
        this.fileID = fileID;
        this.range = range;
        this.order = order;
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DescribedLocation that = (DescribedLocation) o;

        if (order != that.order) return false;
        if (fileID != null ? !fileID.equals(that.fileID) : that.fileID != null) return false;
        if (range != null ? !range.equals(that.range) : that.range != null) return false;
        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        int result = fileID != null ? fileID.hashCode() : 0;
        result = 31 * result + (range != null ? range.hashCode() : 0);
        result = 31 * result + (id != null ? id.hashCode() : 0);
        result = 31 * result + order;
        return result;
    }
}
