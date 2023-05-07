const crypto = require('crypto')
const { readFileSync } = require('fs')
const { join } = require('path')
// const { writeFileSync } = require('fs')
// const { relative } = require('path')

// npx jest --findRelatedTests operators/add.ts --listTests
// npx jest --findRelatedTests operators/integer.ts --listTests
// npx jest --findRelatedTests operators/operands.ts --listTests

module.exports = {
  extract (code, filePath, defaultExtract) {
    // const relPath = relative(__dirname, filePath)
    // const logPath = join(__dirname, 'dependencyExtractor', relPath.replace(/\/|\\/g, '_') + '.txt')
    // writeFileSync(logPath, filePath + '\n', { flag: 'a' })
    if (filePath.endsWith('.spec.ts')) {
      const set = new Set()
      set.add(filePath.replace('.spec.ts', '.ts'))
      code.replace(/\/\/\s*test-for\s+([^\r\n]*)\r?\n/g, (match, dependencies) => {
        dependencies.replace(/\s*([^ ,]+),?/g, (match, dependency) => {
          set.add(join(filePath, '..', dependency))
        })
      })
      if (filePath.match(/\boperators\b/)) {
        set.add(join(filePath, '../operands.ts'))
      }
      // writeFileSync(logPath, '\tset:' + JSON.stringify([...set.entries()], undefined, 2) + '\t', { flag: 'a' })
      return set
    }
    // writeFileSync(logPath, '\tnot a spec\n', { flag: 'a' })
    return new Set()
  },
  getCacheKey () {
    return crypto
      .createHash('md5')
      .update(readFileSync(__filename))
      .digest('hex')
  }
}
