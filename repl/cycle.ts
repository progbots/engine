let cycle = 0

export function reset (): void {
  cycle = 0
}

export function increment (): void {
  ++cycle
}

export function current (): number {
  return cycle
}
