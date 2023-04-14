interface IReplHost {
  output: (text: string) => void
  getInput: () => Promise<string>
  getChar: () => Promise<string>
  getSample: (name: string) => string
}

let replHost: IReplHost

export function setReplHost (value: IReplHost): void {
  replHost = value
}

export function getReplHost (): IReplHost {
  return replHost
}
