#!/bin/bash

set -e

npm run dev-express >/dev/null 2>&1&
echo "Started Node, waiting for it to accept connections..."
timeout 30 bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:3000)" != "200" ]]; do sleep 5; done' || false

NODE_PID=$(lsof -i :3000 -t)
if [ -z "NODE_PID" ]
then
    echo "Node ain't running, nothing to do"
    exit 1
else
    echo "Node is running as pid $NODE_PID, executing tests"
    $(npm bin)/cypress run --project e2e-tests
    CYPRESS_EXIT_STATUS=$(echo $?)
    echo "Stopping Node"
    kill $NODE_PID
    exit $CYPRESS_EXIT_STATUS
fi