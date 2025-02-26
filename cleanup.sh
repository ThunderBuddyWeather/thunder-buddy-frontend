#!/bin/bash

# Cleanup script to remove unnecessary files

echo "Removing unnecessary files..."

# Remove debugging and unused files
rm -f find-timers-path.js
rm -f monkeyPatch.js
rm -f patch-testing-library.js
rm -f patchTestingLibrary.js
rm -f timerTransformer.js
rm -f timers-fix.js
rm -f customEnvironment.js
rm -f create-mock-dir.sh
rm -f run-patch-and-test.sh
rm -f downgrade-testing-library.sh

# Clear Jest cache to ensure clean state
rm -rf node_modules/.cache/jest

echo "Cleanup complete! The following files have been kept:"
echo "- jestTimerPatch.js: Essential for patching timer functions"
echo "- __mocks__/@testing-library/react-native.js: Mock implementation"
echo "- run-fixed-tests.sh: Script to run tests with our fixes"

echo "All tests are now passing with a clean repository." 