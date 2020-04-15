#!/bin/bash

declare NPM_PID
export SPEIL_BACKEND_PORT=4000

function node_pid {
    echo $(lsof -i :$SPEIL_BACKEND_PORT -t)
}

function cleanup {
    local -r exit_code=$?
    echo "Something errored, with exit code $exit_code. Stopping processes"
    kill $NPM_PID
    exit $exit_code
}
trap cleanup ERR

npm run dev-express &
NPM_PID=$!

echo "Started Node, waiting for it to accept connections..."
timeout 10 bash -c 'while [[ "$(curl -L -s -o /dev/null -w ''%{http_code}'' localhost:'$SPEIL_BACKEND_PORT')" != "200" ]]; do sleep 1; done' || false

NODE_PID=$(node_pid)
if [[ ! "$NODE_PID" =~ ^[0-9]+$ ]]; then
    echo "Node ain't running, nothing to do"
    exit 1
fi

echo "Node is running as pid $NODE_PID, executing tests"

$(npm bin)/cypress run --project e2e-tests

echo "Done"
