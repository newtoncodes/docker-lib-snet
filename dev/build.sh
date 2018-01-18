#!/usr/bin/env bash

dir=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)

cd ${dir}/.. && docker build -t newtoncodes/snet .
cd ${dir}/.. && docker build -t newtoncodes/snet:1.0.0 .
