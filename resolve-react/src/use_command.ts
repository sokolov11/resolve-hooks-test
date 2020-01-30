import { useContext, useCallback } from 'react'
import { ResolveContext } from './context'
import { Command, CommandResult, sendCommand } from './client'

type CommandBuilder = (args: any[]) => Command
type CommandSuccessCallback = (result: CommandResult) => void
type CommandFailureCallback = (error: Error) => void
type CommandRequestCallback = (command: Command) => void

const isCommandBuilder = (x: any): x is CommandBuilder => {
  return x !== null && x !== undefined && typeof x === 'function'
}
const isCommandSuccessCallback = (x: any): x is CommandSuccessCallback => {
  return x !== null && x !== undefined && typeof x === 'function'
}
const isCommandFailureCallback = (x: any): x is CommandFailureCallback => {
  return x !== null && x !== undefined && typeof x === 'function'
}
const isCommandRequestCallback = (x: any): x is CommandRequestCallback => {
  return x !== null && x !== undefined && typeof x === 'function'
}

const useCommand = (
  input: Command | CommandBuilder,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
) => {
  const context = useContext(ResolveContext)

  return useCallback(
    async (...args) => {
      const command = isCommandBuilder(input) ? input(args) : input

      try {
        if (isCommandRequestCallback(request)) {
          request(command)
        }

        const result = await sendCommand(context, command)

        if (isCommandSuccessCallback(success)) {
          success(result)
        }
      } catch (error) {
        if (isCommandFailureCallback(failure)) {
          failure(error)
        }
      }
    },
    [context, input, success, failure, request]
  )
}

export { useCommand }
