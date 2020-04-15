#!/bin/bash

export SPEIL_BACKEND_PORT=4000

function node_pid {
    echo $(lsof -i :$SPEIL_BACKEND_PORT -t)
}

function process_group {
    server_pid=$(node_pid)
    [[ -z "$server_pid" ]] && echo "No PID found for the express server" && exit 1
    echo $(ps o pgid -p $server_pid | tail -n 1)
}

PGID=$(process_group)

echo "Stopping processes in group $PGID"
kill -- -$PGID
