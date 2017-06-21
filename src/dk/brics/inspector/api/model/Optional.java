package dk.brics.inspector.api.model;

/**
 * Standard optional-type.
 */
public class Optional<T> {

    public T value;

    public Optional(T value) {
        this.value = value;
    }

    public Optional() {
        this.value = null;
    }
}
