import { ValueType, IArray, IState, StateFactorySettings, EngineSignal, IStateFlags, IStateMemory, EngineSignalType } from '../index'
import { BusyParsing, Internal } from '../src/errors/index'
import { InternalValue, OperatorFunction, parse } from './index'
import { CallStack, DictionaryStack, OperandStack } from '../objects/stacks/index'
import { MemoryTracker } from './MemoryTracker'
import { InternalError } from '../src/errors/InternalError'
import { renderCallStack } from './callstack'
import { wrapError } from './error'

const UNEXPECTED_EXCEPTION = 'Unexpected exception'
const UNEXPECTED_CALLSTACK_TYPE = 'Unexpected call stack typ'

// const callHandlers: { [key in ValueType]?: (this: State, value: CallValue) => Generator } = {}

function sourceToValue (source: string, sourceFile?: string): InternalValue {
  return {
    type: ValueType.string,
    data: source,
    untracked: true, // because external
    sourceFile,
    sourcePos: 0
  }
}

export function isEngineSignal (value: any): value is EngineSignal {
  return value !== null &&
    typeof value === 'object' &&
    Object.values(EngineSignalType).includes(value.type) &&
    typeof value.debug === 'boolean'
}

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _dictionaries: DictionaryStack
  private readonly _operands: OperandStack
  private readonly _calls: CallStack
  private readonly _keepDebugInfo: boolean = false
  private readonly _yieldDebugSignals: boolean = false
  private _noCall: number = 0

  constructor (settings: StateFactorySettings = {}) {
    this._memoryTracker = new MemoryTracker(settings.maxMemoryBytes)
    this._dictionaries = new DictionaryStack(this._memoryTracker, settings.hostDictionary)
    this._operands = new OperandStack(this._memoryTracker)
    this._calls = new CallStack(this._memoryTracker)
    if (settings.keepDebugInfo === true) {
      this._keepDebugInfo = true
    }
    if (settings.yieldDebugSignals === true) {
      this._yieldDebugSignals = true
    }

    // callHandlers[ValueType.string] = State.prototype.runParse
    // callHandlers[ValueType.call] = State.prototype.runCall
    // callHandlers[ValueType.operator] = State.prototype.runOperator
    // callHandlers[ValueType.block] = State.prototype.runBlockOrProc
    // callHandlers[ValueType.proc] = State.prototype.runBlockOrProc
  }

  // region IState

  get memory (): IStateMemory {
    return this._memoryTracker
  }

  get flags (): IStateFlags {
    return {
      keepDebugInfo: this._keepDebugInfo,
      yieldDebugSignals: this._yieldDebugSignals,
      parsing: this._calls.length > 0,
      call: this._noCall === 0
    }
  }

  get operands (): OperandStack {
    return this._operands
  }

  get dictionaries (): DictionaryStack {
    return this._dictionaries
  }

  get calls (): CallStack {
    return this._calls
  }

  parse (source: string, sourceFile?: string): Generator {
    if (this._calls.length > 0) {
      wrapError(new BusyParsing())
    }
    try {
      this._calls.push(sourceToValue(source, sourceFile))
    } catch (e) {
      wrapError(e as Error)
    }
    return this.run()
  }

  // endregion IState

  get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  preventCall (): void {
    ++this._noCall
  }

  allowCall (): void {
    --this._noCall
  }

  stackForParsing (source: string, sourceFile?: string): void {
    this.stackForRunning(sourceToValue(source, sourceFile))
  }

  stackForRunning (value: InternalValue): void {
    this._calls.push(value)
    /* TODO detect call stack change
    const callStackChanged: EngineSignal = {
      type: EngineSignalType.callStackChanged,
      debug: true,
      delta: 'push'
    }
    yield callStackChanged
*/
  }

  pushStepParameter (value: InternalValue): void {

  }

  popStepParameter (): void {

  }

  private * run (): Generator {
    let error: Error | undefined

    const catchError = (callback: () => any): any => {
      try {
        return callback()
      } catch (e) {
        if (!(e instanceof Error)) {
          error = new Internal(UNEXPECTED_EXCEPTION)
        } else {
          error = e
          if (error instanceof InternalError) {
            error.callstack = renderCallStack(this.calls)
          }
        }
        return {}
      }
    }

    while (this._calls.length > 0) {
      const { top } = this._calls

      const cycle: EngineSignal = {
        type: EngineSignalType.cycle,
        debug: false
      }
      yield cycle

      const next = false

      // if (error === undefined) {
      //   if (top.generator !== undefined) {
      //     const generator = top.generator
      //     const { done, value } = catchError(() => generator.next())
      //     if (value !== undefined) {
      //       if (!isEngineSignal(value) || this._yieldDebugSignals) {
      //         yield value
      //       }
      //     }
      //     next = done
      //   } else {
      //     const handler = callHandlers[top.type]
      //     if (handler === undefined) {
      //       throw new Internal(UNEXPECTED_CALLSTACK_TYPE)
      //     }
      //     top.generator = handler.call(this, top)
      //   }
      // } else if (error instanceof InternalError && top.catch !== undefined) {
      //   const internalError = error
      //   const topCatch = top.catch
      //   // if iterator replace top.generator with it
      //   // if no error comes out, ignore
      //   // replace top.generator with either it
      //   top.generator = handler.call(this, top)
      //   yield * catchError(() => topCatch(internalError))
      // } else {
      //   next = true // escalate
      // }

      if (next) {
        // if (top.finally !== undefined) {
        //   yield * catchError(top.finally)
        // }
        if (this._calls.top.type === ValueType.integer) {
          this._calls.pop()
        }
        this._calls.pop()
        if (this._yieldDebugSignals) {
          const callStackChanged: EngineSignal = {
            type: EngineSignalType.callStackChanged,
            debug: true,
            delta: 'pop'
          }
          yield callStackChanged
        }
      }
    }

    if (error !== undefined) {
      wrapError(error)
    }

    const stop: EngineSignal = {
      type: EngineSignalType.stop,
      debug: false
    }
    return stop
  }

  private pushToStack (value: InternalValue): void {
    const { type } = value
    if ([ValueType.proc, ValueType.operator].includes(type) ||
        (type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data)))
    ) {
      this.stackForRunning(value)
    } else {
      this.operands.push(value)
    }
  }
