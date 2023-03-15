import { ValueType } from "../types";
import { MemoryTracker } from "./MemoryTracker";

describe('state/MemoryTracker', () => {
  describe('initial state', () => {
    it('starts with used being 0', () => {
      const tracker = new MemoryTracker()
      expect(tracker.used).toStrictEqual(0)
    })
  })

  describe('integer data type', () => {
    let integerValueSize: number

    beforeAll(() => {
      const tracker = new MemoryTracker()
      tracker.addValueRef({
        type: ValueType.integer,
        data: 1
      })
      integerValueSize = tracker.used
    })

    it('counts bytes for the value', () => {
      expect(integerValueSize).not.toStrictEqual(0);
      console.log(integerValueSize)
    })

    it('accumulates Value sizes', () => {
      const tracker = new MemoryTracker()
      const value = {
        type: ValueType.integer,
        data: 1
      };
      tracker.addValueRef(value)
      tracker.addValueRef(value)
      expect(tracker.used).toStrictEqual(2 * integerValueSize);
    })
  })
})