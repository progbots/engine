import { InternalError } from './InternalError'

export class DictStackUnderflow extends InternalError {
  constructor () {
    super('An attempt has been made to remove (end) the bottommost instance of userdict from the dictionary stack but no corresponding add (begin) exists')
  }
}
