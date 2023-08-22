/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

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
    'factory\\.ts',
    'formatters\\.ts',
    'test-helpers\\.ts',
    'utf8toansii\\.ts',
    '/engine/repl'
  ],
  roots: ['./src'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}
