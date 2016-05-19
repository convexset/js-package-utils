#!/bin/bash

CURR_DIR="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

DEFAULT_DURATION = 5

re='^[0-9]+$'
if (! [[ $1 =~ $re ]]) || [ $1 -lt 0 ] ; then
	echo "Using default duration: $DEFAULT_DURATION sec"
	DURATION=$DEFAULT_DURATION
else
	DURATION=$1
fi

while :
do
	npm test
	echo "Pausing for $DURATION sec before next test press [CTRL+C] to stop..."
	sleep $DURATION
done

cd $CURR_DIR