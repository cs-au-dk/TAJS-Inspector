package dk.brics.inspector.api.model.lines;

/**
 * Information to be displayed next to each line of source code.
 */
public class Gutter<T> {

    public final GutterKind kind;

    public final String name;

    public final String description;

    public final LineMap<T> data;

    public Gutter(GutterKind kind, String name, String description, LineMap<T> data) {
        this.kind = kind;
        this.name = name;
        this.description = description;
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Gutter<?> gutter = (Gutter<?>) o;

        if (kind != gutter.kind) return false;
        if (name != null ? !name.equals(gutter.name) : gutter.name != null) return false;
        if (description != null ? !description.equals(gutter.description) : gutter.description != null) return false;
        return data != null ? data.equals(gutter.data) : gutter.data == null;
    }

    @Override
    public int hashCode() {
        int result = kind != null ? kind.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (data != null ? data.hashCode() : 0);
        return result;
    }
}
