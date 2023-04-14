import { getReplHost } from './replHost'
import { cyan, green, red, white, yellow } from './colors'
import { hostDictionary } from './host'
import { createState } from '../factory'
import { ExitError } from './host/exit'
import { BaseError } from '../errors/BaseError'
import { reset, increment } from './cycle'
import { status } from './status'

export async function main (debug: boolean): Promise<void> {
  const replHost = getReplHost()
  if (debug) {
    replHost.output(`${green}DEBUG mode enabled${white}`)
  }
  replHost.output(`${cyan}Use '${yellow}exit${cyan}' to quit
Use '${yellow}state${cyan}' to print a state summary${white}`)

  const state = createState({
    hostDictionary,
    keepDebugInfo: debug
  })
  let replIndex = 0

  while (true) {
    const src = await replHost.getInput()
    try {
      const lastUsedMemory = state.usedMemory
      reset()
      const iterator = state.parse(src, `repl${replIndex++}`)
      let { done } = iterator.next()
      while (done === false) {
        increment()
        done = iterator.next().done
      }
      status(state, {
        lastUsedMemory
      })
    } catch (e) {
      if (e instanceof ExitError) {
        break
      } else if (e instanceof BaseError) {
        replHost.output(`${red}/!\\ ${e.name}: ${e.message}\n${e.callstack}${white}`)
      } else {
        replHost.output(`${red}${(e as Error).toString()}${white}`)
        break
      }
    }
  }
}
