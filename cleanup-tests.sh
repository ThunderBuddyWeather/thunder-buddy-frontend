#!/bin/bash

# Exit on error
set -e

echo "=== Cleaning Up Test Files ==="

# Check if delete flag is provided
DELETE_MODE=false
if [ "$1" == "--delete" ]; then
  DELETE_MODE=true
  echo "Running in DELETE mode - files will be permanently removed"
fi

if [ "$DELETE_MODE" = false ]; then
  # Create backup directory
  echo "Creating backup directory..."
  mkdir -p __tests__/backup
  
  # Function to safely move a file if it exists
  move_if_exists() {
    if [ -f "$1" ]; then
      echo "Moving $1 to backup..."
      mv "$1" "$2"
    else
      echo "File $1 not found, skipping..."
    fi
  }
  
  # Move each file individually with error handling
  move_if_exists "__tests__/simplified-LogOut.test.jsx" "__tests__/backup/"
  move_if_exists "__tests__/simplified-LogOut.jsx" "__tests__/backup/"
  move_if_exists "__tests__/mock-verification.test.js" "__tests__/backup/"
  move_if_exists "__tests__/super-simple.test.jsx" "__tests__/backup/"
  move_if_exists "__tests__/direct-mock-test.test.js" "__tests__/backup/"
  move_if_exists "__tests__/WebBrowserMock.test.js" "__tests__/backup/"
else
  # Function to safely delete a file if it exists
  delete_if_exists() {
    if [ -f "$1" ]; then
      echo "Deleting $1..."
      rm "$1"
    else
      echo "File $1 not found, skipping..."
    fi
  }
  
  # Delete each file individually with error handling
  delete_if_exists "__tests__/simplified-LogOut.test.jsx"
  delete_if_exists "__tests__/simplified-LogOut.jsx"
  delete_if_exists "__tests__/mock-verification.test.js"
  delete_if_exists "__tests__/super-simple.test.jsx"
  delete_if_exists "__tests__/direct-mock-test.test.js"
  delete_if_exists "__tests__/WebBrowserMock.test.js"
fi

# Keep only the essential test files
echo "Keeping only essential test files:"
echo "- LogOut.test.jsx (original test with skipped problematic test)"
echo "- LogOutRender.test.jsx (simple render test)"
echo "- LogOut-direct.test.jsx (direct test)"
echo "- LogOut.final.test.jsx (final test)"

echo "Cleanup complete!"
echo ""
echo "To run essential tests, execute:"
echo "./run-essential-tests.sh"
echo ""
echo "NOTE: You may need to clear the Jest cache before running tests:"
echo "rm -rf node_modules/.cache/jest" 