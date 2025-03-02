module.exports  = {
    preset: 'ts-test',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    setupFiles: ['./jest.setup.js']
}