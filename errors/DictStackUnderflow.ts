import { BaseError } from './BaseError'

export class DictStackUnderflow extends BaseError {
  constructor () {
    super('An attempt has been made to remove (end) the bottommost instance of userdict from the dictionary stack but no corresponding add (begin) exists')
  }
}
