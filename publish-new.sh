#!/bin/bash

CURR_DIR="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
doctoc .
npm publish
cd $CURR_DIR