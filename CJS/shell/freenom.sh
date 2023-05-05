#!/bin/bash
dir=$(cd "$(dirname "$0")";pwd)
cd $dir
echo "Current Path:" $dir
# Generate a random number between 1 and 10
MINUTES=$(( ( RANDOM % 10 )  + 1 ))

# Wait for the random number of minutes
#sleep ${MINUTES}m

# Restart the NODE process
nohup node ../src/freenom/index.cjs >> freenom_log 2>&1
