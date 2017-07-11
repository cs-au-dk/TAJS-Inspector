package dk.brics.inspector.api.model;

import java.util.Map;

/**
 * Configuration options of an analysis.
 */
public class OptionData {

    public final Map<String, String> options;

    public OptionData(Map<String, String> options) {
        this.options = options;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OptionData that = (OptionData) o;

        return options != null ? options.equals(that.options) : that.options == null;
    }

    @Override
    public int hashCode() {
        return options != null ? options.hashCode() : 0;
    }
}
