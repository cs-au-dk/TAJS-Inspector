package dk.brics.inspector.api;

import dk.brics.inspector.api.model.lines.Gutter;
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

import java.util.Optional;
import java.util.Set;

/**
 * API to be accessed directly by {@link dk.brics.inspector.server.InspectorServer} and indirectly by {@link dk.brics.inspector.client.InspectorClient}.
 */
public interface InspectorAPI {

    /**
     * @return ids of all files used by the analysis.
     */
    Set<FileID> getFileIDs();

    /**
     * @return description of the given file.
     */
    FileDescription getFileDescription(FileID id);

    /**
     * @return gutters for the given file.
     */
    Set<Gutter<?>> getGutters(FileID id);

    /**
     * @return configuration-options used by the analysis.
     */
    OptionData getOptions();

    /**
     * @return values of syntactic expressions on the given line of a file.
     */
    Set<LineValue> getLineValues(FileID fileID, int line);

    /**
     * @return locations the given object is allocated at.
     */
    Set<ContextSensitiveDescribedLocation> getAllocationLocations(ObjectID objectID);

    /**
     * @return properties of the given object at a location.
     */
    DescribedProperties getObjectProperties(ObjectID objectID, LocationID locationID);

    /**
     * @return locations the given function is invoked at.
     */
    Set<ContextSensitiveDescribedLocation> getCallLocations(ObjectID objectID);

    /**
     * @return locations the given function is registered as an event-handler at.
     */
    Set<ContextSensitiveDescribedLocation> getEventHandlerRegistrationLocations(ObjectID objectID);

    /**
     * Navigates the dataflow of the analysis.
     *
     * @param locationID      location to navigate from.
     * @param forwards        direction to navigate in (true: forwards, false: backwards).
     * @param kind            step-size of the navigation.
     * @param intraProcedural scope of the navigation (true: limit navigation to the enclosing function of the given location: stopping at function entry/exit and skipping intermediary function calls).
     * @return locations matching the query.
     */
    Set<? extends DescribedLocation> getRelatedLocations(LocationID locationID, boolean forwards, RelatedLocationKind kind, boolean intraProcedural);

    /**
     * @return function enclosing the given location.
     */
    Set<ObjectID> getEnclosingFunction(LocationID locationID);

    /**
     * @return location that matches the given positional information, optionally qualified by a context.
     */
    dk.brics.inspector.api.model.Optional<DescribedLocation> getPositionalLocationID(FileID fileID, int line, int column, Optional<ContextID> context);

    /**
     * @return the contexts present at the given location that matches the DSL-expression.
     */
    Set<DescribedContext> getFilteredContexts(LocationID locationID, String expressionString);
}
