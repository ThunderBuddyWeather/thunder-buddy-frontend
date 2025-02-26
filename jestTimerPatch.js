// This file patches the timer functions for @testing-library/react-native
const { jest } = require('@jest/globals');

// Define global.globalObj if it doesn't exist
if (!global.globalObj) {
  global.globalObj = global;
}

// Ensure timer functions are properly mapped
global.globalObj.setTimeout = global.setTimeout;
global.globalObj.clearTimeout = global.clearTimeout;
global.globalObj.setInterval = global.setInterval;
global.globalObj.clearInterval = global.clearInterval;

console.log('Timer functions patched for @testing-library/react-native');
console.log('globalObj.setTimeout exists:', typeof global.globalObj.setTimeout === 'function');

// Patch the screen object from @testing-library/react-native if it's loaded
try {
  const testingLibrary = require('@testing-library/react-native');
  if (testingLibrary && testingLibrary.screen) {
    console.log('Patching @testing-library/react-native screen object');
  }
} catch (error) {
  console.log('Could not patch @testing-library/react-native screen object:', error.message);
}

// Use real timers
jest.useRealTimers(); 