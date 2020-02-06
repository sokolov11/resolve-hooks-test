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

  const api = useMemo(() => getApiForContext(context), [context])



}
