package dk.brics.inspector.api.model.locations;

import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.ids.FileID;

public class ContextInsensitiveDescribedLocation extends DescribedLocation {

    public ContextInsensitiveDescribedLocation(FileID fileID, SourceRange range, LocationID id, int order) {
        super(fileID, range, id, order);
    }
}
