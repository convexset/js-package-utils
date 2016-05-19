#!/bin/bash

echo "Script deprecated. (This is no longer maintained as a Meteor package.)"
exit

CURR_DIR="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/packages/package-utils
meteor publish --update
cd $CURR_DIR