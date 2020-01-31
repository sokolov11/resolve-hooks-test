import { useContext, useCallback } from 'react'
import { ResolveContext } from './context'
import { Command, CommandResult, sendCommand } from './client'

type CommandBuilder<TData> = (data: TData) => Command
type CommandSuccessCallback = (result: CommandResult) => void
type CommandFailureCallback = (error: Error) => void
type CommandRequestCallback = (command: Command) => void
type CommandExecutor<TData> = (data: TData) => void

function isCommandBuilder<T>(x: any): x is CommandBuilder<T> {
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

function useCommand<T>(
  input: CommandBuilder<T>,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
): CommandExecutor<T>

function useCommand<T>(
  input: Command | CommandBuilder<T>,
  success?: CommandSuccessCallback,
  failure?: CommandFailureCallback,
  request?: CommandRequestCallback
): CommandExecutor<T> {
  const context = useContext(ResolveContext)

  // return useCallback(
  return (data: T): void => {
    const command = isCommandBuilder<T>(input) ? input(data) : input

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
  }
  // [context, input, success, failure, request]
  // )
}

export { useCommand }
