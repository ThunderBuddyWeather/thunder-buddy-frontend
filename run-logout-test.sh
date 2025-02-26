#!/bin/bash

# Exit on error
set -e

echo "=== Running LogOut Test ==="

# Make sure the mock directories exist
echo "Setting up mock directories..."
mkdir -p __mocks__/@testing-library
mkdir -p __tests__/mocks
mkdir -p __mocks__

# Clear Jest cache
echo "Clearing Jest cache..."
rm -rf node_modules/.cache/jest

# Run the LogOut test
echo "Running LogOut test..."
npx jest __tests__/LogOut.test.jsx --no-cache --verbose || {
  echo "LogOut test failed. Check the error messages above."
  exit 1
}

echo "LogOut test passed!" 