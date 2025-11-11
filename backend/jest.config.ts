import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/dto/*.ts', '!src/**/decorators/**', '!src/**/guards/**'],
};

export default config;
