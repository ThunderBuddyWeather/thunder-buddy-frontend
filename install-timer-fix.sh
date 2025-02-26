#!/bin/bash

# Find the path to the timers.js file in node_modules
TIMERS_PATH="./node_modules/@testing-library/react-native/dist/helpers/timers.js"

# Check if the file exists
if [ -f "$TIMERS_PATH" ]; then
  # Backup the original file
  cp "$TIMERS_PATH" "$TIMERS_PATH.bak"
  
  # Copy our fixed version
  cp ./timers-fix.js "$TIMERS_PATH"
  
  echo "Successfully installed fixed timers.js"
else
  echo "Could not find $TIMERS_PATH"
  exit 1
fi

# Clear Jest cache
rm -rf node_modules/.cache/jest

# Run tests
npm run test:ci 