import { State } from './types'

export function createState (): State {
  return {
    contexts: [],
    stack: []
  }
}
