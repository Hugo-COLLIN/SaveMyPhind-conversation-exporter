module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Only test files inside `tests/` folder
  // setupFilesAfterEnv: ['./tests/setup.ts'],
};
