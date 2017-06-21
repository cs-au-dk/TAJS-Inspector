package dk.brics.inspector.api.model.options;

import java.util.Set;

/**
 * Configuration options of an analysis.
 * // TODO support simpler, less TAJS-specific abstraction: 'Map<String, String>'
 */
public class OptionData {

    public final BoxedOptionValues options;

    public final Set<BoxedExperimentalOption> experimentalOptions;

    public OptionData(BoxedOptionValues options, Set<BoxedExperimentalOption> experimentalOptions) {
        this.options = options;
        this.experimentalOptions = experimentalOptions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OptionData that = (OptionData) o;

        if (options != null ? !options.equals(that.options) : that.options != null) return false;
        return experimentalOptions != null ? experimentalOptions.equals(that.experimentalOptions) : that.experimentalOptions == null;
    }

    @Override
    public int hashCode() {
        int result = options != null ? options.hashCode() : 0;
        result = 31 * result + (experimentalOptions != null ? experimentalOptions.hashCode() : 0);
        return result;
    }
}
