import { useContext, useCallback } from 'react'
import { ResolveContext } from './context'
import { Command, CommandResult, sendCommand } from './client'

type CommandBuilder<T extends any[]> = (...args: T) => Command
type CommandSuccessCallback = (result: CommandResult) => void
type CommandFailureCallback = (error: Error) => void
type CommandRequestCallback = (command: Command) => void
type CommandExecutor<T extends any[]> = (...args: T) => void

function isCommandBuilder<T extends any[]>(x: any): x is CommandBuilder<T> {
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

function useCommand(
  input: Command,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
): CommandExecutor<never>

function useCommand<T extends any[]>(
  input: CommandBuilder<T>,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
): CommandExecutor<T>

function useCommand<T extends any[]>(
  input: Command | CommandBuilder<T>,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
): CommandExecutor<T> {
  const context = useContext(ResolveContext)

  return useCallback(
    (...args: T) => {
      const command = isCommandBuilder<T>(input) ? input(...args) : input

      try {
        if (isCommandRequestCallback(request)) {
          request(command)
        }

        sendCommand(context, command).then(result => {
          if (isCommandSuccessCallback(success)) {
            success(result)
          }
        })
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
