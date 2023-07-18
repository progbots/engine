import { ValueType } from '../..'
import { MemoryTracker } from '../../state/MemoryTracker'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'
import { ArrayLike } from '../Array'
import { Internal, StackUnderflow } from '../../errors/index'

enum CallStep {
  INIT,
  RUN,
  LOOP,
  CATCH,
  FINALLY
}

interface CallState {
  step: CallStep
  parameters: null | ArrayLike
  loopIndex: number
}

export class CallStack extends Stack {
  private readonly _states: CallState[] = []
  public static readonly EXTRA_SIZE = MemoryTracker.POINTER_SIZE + MemoryTracker.INTEGER_SIZE + 1

  push (value: InternalValue): void {
    super.push(value)
    this._states.push({
      step: CallStep.INIT,
      parameters: null,
      loopIndex: -1
    })
  }

  pop (): void {
    super.pop()
    const { parameters } = this._states[0]
    if (parameters !== null) {
      parameters.release()
    }
    this._states.pop()
  }

  get top (): {
    value: InternalValue
    state: CallState
  } {
    let index: number
    if (this.at(0).type === ValueType.integer) {
      index = 1
    } else {
      index = 0
    }
    if (index >= this._values.length) {
      throw new StackUnderflow()
    }
    return {
      value: this.at(index),
      state: this._states[index]
    }
  }

  get step (): CallStep {
    return this.top.state.step
  }

  set step (value: CallStep) {
    this.top.state.step = value
  }

  get loopIndex (): number {
    return this.top.state.loopIndex
  }

  set loopIndex (value: number) {
    this.top.state.loopIndex = value
  }

  get parameters (): readonly InternalValue[] {
    const { state } = this.top
    const { parameters } = state
    if (parameters !== null) {
      return parameters.ref
    }
    return []
  }

  set parameters (values: InternalValue[]) {
    const { state } = this.top
    if (state.parameters !== null) {
      throw new Internal('Parameters are already set')
    }
    const array = new ArrayLike(this.memoryTracker)
    values.forEach(value => array.push(value))
    state.parameters = array
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
