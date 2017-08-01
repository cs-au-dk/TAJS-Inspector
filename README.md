# TAJS Inspector

TAJS Inspector is a web-based interface to display TAJS analysis results. It is primarily intended as a development tool for investigating information collected during analysis. This includes abstract values of variables and properties, call graphs, and type warnings, but also internal analysis information, such as, number of times each primitive instruction is processed, number of contexts for each function, and "imprecision suspiciousness" of abstract states.

## Components

The project is split into two components: a server side (Java) that receives data from the analysis (TAJS) implementation, and a
client side (JavaScript) that receives data from the server side.

### Client

The client side is implemented as an Angular/TypeScript project. It has its own [README](src_client/README.md).

### Server

The server side is implemented in plain Java, with dependencies on gson, log4j and jetty (see [build.gradle](build.gradle).

Users of the server only need to be concerned with the [api-package](src/dk/brics/inspector/api), and the main entry point class [InspectorSetup](src/dk/brics/inspector/InspectorSetup.java).

In order to use the inspector, an analysis-specific implementaion of [InspectorAPI](src/dk/brics/inspector/api/InspectorAPI.java) needs to be provided to [InspectorSetup](src/dk/brics/inspector/InspectorSetup.java):

 ```java
InspectorSetup.simpleStart(new MyAnalysisAPIImplementation());
```

This will start the server, and open the client-side in a browser window.


#### API implementation gotchas

Implementors of [InspectorAPI](src/dk/brics/inspector/api/InspectorAPI.java)-instances should be aware of the following:

- the InspectorAPI methods should be thread safe (the server is multi-threaded, and does not attempt to synchronize accesses to the InspectorAPI).
- the InspectorAPI methods should be idempotent

## Building

The entire project can be built with and a very rough build script:

```bash
$ ./simple-build.sh
```

Build results are found in dist/inspector.jar.

The jar-file also contains the (compiled) client side code.

The jar-file needs to be run in an environment with its dependencies present (see [build.gradle](build.gradle)).

## Notes for TAJS development

### Runtime

Build the project and copy the jar to TAJS/lib:

```bash
$ ./simple-build.sh
$ cp dist/inspector.jar ~/tajs/lib
```

### Javadoc

Use gradle to create javadoc:
```bash
$ ./gradlew javadoc
$ ls build/docs/javadoc/
```
