export function cycles (iterator: Generator<void>): number {
  let count = 0
  let { done } = iterator.next()
  while (done === false) {
    ++count
    done = iterator.next().done
  }
  return count
}
