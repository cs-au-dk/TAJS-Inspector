package dk.brics.inspector.development;

import dk.brics.inspector.api.InspectorAPI;
import dk.brics.inspector.api.model.lines.Gutter;
import dk.brics.inspector.api.model.Optional;
import dk.brics.inspector.api.model.RelatedLocationKind;
import dk.brics.inspector.api.model.ids.ContextID;
import dk.brics.inspector.api.model.ids.FileID;
import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.ids.ObjectID;
import dk.brics.inspector.api.model.lines.LineValue;
import dk.brics.inspector.api.model.locations.ContextSensitiveDescribedLocation;
import dk.brics.inspector.api.model.locations.DescribedContext;
import dk.brics.inspector.api.model.locations.DescribedLocation;
import dk.brics.inspector.api.model.locations.FileDescription;
import dk.brics.inspector.api.model.OptionData;
import dk.brics.inspector.api.model.values.DescribedProperties;

import java.util.Set;

public class DummyAPI implements InspectorAPI {

    @Override
    public Set<FileID> getFileIDs() {
        return null;
    }

    @Override
    public FileDescription getFileDescription(FileID id) {
        return null;
    }

    @Override
    public Set<Gutter<?>> getGutters(FileID id) {
        return null;
    }

    @Override
    public OptionData getOptions() {
        return null;
    }

    @Override
    public Set<LineValue> getLineValues(FileID fileID, int line) {
        return null;
    }

    @Override
    public Set<ContextSensitiveDescribedLocation> getAllocationLocations(ObjectID objectID) {
        return null;
    }

    @Override
    public DescribedProperties getObjectProperties(ObjectID objectID, LocationID locationID) {
        return null;
    }

    @Override
    public Set<ContextSensitiveDescribedLocation> getCallLocations(ObjectID objectID) {
        return null;
    }

    @Override
    public Set<ContextSensitiveDescribedLocation> getEventHandlerRegistrationLocations(ObjectID objectID) {
        return null;
    }

    @Override
    public Set<? extends DescribedLocation> getRelatedLocations(LocationID locationID, boolean forwards, RelatedLocationKind kind, boolean intraprocedural) {
        return null;
    }

    @Override
    public Set<ObjectID> getEnclosingFunction(LocationID locationID) {
        return null;
    }

    @Override
    public Optional<DescribedLocation> getPositionalLocationID(FileID fileID, int line, int column, java.util.Optional<ContextID> context) {
        return null;
    }

    @Override
    public Set<DescribedContext> getFilteredContexts(LocationID locationID, String expressionString) {
        return null;
    }
}
