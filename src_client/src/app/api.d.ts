// Generated using typescript-generator version 1.19.294 on 2017-07-31 08:10:37.

interface OptionData {
    options: { [index: string]: string };
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
    level: MessageLevel;
    source: MessageSource;
    certainty: Optional<MessageCertainty>;
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

interface CompositeValue {
    values: SingleValue[];
}

interface DescribedObject extends SingleValue {
    rendering: string;
    invokable: boolean;
    id: ObjectID;
}

interface DescribedPrimitive extends SingleValue {
    rendering: string;
}

interface DescribedProperties {
    metaProperties: { [index: string]: CompositeValue };
    properties: { [index: string]: CompositeValue };
}

interface SingleValue {
}

type RelatedLocationKind = "NODE" | "BLOCK" | "LINE";

type GutterKind = "NUMBER" | "STRING" | "BOOLEAN";

type LineValueKind = "UNKNOWN" | "VARIABLE" | "REGISTER" | "FIXED_PROPERTY" | "DYNAMIC_PROPERTY";

type MessageCertainty = "CERTAIN" | "MAYBE";

type MessageLevel = "INFO" | "WARN" | "ERROR";

type MessageSource = "ANALYSIS_BEHAVIOR" | "ANALYSIS_RESULT";

type ObjectKind = "CALLABLE" | "NON_CALLABLE";
