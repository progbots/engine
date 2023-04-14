import { InternalValue, State } from '../../state/index'
import { forEach } from '../forEach'
import { cyan, yellow, white, blue } from '../colors'
import { memory } from '../status'
import { formatters } from '../../formatters'
import { getReplHost } from '../replHost'

export function * state (state: State): Generator {
  const replHost = getReplHost()
  const dictLength = state.dictionaries.length
  replHost.output(`${cyan}memory: ${yellow}${memory(state)}
${cyan}dictionaries: ${yellow}${dictLength}${white}`)
  forEach(state.dictionaries, (value, formattedIndex) => {
    replHost.output(`${formattedIndex} ${formatters[value.type](value)}`)
  })
  replHost.output(`${cyan}operands: ${yellow}${state.operands.length}${white}`)
  forEach(state.operands, (value, formattedIndex) => {
    let debugInfo
    const { sourceFile, sourcePos } = value as InternalValue
    if (sourceFile === undefined || sourcePos === undefined) {
      debugInfo = ''
    } else {
      debugInfo = ` ${blue}@${sourceFile}(${sourcePos.toString()})${white}`
    }
    replHost.output(`${formattedIndex} ${formatters[value.type](value)}${debugInfo}`)
  })
}
