# TAJS Inspector

This folder contains the source code for the TAJS Inspector web application, and should only be consulted if further development of the tool is needed. 
 
## Prerequisites
* The project is build and generated with Angular CLI that has dependencies that require Node 6.9.0 or higher, together with NPM 3 or higher.
* Run `npm install` to download all needed dependencies.

## Usage
* The application assumes that an instance of `dk.brics.inspector.api.InspectorAPI` (e.g. ` dk.brics.inspector.server.InspectorServer`) is up and running, and available at `http://127.0.0.1:12345/api/<approximate-method-name>`.
* For an example instantiation of the above, consult `dk.brics.tajs.monitoring.inspector.QuickShow` of the TAJS main repository.

## Development server
Run `ng serve` or `npm run start` to start a development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The development server assumes that an instance of `dk.brics.inspector.api.InspectorAPI` is up and running, and available at `http://127.0.0.1:12345/api/<approximate-method-name>`.

## Authors
The following people have contributed to the source code:
* Simon Gregersen
