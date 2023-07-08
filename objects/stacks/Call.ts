import { InternalError } from '../../errors/InternalError'
import { MemoryTracker } from '../../state/MemoryTracker'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'

export type CallValue = InternalValue & {
  catch?: (e: InternalError) => undefined | Generator
  finally?: () => undefined | Generator
  generator?: Generator
}

export class CallStack extends Stack {
  public static readonly EXTRA_SIZE = 3 * MemoryTracker.POINTER_SIZE

  push (value: CallValue): void {
    super.push(value as InternalValue)
  }

  get top (): CallValue {
    return this.at(0) as CallValue
  }

  protected addValueRef (value: InternalValue): void {
    super.addValueRef(value)
    this.memoryTracker.increment(CallStack.EXTRA_SIZE)
  }

  protected releaseValue (value: InternalValue): void {
    super.releaseValue(value)
    this.memoryTracker.decrement(CallStack.EXTRA_SIZE)
  }
}
