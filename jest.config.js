module.exports = {
  testPathIgnorePatterns: ["<rootDir>/lib"],
  snapshotSerializers: ["jest-serializer-path"],
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"] // https://github.com/facebook/jest/issues/2070
};
