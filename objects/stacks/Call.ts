import { InternalError } from '../../errors/InternalError'
import { MemoryTracker } from '../../state/MemoryTracker'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'

export type CallValue = InternalValue & {
  catch?: (e: InternalError) => void
  finally?: () => void
}

export class CallStack extends Stack {
  push (value: CallValue): void {
    super.push(value as InternalValue)
  }

  get top (): CallValue {
    return this.at(0) as CallValue
  }

  protected addValueRef (value: InternalValue): void {
    super.addValueRef(value)
    this.memoryTracker.increment(2 * MemoryTracker.POINTER_SIZE)
  }

  protected releaseValue (value: InternalValue): void {
    super.releaseValue(value)
    this.memoryTracker.decrement(2 * MemoryTracker.POINTER_SIZE)
  }
}
