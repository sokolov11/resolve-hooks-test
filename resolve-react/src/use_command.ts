import { useContext, useCallback, useDebugValue } from 'react'
import { ResolveContext } from './context'
import { Command, CommandResult, sendCommand } from './client'

type CommandBuilder<TData> = (data: TData) => Command
type CommandSuccessCallback = (result: CommandResult) => void
type CommandFailureCallback = (error: Error) => void
type CommandRequestCallback = (command: Command) => void
type CommandExecutor<TData> = (data: TData) => void

type CommandOptions = {
  successCallback?: CommandSuccessCallback
  failureCallback?: CommandFailureCallback
  requestCallback?: CommandFailureCallback
}

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

function useCommand(input: Command, options?: CommandOptions): CommandExecutor<never>

function useCommand<T>(
  input: CommandBuilder<T>,
  options?: CommandOptions,
  dependencies?: any[]
): CommandExecutor<T>

function useCommand<T>(
  input: Command | CommandBuilder<T>,
  options: CommandOptions = {},
  dependencies: any[] = []
): CommandExecutor<T> {
  const context = useContext(ResolveContext)
  const actualDependencies = isCommandBuilder<T>(input) ? dependencies || [] : [input]

  const executor = useCallback(
    (data: T): void => {
      const command = isCommandBuilder<T>(input) ? input(data) : input
      const { successCallback, failureCallback, requestCallback } = options

      console.log(command)

      try {
        if (isCommandRequestCallback(requestCallback)) {
          requestCallback(command)
        }

        sendCommand(context, command).then(result => {
          if (isCommandSuccessCallback(successCallback)) {
            successCallback(result)
          }
        })
      } catch (error) {
        if (isCommandFailureCallback(failureCallback)) {
          failureCallback(error)
        }
      }
    },
    [context, ...actualDependencies]
  )

  useDebugValue(`${isCommandBuilder<T>(input) ? 'command builder' : 'command object'}`)

  return executor
}

export { useCommand }
