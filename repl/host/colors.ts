import { State } from '../../state'
import { black, blue, cyan, green, magenta, red, white, yellow } from '../colors'

export function * colors (state: State): Generator {
  console.log(`${black}black${red}red${green}green${yellow}yellow${blue}blue${magenta}magenta${cyan}cyan${white}white`)
}
