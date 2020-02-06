import { useContext, useMemo } from 'react'
import { Context, ResolveContext } from './context'
import { getApiForContext } from './client'

export type Api = {
  executeCommand: () => void
  executeQuery: () => void
  bindViewModel: () => void
}

export const useApi = (): Api => {
  const context = useContext(ResolveContext)
  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }

  //const api = useMemo(() => getApiForContext(context), [context])

  return {
    executeCommand: (): void => {
      console.log('cmd')
    },
    executeQuery: (): void => {
      console.log('qry')
    },
    bindViewModel: (): void => {
      console.log('vmd')
    }
  }
}
