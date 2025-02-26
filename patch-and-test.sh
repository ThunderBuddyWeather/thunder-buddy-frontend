#!/bin/bash

# Run the monkey patch
node monkeyPatch.js

# Clear Jest cache
rm -rf node_modules/.cache/jest

# Run tests
npm run test:ci 