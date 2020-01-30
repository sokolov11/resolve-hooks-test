import { useContext } from 'react'
import { ResolveContext } from './context'
import { Command, sendCommand } from './client'

const useCommandExecutor = (command: Command): unknown => {
  const context = useContext(ResolveContext)

  //const executor = (): Promise<unknown> => sendCommand(context, command)
}

export { useCommandExecutor }
