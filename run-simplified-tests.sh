#!/bin/bash

# Exit on error
set -e

echo "=== Thunder Buddy Simplified Test Runner ==="

# Make sure the mock directories exist
echo "Setting up mock directories..."
mkdir -p __mocks__/@testing-library
mkdir -p __tests__/mocks
mkdir -p __mocks__

# Clear Jest cache
echo "Clearing Jest cache..."
rm -rf node_modules/.cache/jest

# Run the WebBrowser mock test
echo "Running WebBrowser mock test..."
npx jest __tests__/WebBrowserMock.test.js --no-cache --verbose || {
  echo "WebBrowser mock test failed. This indicates a problem with Jest mocking."
  exit 1
}

# Run the LogOut render test
echo "Running LogOut render test..."
npx jest __tests__/LogOutRender.test.jsx --no-cache --verbose || {
  echo "LogOut render test failed. Check the error messages above."
  exit 1
}

# Run the LogOut direct test
echo "Running LogOut direct test..."
npx jest __tests__/LogOut-direct.test.jsx --no-cache --verbose || {
  echo "LogOut direct test failed. Check the error messages above."
  exit 1
}

# Run the final LogOut test
echo "Running final LogOut test..."
npx jest __tests__/LogOut.final.test.jsx --no-cache --verbose || {
  echo "Final LogOut test failed. Check the error messages above."
  exit 1
}

echo "All simplified tests passed!"
echo "You can now run the full test suite with: npm run test:ci" 