import React, { useEffect, useContext } from 'react'

import { getApi, SubscribeCallback, SubscribeHandler } from 'resolve-api'

import { ResolveContext } from './context'

const useSubscription = (
  viewModelName: string,
  aggregateIds: Array<string> | '*',
  onEvent: SubscribeHandler,
  onSubscribe?: SubscribeCallback
): void => {
  const context = useContext(ResolveContext)
  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }
  const { viewModels } = context

  const api = getApi(context)

  useEffect(() => {
    const viewModel = viewModels.find(({ name }) => name === viewModelName)

    if (!viewModel) {
      return undefined
    }

    api.subscribeTo(viewModelName, aggregateIds, onEvent, onSubscribe)

    return (): void => {
      if (!viewModel) {
        return
      }

      api.unsubscribeFrom(viewModelName, aggregateIds, onEvent)
    }
  }, [])
}

export { useSubscription }
