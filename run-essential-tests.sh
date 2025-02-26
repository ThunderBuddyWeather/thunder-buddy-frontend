#!/bin/bash

# Exit on error
set -e

echo "=== Thunder Buddy Essential Test Runner ==="

# Make sure the mock directories exist
echo "Setting up mock directories..."
mkdir -p __mocks__/@testing-library
mkdir -p __tests__/mocks
mkdir -p __mocks__

# Clear Jest cache
echo "Clearing Jest cache..."
rm -rf node_modules/.cache/jest

# Run the original LogOut test
echo "Running original LogOut test..."
npx jest __tests__/LogOut.test.jsx --no-cache --verbose || {
  echo "Original LogOut test failed. Check the error messages above."
  exit 1
}

# Run the LogOut render test
echo "Running LogOut render test..."
npx jest __tests__/LogOutRender.test.jsx --no-cache --verbose || {
  echo "LogOut render test failed. Check the error messages above."
  exit 1
}

echo "All essential tests passed!"
echo "You can now run the full test suite with: npm run test:ci" 