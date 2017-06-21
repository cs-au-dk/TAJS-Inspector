package dk.brics.inspector.api.model.lines;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Map where each entry corresponds to a line in the source code.
 */
public class LineMap<T> {

    public final Map<Integer, T> data;

    public LineMap(Map<Integer, T> data) {
        this.data = data;
    }

    public static <T> Map<Integer, T> convertToMap(List<T> data) {
        Map<Integer, T> map = new HashMap<>();
        for (int i = 0; i < data.size(); i++) {
            map.put(i, data.get(i));
        }
        return map;
    }

    public Map<Integer, T> viewAsMap() {
        return Collections.unmodifiableMap(data);
    }
}
