package dk.brics.inspector.api.model;

import dk.brics.inspector.api.model.ids.LocationID;

/**
 * Different kinds of related locations.
 *
 * @see dk.brics.inspector.api.InspectorAPI#getRelatedLocations(LocationID, boolean, RelatedLocationKind, boolean)
 */
public enum RelatedLocationKind {
    NODE,
    BLOCK,
    LINE
}
