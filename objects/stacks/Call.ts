import { MemoryTracker } from '../../state/MemoryTracker'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'

export enum CallStep {
  RUN,
  CATCH,
  FINALLY
}

export type CallValue = InternalValue & {
  step?: CallStep
  generator?: Generator
}

export class CallStack extends Stack {
  public static readonly EXTRA_SIZE = MemoryTracker.POINTER_SIZE + 1

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
