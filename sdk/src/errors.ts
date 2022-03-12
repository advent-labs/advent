import { parseIdlErrors, ProgramError } from "@project-serum/anchor"
import { IDL } from "./program"

export const IDLERRORS = parseIdlErrors(IDL)
export function parseError(err: any): null | ProgramError {
  let parsedErr = ProgramError.parse(err, IDLERRORS)
  return parsedErr
}
