/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    '**/modules/auth/auth.service.ts': { lines: 100, functions: 100, branches: 90 },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@petlanka/types$': '<rootDir>/../../../packages/types/src/index.ts',
    // @nestjs/jwt and @nestjs/passport are pure ESM — stub so Jest (CJS) can load them
    '^@nestjs/jwt$': '<rootDir>/test/nestjs-esm.stub.ts',
    '^@nestjs/passport$': '<rootDir>/test/nestjs-esm.stub.ts',
  },
};
