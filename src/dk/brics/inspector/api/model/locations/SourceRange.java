package dk.brics.inspector.api.model.locations;

/**
 * Range within a source file.
 */
public class SourceRange {

    public final int columnStart;

    public final int columnEnd;

    public final int lineStart;

    public final int lineEnd;

    public SourceRange(int lineStart, int lineEnd, int columnStart, int columnEnd) {
        this.columnStart = columnStart;
        this.columnEnd = columnEnd;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SourceRange that = (SourceRange) o;

        if (columnStart != that.columnStart) return false;
        if (columnEnd != that.columnEnd) return false;
        if (lineStart != that.lineStart) return false;
        return lineEnd == that.lineEnd;
    }

    @Override
    public int hashCode() {
        int result = columnStart;
        result = 31 * result + columnEnd;
        result = 31 * result + lineStart;
        result = 31 * result + lineEnd;
        return result;
    }
}
