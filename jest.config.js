/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  dependencyExtractor: './dependencyExtractor.js',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    '\\.spec\\.ts',
    'formatters\\.ts',
    'test-helpers\\.ts',
    'utf8toansii\\.ts',
    '/engine/repl'
  ]
}