/*
  private * runParse (value: CallValue): Generator {
    const { sourceFile } = value
    const source = value.data as string
    const beforeParse: EngineSignal = {
      type: EngineSignalType.beforeParse,
      debug: true,
      source,
      sourceFile
    }
    yield beforeParse
    this._calls.push({
      type: ValueType.integer,
      data: 0
    })
    const parser = parse(source, sourceFile)
    for (const parsedValue of parser) {
      this._calls.splice(1, {
        type: ValueType.integer,
        data: parsedValue.sourcePos
      })
      const tokenParsed: EngineSignal = {
        type: EngineSignalType.tokenParsed,
        debug: true,
        source,
        sourceFile,
        sourcePos: parsedValue.sourcePos,
        token: parsedValue.data.toString()
      }
      yield tokenParsed
      const value: InternalValue = { ...parsedValue }
      if (!this._keepDebugInfo) {
        delete value.source
        delete value.sourcePos
        delete value.sourceFile
      }
      yield * this.pushToStack(value)
    }
    this._calls.pop()
    const afterParse: EngineSignal = {
      type: EngineSignalType.afterParse,
      debug: true,
      source,
      sourceFile
    }
    yield afterParse
  }

  private * runCall (value: CallValue): Generator {
    const name = value.data as string
    const beforeCall: EngineSignal = {
      type: EngineSignalType.beforeCall,
      debug: true,
      name
    }
    yield beforeCall
    const resolvedValue = this._dictionaries.lookup(name)
    yield * this.pushToStack(resolvedValue)
    const afterCall: EngineSignal = {
      type: EngineSignalType.afterCall,
      debug: true,
      name
    }
    yield afterCall
  }

  private * runOperator (value: CallValue): Generator {
    const operator = value.data as OperatorFunction
    const beforeOperator: EngineSignal = {
      type: EngineSignalType.beforeOperator,
      debug: true,
      name: operator.name
    }
    yield beforeOperator
    const iterator = operator(this)
    if (iterator !== undefined) {
      yield * iterator
    }
    const afterOperator: EngineSignal = {
      type: EngineSignalType.afterOperator,
      debug: true,
      name: operator.name
    }
    yield afterOperator
  }

  private * runBlockOrProc (value: CallValue): Generator {
    this._calls.push({
      type: ValueType.integer,
      data: 0
    })
    const blockOrProc = value.data as IArray
    const beforeBlock: EngineSignal = {
      type: EngineSignalType.beforeBlock,
      debug: true,
      block: blockOrProc
    }
    yield beforeBlock
    const { length } = blockOrProc
    for (let index = 0; index < length; ++index) {
      this._calls.splice(1, {
        type: ValueType.integer,
        data: index
      })
      const beforeBlockItem: EngineSignal = {
        type: EngineSignalType.beforeBlockItem,
        debug: true,
        block: blockOrProc,
        index
      }
      yield beforeBlockItem
      yield * this.pushToStack(blockOrProc.at(index))
    }
    this._calls.pop()
    const afterBlock: EngineSignal = {
      type: EngineSignalType.afterBlock,
      debug: true,
      block: blockOrProc
    }
    yield afterBlock
  }
*/
}