#!/bin/bash

set -e

declare NPM_PID

function node_pid {
    echo $(lsof -i :3000 -t)
}

function cleanup {
    local -r exit_code=$?
    echo "Something errored, with exit code $exit_code. Stopping processes"
    kill $NPM_PID $(node_pid)
    exit $exit_code
}
trap cleanup ERR

npm run dev-express &>/dev/null &
NPM_PID=$!

echo "Started Node, waiting for it to accept connections..."
timeout 10 bash -c 'while [[ "$(curl -L -s -o /dev/null -w ''%{http_code}'' localhost:3000)" != "200" ]]; do sleep 1; done' || false

NODE_PID=$(node_pid)
if [ -z "NODE_PID" ]
then
    echo "Node ain't running, nothing to do"
    exit 1
else
    echo "Node is running as pid $NODE_PID, executing tests"
    $(npm bin)/cypress run --project e2e-tests
    echo "Done, stopping processes"
    kill $NODE_PID $NPM_PID
fi
