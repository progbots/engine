export interface IReplHost {
  output: (text: string) => void
  getInput: () => Promise<string>
  getChar: () => Promise<string>
  getSample: (name: string) => string
}
