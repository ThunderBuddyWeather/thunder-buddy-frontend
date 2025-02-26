#!/bin/bash

# Exit on error
set -e

echo "=== Thunder Buddy Test Runner with Cache Clearing ==="

# Clear Jest cache
echo "Clearing Jest cache..."
rm -rf node_modules/.cache/jest

# Run tests
echo "Running tests..."
npm run test:ci

echo "Test run complete!" 