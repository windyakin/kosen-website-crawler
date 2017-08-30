#!/bin/bash -xe

docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up
docker cp $(docker-compose ps -q crawler):/usr/src/app/screenshots .
docker-compose -f docker-compose.yml down
