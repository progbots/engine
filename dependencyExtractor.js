const crypto = require('crypto')
const { readFileSync } = require('fs')
const { join } = require('path')

// npx jest --findRelatedTests operators/add.ts --listTests
// npx jest --findRelatedTests operators/integer.ts --listTests
// npx jest --findRelatedTests operators/operands.ts --listTests

module.exports = {
  extract (code, filePath, defaultExtract) {
    if (filePath.endsWith('.spec.ts')) {
      const set = new Set()
      set.add(filePath.replace('.spec.ts', '.ts'))
      code.replace(/\/\/\s*test-for\s+(.*)\n/, (match, dependencies) => {
        dependencies.replace(/\s*([^ ,]+),?/g, (match, dependency) => {
          set.add(join(filePath, '..', dependency))
        })
      })
      if (filePath.match(/\boperators\b/)) {
        set.add(join(filePath, '../operands.ts'))
      }
      return set
    }
    return new Set()
  },
  getCacheKey () {
    return crypto
      .createHash('md5')
      .update(readFileSync(__filename))
      .digest('hex')
  }
}
