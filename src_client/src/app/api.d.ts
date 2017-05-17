// Generated using typescript-generator version 1.19.294 on 2017-05-05 13:12:00.

interface Gutter<T> {
    kind: GutterKind;
    name: string;
    description: string;
    data: LineMap<T>;
}

interface Optional<T> {
    value: T;
}

interface ContextID extends String {
}

interface FileID extends String {
}

interface LocationID extends String {
}

interface ObjectID extends String {
}

interface LineData {
    stateSizes: LineMap<number>;
    messages: LineMap<LineMessage[]>;
    allocationCounts: LineMap<number>;
    blockVisitCounts: LineMap<number>;
    normalizedBlockVisitCounts: LineMap<number>;
    durations: LineMap<number>;
    normalizedDurations: LineMap<number>;
    contextCounts: LineMap<number>;
    calls_in: LineMap<number>;
    calls_out: LineMap<number>;
    maxSuspiciousness: LineMap<number>;
    fullUnknownValueResolve: LineMap<number>;
    partialUnknownValueResolve: LineMap<number>;
    maxRecoveryGraphSize: LineMap<number>;
}

interface LineMap<T> {
    data: { [index: string]: T };
}

interface LineMessage {
    sourceRange: SourceRange;
    message: string;
    severity: Severity;
    status: Status;
}

interface LineValue {
    identifier: string;
    location: DescribedLocation;
    value: CompositeValue;
    kind: LineValueKind;
}

interface ContextInsensitiveDescribedLocation extends DescribedLocation {
}

interface ContextSensitiveDescribedLocation extends DescribedLocation {
    context: DescribedContext;
}

interface DescribedContext {
    id: ContextID;
    rendering: string;
}

interface DescribedLocation {
    fileID: FileID;
    range: SourceRange;
    id: LocationID;
    order: number;
}

interface FileDescription {
    id: FileID;
    name: string;
    content: string;
}

interface SourceRange {
    columnStart: number;
    columnEnd: number;
    lineStart: number;
    lineEnd: number;
}

interface BoxedExperimentalOption {
    kind: string;
    value: ExperimentalOption;
}

interface OptionData {
    options: OptionValues;
    experimentalOptions: BoxedExperimentalOption[];
}

interface CompositeValue {
    values: SingleValue[];
}

interface DescribedObject extends SingleValue {
    rendering: string;
    kind: Kind;
    id: ObjectID;
}

interface DescribedPrimitive extends SingleValue {
    rendering: string;
}

interface DescribedProperties {
    prototype: CompositeValue;
    internal: CompositeValue;
    array: CompositeValue;
    nonArray: CompositeValue;
    properties: { [index: string]: CompositeValue };
}

interface SingleValue {
}

interface ExperimentalOption {
}

