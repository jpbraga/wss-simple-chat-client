#!/bin/bash
docker container rm -f wsssimpleclient
docker container run --name wsssimpleclient -itd -e JWT_SECRET='n5GySGhWlN9pWQBvmrnmJdKxmw-JTX0lKBSEYpYuOZY' -e WSS_ADDRESS='ws://localhost:8080'  jpbraga/wsssimplechatclient
docker attach wsssimpleclient