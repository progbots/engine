import { ITest } from './ITest'

export function execute<T extends ITest> (descriptions: Record<string, T | T[]>, executeDescription: (test: T) => undefined): void {
  Object.keys(descriptions).forEach((label: string) => {
    const description = descriptions[label]
    let tests: T[] = []
    if (Array.isArray(description)) {
      tests = description
    } else if (description !== undefined) {
      tests = [description]
    }
    tests.forEach((test, index) => {
      let testLabel
      if (index > 0) {
        testLabel = `${label} (${index + 1})`
      } else {
        testLabel = label
      }
      if (test.skip === true) {
        it.skip(testLabel, () => executeDescription(test))
      } else if (test.only === true) {
        it.only(testLabel, () => executeDescription(test))
      } else {
        it(testLabel, () => executeDescription(test))
      }
    })
  })
}
