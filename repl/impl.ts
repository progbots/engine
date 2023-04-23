import { IReplHost } from './replHost'
import { blue, cyan, green, red, white, yellow } from './colors'
import { hostDictionary } from './host/index'
import { createState } from '../factory'
import { ExitError } from './host/exit'
import { memory, status } from './status'
import { $debug, $load, $state } from './signals'
import { renderCallStack } from '../state/callstack'
import { forEach } from './forEach'
import { formatters } from '../formatters'
import { InternalValue } from '../state/types'

export async function main (replHost: IReplHost, debug: boolean): Promise<void> {
  if (debug) {
    replHost.output(`${green}DEBUG mode enabled`)
  }
  replHost.output(`${cyan}Use '${yellow}exit${cyan}' to quit`)
  replHost.output(`${cyan}Use '${yellow}state${cyan}' to print a state summary`)

  const state = createState({
    hostDictionary,
    keepDebugInfo: debug
  })
  let replIndex = 0

  while (true) {
    const src = await replHost.getInput()
    try {
      let lastOperandsCount = state.operands.length
      let lastUsedMemory = state.usedMemory
      let cycle = 0
      let debugging = false

      const iterator = state.parse(src, `repl${replIndex++}`)
      let { done, value } = iterator.next()
      while (done === false) {
        let nextValue: unknown
        if (value === $state) {
          const dictLength = state.dictionaries.length
          replHost.output(`${cyan}memory: ${yellow}${memory(state)}`)
          replHost.output(`${cyan}dictionaries: ${yellow}${dictLength}`)
          forEach(state.dictionaries, (value, formattedIndex) => {
            replHost.output(`${formattedIndex} ${formatters[value.type](value)}`)
          })
          replHost.output(`${cyan}operands: ${yellow}${state.operands.length}`)
          forEach(state.operands, (value, formattedIndex) => {
            let debugInfo
            const { sourceFile, sourcePos } = value as InternalValue
            if (sourceFile === undefined || sourcePos === undefined) {
              debugInfo = ''
            } else {
              debugInfo = ` ${blue}@${sourceFile}(${sourcePos.toString()})`
            }
            replHost.output(`${formattedIndex} ${formatters[value.type](value)}${debugInfo}`)
          })
        } else if (value === $debug) {
          debugging = true
        } else if (value === $load) {
          const { data } = state.operands.at(0)
          try {
            nextValue = await replHost.getSample(data as string)
          } catch (e) {
            nextValue = e
          }
        }

        if (debugging) {
          replHost.output(renderCallStack(state.calls)
            .replace(/».*«/g, (match: string): string => `${yellow}${match}${white}`)
            .replace(/@.*\n/g, (match: string): string => `${blue}${match}${white}`)
            .replace(/\/!\\.*\n/g, (match: string): string => `${red}${match}${white}`)
            .replace(/…|↵|⭲/g, (match: string): string => `${blue}${match}${white}`)
          )
          replHost.output(status(state, {
            cycle,
            absolute: true,
            lastOperandsCount,
            lastUsedMemory,
            concat: `${cyan}, ${yellow}c${cyan}ontinue, ${yellow}q${cyan}uit`
          }))
          lastOperandsCount = state.operands.length
          lastUsedMemory = state.usedMemory
          const step = await replHost.getChar()
          if (step === 'q') {
            debugging = false
          }
        }

        ++cycle
        const next = iterator.next(nextValue)
        done = next.done
        value = next.value
      }
      replHost.output(status(state, {
        cycle,
        absolute: false,
        lastOperandsCount,
        lastUsedMemory
      }))
    } catch (e) {
      if (e instanceof ExitError) {
        break
      } else if (!(e instanceof Error)) {
        replHost.output(`${red}(X) Unknown error`)
      } else {
        const firstLine = e.toString()
        replHost.output(`${red}/!\\ ${firstLine}`)
        e.stack?.split('\n').forEach((line: string, index: number) => {
          if (index !== 0 || line !== firstLine) {
            replHost.output(`${red}${line}`)
          }
        })
      }
    }
  }
  replHost.output(`${red}terminated.`)
}
