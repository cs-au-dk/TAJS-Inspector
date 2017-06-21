package dk.brics.inspector.api.model.lines;

/**
 * Different kinds of {@link LineValue}.
 */
public enum LineValueKind {
    UNKNOWN,
    VARIABLE,
    REGISTER,
    FIXED_PROPERTY,
    DYNAMIC_PROPERTY
}
