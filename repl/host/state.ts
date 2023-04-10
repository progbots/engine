import { InternalValue, State } from '../../state'
import { forEach } from '../forEach'
import { cyan, yellow, white, blue } from '../colors'
import { memory } from '../status'
import { formatters } from '../formatters'

export function * state (state: State): Generator {
  const dictLength = state.dictionaries.length
  console.log(`${cyan}memory: ${yellow}${memory(state)}
${cyan}dictionaries: ${yellow}${dictLength}${white}`)
  forEach(state.dictionaries, (value, formattedIndex) => {
    console.log(formattedIndex, formatters[value.type](value))
  })
  console.log(`${cyan}operands: ${yellow}${state.operands.length}${white}`)
  forEach(state.operands, (value, formattedIndex) => {
    let debugInfo
    const { sourceFile, sourcePos } = value as InternalValue
    if (sourceFile === undefined || sourcePos === undefined) {
      debugInfo = ''
    } else {
      debugInfo = `${blue}@${sourceFile}(${sourcePos.toString()})${white}`
    }
    console.log(formattedIndex, formatters[value.type](value), debugInfo)
  })
}
