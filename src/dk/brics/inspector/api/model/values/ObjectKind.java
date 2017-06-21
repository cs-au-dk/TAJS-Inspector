package dk.brics.inspector.api.model.values;

/**
 * The kind of object values in the analysis.
 * TODO make less TAJS/JavaScript-specific.
 */
public enum ObjectKind {
    OBJECT,
    FUNCTION,
    ARRAY,
    STRING,
    BOOLEAN,
    NUMBER,
    REGEXP,
    DATE,
    ERROR,
    MATH,
    ACTIVATION,
    ARGUMENTS,
}
