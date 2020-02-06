import { useContext, useMemo } from 'react'
import { ResolveContext } from './context'
import { getApiForContext, API } from './api'

export const useApi = (): API => {
  const context = useContext(ResolveContext)
  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }

  return useMemo(() => getApiForContext(context), [context])
}
