// Generated using typescript-generator version 1.19.294 on 2017-06-21 11:09:13.

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

interface Gutter<T> {
    kind: GutterKind;
    name: string;
    description: string;
    data: LineMap<T>;
}

interface LineMap<T> {
    data: { [index: string]: T };
}

interface LineMessage {
    sourceRange: SourceRange;
    message: string;
    severity: MessageSeverity;
    status: MessageStatus;
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
    value: string;
}

interface BoxedOptionValues {
}

interface OptionData {
    options: BoxedOptionValues;
    experimentalOptions: BoxedExperimentalOption[];
}

interface CompositeValue {
    values: SingleValue[];
}

interface DescribedObject extends SingleValue {
    rendering: string;
    kind: ObjectKind;
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

type RelatedLocationKind = "NODE" | "BLOCK" | "LINE";

type GutterKind = "NUMBER" | "STRING";

type LineValueKind = "UNKNOWN" | "VARIABLE" | "REGISTER" | "FIXED_PROPERTY" | "DYNAMIC_PROPERTY";

type MessageSeverity = "TAJS_ERROR" | "HIGH" | "MEDIUM_IF_CERTAIN_NONE_OTHERWISE" | "MEDIUM" | "LOW" | "TAJS_META" | "TAJS_UNSOUNDNESS";

type MessageStatus = "CERTAIN" | "MAYBE" | "INFO" | "NONE";

type ObjectKind = "OBJECT" | "FUNCTION" | "ARRAY" | "STRING" | "BOOLEAN" | "NUMBER" | "REGEXP" | "DATE" | "ERROR" | "MATH" | "ACTIVATION" | "ARGUMENTS";
