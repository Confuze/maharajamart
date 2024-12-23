#!/bin/bash

set -a
source .env
set +a

echo "Waiting for MongoDB to start on mongo1:27017..."

until mongosh --quiet --host mongo1 --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --port 27017 --eval "db.runCommand({ ping: 1 }).ok" | grep 1 &>/dev/null; do
  sleep 1
done

echo "MongoDB has started successfully"

echo "Initiating MongoDB replica set..."

# NOTE: It has been many moons since I've written this code and for the life of me, I do not understand why mongosh connects to host.docker.internal and not mongo1
mongosh --host mongo1 --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --port 27017 --eval "
  rs.initiate({
    _id: 'rs0',
    members: [
      {
        _id: 0,
        host: 'mongo1:27017'
      },
      {
        _id: 1,
        host: 'mongo2:27018'
      },
      {
        _id: 2,
        host: 'mongo3:27019'
      }
    ]
  })
"
