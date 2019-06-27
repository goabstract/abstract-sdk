#!/usr/bin/env bash

# This script can be used to install all required flow types that are used
# internally within this package. This is intended to be run as a postinstall
# NPM script, but it can be run at any time to refresh and update definitions.

types=(
  "jest@^23.x.x"
  "query-string@^6.x.x"
  "nock@^10.x.x"
  "uuid@^3.x.x"
)

for i in "${types[@]}"
do
  npx flow-typed install $i
done
