import { CallStack, Stack } from './index'
import { MemoryTracker } from '../../state/MemoryTracker'
import { ValueType } from '../../index'
import { InternalError } from '../../errors/InternalError'

describe('objects/stacks/Call', () => {
  let tracker: MemoryTracker
  let stack: CallStack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new CallStack(tracker)
  })

  it('enables the use of extended values', () => {
    const myCatch = (e: InternalError): void => {}
    stack.push({
      type: ValueType.string,
      data: 'test',
      catch: myCatch
    })
    expect(stack.top.catch).toStrictEqual(myCatch)
  })

  it('counts extra memory for the additional values', () => {
    const baseTracker = new MemoryTracker()
    const baseStack = new Stack(baseTracker)
    baseStack.push({
      type: ValueType.string,
      data: 'test'
    })
    stack.push({
      type: ValueType.string,
      data: 'test'
    })
    expect(tracker.used).toBeGreaterThan(baseTracker.used)
    expect(tracker.used).toStrictEqual(baseTracker.used + CallStack.EXTRA_SIZE)
  })
})
