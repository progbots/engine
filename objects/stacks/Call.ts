import { ValueType } from '../..'
import { MemoryTracker } from '../../state/MemoryTracker'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'
import { ArrayLike } from '../Array'
import { Internal, StackUnderflow } from '../../errors/index'

interface CallState {
  step: number
  parameters: null | ArrayLike
}

export class CallStack extends Stack {
  private readonly _states: CallState[] = []
  public static readonly EXTRA_SIZE = MemoryTracker.POINTER_SIZE + MemoryTracker.INTEGER_SIZE + 1

  push (value: InternalValue): void {
    super.push(value)
    this._states.unshift({
      step: 0,
      parameters: null
    })
  }

  pop (): void {
    if (this.at(0).type === ValueType.integer) {
      super.pop()
    }
    super.pop()
    const { parameters } = this._states[0]
    if (parameters !== null) {
      parameters.release()
    }
    this._states.shift()
  }

  private get _top (): {
    value: InternalValue
    state: CallState
  } {
    let index: number
    if (this.length === 0) {
      throw new StackUnderflow()
    }
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

  get top (): InternalValue {
    return this._top.value
  }

  get step (): number {
    return this._top.state.step
  }

  set step (value: number) {
    this._top.state.step = value
  }

  get index (): number {
    const value = this.at(0)
    if (value.type !== ValueType.integer) {
      return -1
    }
    return value.data
  }

  set index (value: number) {
    if (this.at(0).type !== ValueType.integer) {
      this.push({
        type: ValueType.integer,
        data: value
      })
    } else {
      this.splice(1, {
        type: ValueType.integer,
        data: value
      })
    }
  }

  get parameters (): readonly InternalValue[] {
    const { state } = this._top
    const { parameters } = state
    if (parameters !== null) {
      return parameters.ref
    }
    return []
  }

  set parameters (values: InternalValue[]) {
    const { state } = this._top
    if (state.parameters !== null) {
      throw new Internal('Parameters are already set')
    }
    const array = new ArrayLike(this.memoryTracker)
    values.forEach(value => array.push(value))
    state.parameters = array
  }

  pushParameter (value: InternalValue): void {
    const { state } = this._top
    if (state.parameters === null) {
      throw new Internal('No parameters exist')
    }
    state.parameters.push(value)
  }

  popParameter (): void {
    const { state } = this._top
    if (state.parameters === null) {
      throw new Internal('No parameters exist')
    }
    state.parameters.pop()
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
