#!/bin/bash

PORT=1234
npm run start-no-browser >/dev/null 2>&1&
$(npm bin)/wait-on -t 15000 "http-get://localhost:$PORT"
NODE_PID=$(lsof -i :$PORT -t)
if [ -z "NODE_PID" ]
then
    echo "Node ain't running, nothing to do"
    exit 1
else
    echo "Node is running as $NODE_PID, executing tests"
    $(npm bin)/cypress run --project e2e-tests
    CYPRESS_EXIT_STATUS=$(echo $?)
    echo "Stopping Node"
    kill $NODE_PID
    exit $CYPRESS_EXIT_STATUS
fi