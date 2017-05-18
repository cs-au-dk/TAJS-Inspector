#!/bin/bash

set -x
set -e

#
# VARIABLES
#
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD=$DIR/build
JAVABUILD=$BUILD/java
JSBUILD=$BUILD/js
ALLBUILD=$BUILD/all
DIST=$DIR/dist
JAR=$DIST/inspector.jar
JARALL=$DIST/inspector-all.jar

#
# SETUP
#
. $HOME/.nvm/nvm.sh
nvm use 7
rm -rf $BUILD
mkdir -p $JAVABUILD
mkdir -p $JSBUILD
mkdir -p $DIST

#
# BUILD JAVA
#
javac -cp $(find $DIR/lib -name "*.jar" | tr "\n" ":") -d $JAVABUILD $(find $DIR/src -name \*.java)

#
# BUILD JAVASCRIPT
#
./gradlew generateTypeScript
pushd $DIR/src_client
npm install
node_modules/@angular/cli/bin/ng build --prod --aot --output-path $JSBUILD/dk/brics/inspector/client/standard-js-client
popd

#
# MAKE JAR
#
for dir in $JAVABUILD $JSBUILD; do pushd $dir; zip $JAR -ur .; popd; done

#
# MAKE STANDALONE JAR
#
for jar in $JAR $(find $DIR/lib -name "*.jar"); do unzip -d $ALLBUILD -uo $jar; done
pushd $ALLBUILD;
zip $JARALL -r .;
popd
