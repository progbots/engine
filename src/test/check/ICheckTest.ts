export interface ICheckTest<T> {
  name: string
  check: (value: any) => void
  ok: T[]
  ko: any[]
}
