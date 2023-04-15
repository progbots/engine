export interface IReplHost {
  output: (text: string) => void
  getInput: () => Promise<string>
  getChar: (choices: Record<string, string>) => Promise<string>
  getSample: (name: string) => string
}