interface OptionValues {
    noPostInitializationEvents: boolean;
    unsoundness: UnsoundnessOptionValues;
    propagateDeadFlow: boolean;
    evalStatistics: boolean;
    loopUnrollings: number;
    config: string;
    arguments: string[];
    soundnessTesterOptions: SoundnessTesterOptions;
    debugOrTestEnabled: boolean;
    optionValues: { [index: string]: any };
    libraries: string[];
    alwaysCanPut: boolean;
    callGraphEnabled: boolean;
    chargedCallsDisabled: boolean;
    showVariableInfoEnabled: boolean;
    contextSensitiveHeapEnabled: boolean;
    contextSpecializationEnabled: boolean;
    controlSensitivityDisabled: boolean;
    copyOnWriteDisabled: boolean;
    coverageEnabled: boolean;
    domenabled: boolean;
    exceptionsDisabled: boolean;
    flowGraphEnabled: boolean;
    forInSpecializationDisabled: boolean;
    gcdisabled: boolean;
    hybridCollectionsDisabled: boolean;
    ignoreHTMLContent: boolean;
    ignoreLibrariesEnabled: boolean;
    intermediateStatesEnabled: boolean;
    lazyDisabled: boolean;
    lowSeverityEnabled: boolean;
    loopUnrollingEnabled: boolean;
    memoryMeasurementEnabled: boolean;
    modifiedDisabled: boolean;
    newFlowEnabled: boolean;
    noMessages: boolean;
    objectSensitivityDisabled: boolean;
    determinacyEnabled: boolean;
    parameterSensitivityEnabled: boolean;
    polymorphicDisabled: boolean;
    recencyDisabled: boolean;
    returnJSON: boolean;
    singleEventHandlerType: boolean;
    statisticsEnabled: boolean;
    testEnabled: boolean;
    testFlowGraphBuilderEnabled: boolean;
    timingEnabled: boolean;
    unevalizerEnabled: boolean;
    ignoreUnreachableEnabled: boolean;
    concreteNativeDisabled: boolean;
    polyfillMDNEnabled: boolean;
    polyfillES6CollectionsEnabled: boolean;
    polyfillTypedArraysEnabled: boolean;
    asyncEventsEnabled: boolean;
    internalValueSplittingDisabled: boolean;
    noComplementStringsEnabled: boolean;
    showInternalMessagesEnabled: boolean;
    consoleModelEnabled: boolean;
    commonAsyncPolyfillEnabled: boolean;
    noStrictEnabled: boolean;
    noNewAssumesEnabled: boolean;
    oldAssumesEnabled: boolean;
    noSpecialStringsEnabled: boolean;
    postInitializationEventsDisabled: boolean;
    noCanonicalizeModifiedEnabled: boolean;
    deterministicCollectionsEnabled: boolean;
    specializeAllBoxedPrimitivesEnabled: boolean;
    quietEnabled: boolean;
    debugEnabled: boolean;
}

interface UnsoundnessOptionValues {
    noImplicitGlobalVarDeclarations: boolean;
    ignoreStringSearchCallback: boolean;
    ignoreMissingNativeModels: boolean;
    usePreciseFunctionToString: boolean;
    ignoreImpreciseEvals: boolean;
    ignoreAsyncEvals: boolean;
    useOrderedObjectKeys: boolean;
    ignoreLocale: boolean;
    warnAboutAllStringCoercions: boolean;
    ignoreImpreciseFunctionConstructor: boolean;
    useDeterministicNondeterminism: boolean;
    ignoreUnlikelyPropertyReads: boolean;
    showUnsoundnessUsage: boolean;
    ignoreSomePrototypesDuringDynamicPropertyReads: boolean;
}

interface SoundnessTesterOptions {
    test: boolean;
    generate: boolean;
    regenerate: boolean;
    rootDirFromMainDirectory: string;
    explicitSoundnessLogFile: string;
    nonInteractive: boolean;
    generatorEnvironmentExplicitly: Environment;
    timeLimitExplicitly: number;
    instrumentationTimeLimitExplicitly: number;
    onlyIncludesForInstrumentation: string[];
    ignoreShaDifference: boolean;
    useUncompressedLogFileForInference: boolean;
    printErrorsWithoutThrowingException: boolean;
    forceUpdateSha: boolean;
}

type GutterKind = "NUMBER" | "STRING";

type LineValueKind = "UNKNOWN" | "VARIABLE" | "REGISTER" | "FIXED_PROPERTY" | "DYNAMIC_PROPERTY";

type RelatedLocationKind = "NODE" | "BLOCK" | "LINE";

type Severity = "TAJS_ERROR" | "HIGH" | "MEDIUM_IF_CERTAIN_NONE_OTHERWISE" | "MEDIUM" | "LOW" | "TAJS_META" | "TAJS_UNSOUNDNESS";

type Status = "CERTAIN" | "MAYBE" | "INFO" | "NONE";

type Kind = "OBJECT" | "FUNCTION" | "ARRAY" | "REGEXP" | "DATE" | "STRING" | "NUMBER" | "BOOLEAN" | "ERROR" | "MATH" | "ACTIVATION" | "ARGUMENTS";

type Environment = "NODE" | "NODE_GLOBAL" | "NASHORN" | "BROWSER" | "DRIVEN_BROWSER";
