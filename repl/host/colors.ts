import { State } from '../../state/index'
import { blue, cyan, green, magenta, red, white, yellow } from '../colors'
import { getReplHost } from '../replHost'

export function * colors (state: State): Generator {
  getReplHost().output(`${red}red${green}green${yellow}yellow${blue}blue${magenta}magenta${cyan}cyan${white}white`)
}
