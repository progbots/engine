import { readSync } from 'node:fs'

export const readChar = (): string => {
  const buffer = Buffer.alloc(1)
  readSync(0, buffer, 0, 1, null)
  return buffer.toString('utf8')
}
