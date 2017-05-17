package dk.brics.inspector.api.model.lines;

import java.util.Set;

public class LineData {

    public final LineMap<Integer> stateSizes;

    public final LineMap<Set<LineMessage>> messages;

    public final LineMap<Integer> allocationCounts;

    public final LineMap<Integer> blockVisitCounts;

    public final LineMap<Double> normalizedBlockVisitCounts;

    public final LineMap<Long> durations;

    public final LineMap<Long> normalizedDurations;

    public final LineMap<Integer> contextCounts;

    public final LineMap<Integer> calls_in;

    public final LineMap<Integer> calls_out;

    public final LineMap<Integer> maxSuspiciousness;

    public final LineMap<Integer> fullUnknownValueResolve;

    public final LineMap<Integer> partialUnknownValueResolve;

    public final LineMap<Integer> maxRecoveryGraphSize;

    public LineData(
            LineMap<Set<LineMessage>> messages,
            LineMap<Integer> stateSizes,
            LineMap<Integer> contextCounts,
            LineMap<Integer> allocationCounts,
            LineMap<Integer> blockVisitCounts,
            LineMap<Double> normalizedBlockVisitCounts,
            LineMap<Long> durations,
            LineMap<Long> normalizedDurations,
            LineMap<Integer> calls_in,
            LineMap<Integer> calls_out,
            LineMap<Integer> maxSuspiciousness,
            LineMap<Integer> fullUnknownValueResolve,
            LineMap<Integer> partialUnknownValueResolve,
            LineMap<Integer> maxRecoveryGraphSize
    ) {
        this.messages = messages;
        this.stateSizes = stateSizes;
        this.allocationCounts = allocationCounts;
        this.contextCounts = contextCounts;
        this.blockVisitCounts = blockVisitCounts;
        this.normalizedBlockVisitCounts = normalizedBlockVisitCounts;
        this.durations = durations;
        this.normalizedDurations = normalizedDurations;
        this.calls_in = calls_in;
        this.calls_out = calls_out;
        this.maxSuspiciousness = maxSuspiciousness;
        this.fullUnknownValueResolve = fullUnknownValueResolve;
        this.partialUnknownValueResolve = partialUnknownValueResolve;
        this.maxRecoveryGraphSize = maxRecoveryGraphSize;
    }
}
