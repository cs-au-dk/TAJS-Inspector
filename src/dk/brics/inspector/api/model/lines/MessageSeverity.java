package dk.brics.inspector.api.model.lines;

public enum MessageSeverity {
    // TODO support less TAJS-specific names
    TAJS_ERROR,
    HIGH,
    MEDIUM_IF_CERTAIN_NONE_OTHERWISE,
    MEDIUM,
    LOW,
    TAJS_META,
    TAJS_UNSOUNDNESS
}
