import { ICheckTest } from './ICheckTest'

export function executeCheckTests<T> ({ name, check, ok, ko }: ICheckTest<T>): void {
  describe(name, () => {
    ok
      .forEach(value => {
        const valueAsString = JSON.stringify(value)
        it(`validates ${valueAsString} (check)`, () => {
          expect(() => check(value)).not.toThrowError()
        })
      })
    ko
      .forEach(value => {
        const valueAsString = JSON.stringify(value)
        it(`invalidates ${valueAsString} (check)`, () => {
          expect(() => check(value)).toThrowError()
        })
      })
  })
}
