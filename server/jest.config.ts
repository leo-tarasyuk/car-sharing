process.env.NODE_ENV = "UNITTEST";
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["./src/**/*.ts"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["./tests/bootstrap.ts"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testTimeout: 5000,
};
