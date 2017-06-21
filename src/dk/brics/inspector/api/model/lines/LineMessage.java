package dk.brics.inspector.api.model.lines;

import dk.brics.inspector.api.model.locations.SourceRange;

/**
 * A message from the analysis.
 */
public class LineMessage {

    public final SourceRange sourceRange;

    public final String message;

    public final MessageSeverity severity;

    public final MessageStatus status;

    public LineMessage(SourceRange sourceRange, String message, MessageSeverity severity, MessageStatus status) {
        this.sourceRange = sourceRange;
        this.message = message;
        this.severity = severity;
        this.status = status;
    }
}
