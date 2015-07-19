#!/usr/bin/env bash

docker push

cd eb
eb deploy
