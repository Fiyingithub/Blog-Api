// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  setupFilesAfterEnv: ['../Tests/Setup.test.js'],
};
