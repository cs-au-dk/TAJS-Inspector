package dk.brics.inspector.api.model.lines;

import dk.brics.inspector.api.model.Optional;
import dk.brics.inspector.api.model.locations.SourceRange;

/**
 * A message from the analysis.
 */
public class LineMessage {

    public final SourceRange sourceRange;

    public final String message;

    public final MessageLevel level;

    public final MessageSource source;

    public final Optional<MessageCertainty> certainty;

    public LineMessage(SourceRange sourceRange, String message, MessageLevel level, MessageSource source, Optional<MessageCertainty> certainty) {
        this.sourceRange = sourceRange;
        this.message = message;
        this.level = level;
        this.source = source;
        this.certainty = certainty;
    }
}
