#!/bin/bash

# Generate a random number between 1 and 10
MINUTES=$(( ( RANDOM % 60 )  + 1 ))

# Wait for the random number of minutes
sleep ${MINUTES}m

# Restart the PM2 process
pnpm once