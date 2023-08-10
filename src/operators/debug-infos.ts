import { InternalValue, DebugInfos } from '../state/index'

export function extractDebugInfos (value: InternalValue): DebugInfos {
  const { source, sourcePos, sourceFile } = value
  return { source, sourcePos, sourceFile }
}
