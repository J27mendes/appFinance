/** @type {import('jest').Config} */
const config = {
  verbose: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.js'],
}

export default config
