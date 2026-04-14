#!/bin/bash

echo "Running script..."

curl http://localhost:3000/set/100
sleep 1
curl http://localhost:3000/set/90
sleep 0.3
curl http://localhost:3000/set/80
sleep 0.1
curl http://localhost:3000/set/70
sleep 0.1
curl http://localhost:3000/set/65
sleep 0.1
curl http://localhost:3000/set/60
sleep 0.1
curl http://localhost:3000/set/40
sleep 0.1
curl http://localhost:3000/set/20
sleep 0.1
curl http://localhost:3000/set/15
sleep 0.1
curl http://localhost:3000/set/10
sleep 0.1
curl http://localhost:3000/set/7
sleep 0.1
curl http://localhost:3000/set/5
sleep 0.1
curl http://localhost:3000/set/3
sleep 0.1
curl http://localhost:3000/set/1
sleep 0.1
curl http://localhost:3000/set/0
