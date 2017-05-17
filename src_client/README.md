# TAJS Coverage Report

## Prerequisites
* The project is build and generated with Angular CLI that has dependencies that require Node 6.9.0 or higher, together with NPM 3 or higher.
* Make sure all git submodules are matching the current branch by running `git submodule update --init` at the root of TAJS-meta.

## Installationq
1. Run `npm install` to initialize project and download all dependencies.
2. Run `npm run deploy` to build and 'deploy' the application into the correct folder.

## Usage
NB: The application assumes that an instance of `LineAnalysisServer` is up and running, and available at `http://127.0.0.1:12345/api`.

* To run the server, please consult `/TAJS-meta/components/meta-core/src/dk/brics/tajs/meta/lineAnalysis2/LineAnalysisServer.java`. 
  * As of today (March 30, 2017), line 121 of the above needs to be modified and changed to a proper local path. 
* When running the main method of `LineAnalysisServer`, a browser window will automatically pop up. 
  * If not, browse to `http://127.0.0.1:12345` where the application will be available.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The dev server assumes that the TAJS `LineAnalysisServer` is available at `http://127.0.0.1:12345`.
