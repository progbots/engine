import { ShareableObject } from './ShareableObject'
import { Value } from '../types'
import { MemoryTracker } from '../state/MemoryTracker'

export class Array extends ShareableObject {
  public static readonly VALUE_ADDITIONAL_SIZE = MemoryTracker.POINTER_SIZE

  private readonly _values: Value[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
  }

  get ref (): readonly Value[] {
    return this._values
  }

  protected _dispose (): void {
  }
}
