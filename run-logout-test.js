const { execSync } = require('child_process');

try {
  const output = execSync(
    'npx jest --no-watch --coverage --collectCoverageFrom="app/components/LogOut.jsx" __tests__/LogOut.test.jsx',
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
} 