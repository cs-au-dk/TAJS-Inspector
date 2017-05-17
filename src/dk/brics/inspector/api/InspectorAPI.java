package dk.brics.inspector.api;

import dk.brics.inspector.api.model.ids.LocationID;
import dk.brics.inspector.api.model.lines.LineValue;
import dk.brics.inspector.api.model.locations.DescribedContext;
import dk.brics.inspector.api.model.locations.DescribedLocation;
import dk.brics.inspector.api.model.locations.FileDescription;
import dk.brics.inspector.api.model.options.OptionData;
import dk.brics.inspector.api.model.values.DescribedProperties;
import dk.brics.inspector.api.model.Gutter;
import dk.brics.inspector.api.model.RelatedLocationKind;
import dk.brics.inspector.api.model.ids.ContextID;
import dk.brics.inspector.api.model.ids.FileID;
import dk.brics.inspector.api.model.ids.ObjectID;
import dk.brics.inspector.api.model.locations.ContextSensitiveDescribedLocation;

import java.util.Optional;
import java.util.Set;

public interface InspectorAPI {

    Set<FileID> getFileIDs();

    FileDescription getFileDescription(FileID id);

    Set<Gutter<?>> getGutters(FileID id);

    OptionData getOptions();

    Set<LineValue> getLineValues(FileID fileID, int line);

    Set<ContextSensitiveDescribedLocation> getAllocationLocations(ObjectID objectID);

    DescribedProperties getObjectProperties(ObjectID objectID, LocationID locationID);

    Set<ContextSensitiveDescribedLocation> getCallLocations(ObjectID objectID);

    Set<ContextSensitiveDescribedLocation> getEventHandlerRegistrationLocations(ObjectID objectID);

    Set<? extends DescribedLocation> getRelatedLocations(LocationID locationID, boolean forwards, RelatedLocationKind kind, boolean intraprocedural);

    Set<ObjectID> getEnclosingFunction(LocationID locationID);

    dk.brics.inspector.api.model.Optional<DescribedLocation> getPositionalLocationID(FileID fileID, int line, int column, Optional<ContextID> context);

    Set<DescribedContext> getFilteredContexts(LocationID locationID, String expressionString);
}
