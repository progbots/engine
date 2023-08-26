import { ValueType } from '@api'
import { ICallStack, InternalValue } from '@sdk'
import { Internal, InternalError, StackUnderflow } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { ValueStack } from './ValueStack'
import { ValueArray } from '../ValueArray'

const UNEXPECTED_TYPE = 'Unexpected type'

interface CallState {
  step: number
  parameters: null | ValueArray
}

export class CallStack extends ValueStack implements ICallStack {
  private readonly _states: CallState[] = []
  public static readonly EXTRA_SIZE = MemoryTracker.POINTER_SIZE + MemoryTracker.INTEGER_SIZE + 1
  public static readonly NO_INDEX = Number.MIN_SAFE_INTEGER
  public static readonly ALLOWED_TYPES = [
    ValueType.string,
    ValueType.block,
    ValueType.call,
    ValueType.operator
  ]

  protected _push (value: InternalValue): void {
    super.push(value)
    this._states.unshift({
      step: 0,
      parameters: null
    })
  }

  override push (value: InternalValue): void {
    if (!CallStack.ALLOWED_TYPES.includes(value.type)) {
      throw new InternalError(UNEXPECTED_TYPE)
    }
    this._push(value)
  }

  private topIsInteger (): boolean {
    const { type } = this.safeAt(0)
    return type === ValueType.integer
  }

  private safeTupleAt (index: number): {
    value: InternalValue
    state: CallState
  } {
    const value = this._values[index]
    const state = this._states[index]
    if (value === undefined || state === undefined) {
      throw new StackUnderflow()
    }
    return { value, state }
  }

  override pop (): void {
    if (this.topIsInteger()) {
      super.pop()
      this._states.shift()
    }
    const { state } = this.safeTupleAt(0)
    super.pop()
    const { parameters } = state
    parameters?.release()
    this._states.shift()
  }

  private get _top (): {
    value: InternalValue
    state: CallState
  } {
    if (this.length === 0) {
      throw new StackUnderflow()
    }
    let index: number
    if (this.topIsInteger()) {
      index = 1
    } else {
      index = 0
    }
    return this.safeTupleAt(index)
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
    const value = this._values[0]
    if (value === undefined || value.type !== ValueType.integer) {
      return CallStack.NO_INDEX
    }
    return value.number
  }

  set index (value: number) {
    const newValue: InternalValue = {
      type: ValueType.integer,
      number: value
    }
    if (this.topIsInteger()) {
      this.splice(1, newValue)
    } else {
      this._push(newValue)
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
    const array = new ValueArray(this.memoryTracker)
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

  protected override addValueRef (value: InternalValue): void {
    super.addValueRef(value)
    this.memoryTracker.increment(CallStack.EXTRA_SIZE)
  }

  protected override releaseValue (value: InternalValue): void {
    super.releaseValue(value)
    this.memoryTracker.decrement(CallStack.EXTRA_SIZE)
  }
}
