import React, { useEffect, useContext } from 'react'

import { getApi, SubscribeCallback, SubscribeHandler, ResubscribeCallback } from 'resolve-api'

import { ResolveContext } from './context'

const useSubscription = (
  viewModelName: string,
  aggregateIds: Array<string> | '*',
  onEvent: SubscribeHandler,
  onSubscribe?: SubscribeCallback,
  onResubscribe?: ResubscribeCallback
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

    let subscription
    const onSubscribeCallback = (err, result): void => {
      if (!err) {
        subscription = result
      }

      if (typeof onSubscribe === 'function') {
        onSubscribe(err, result)
      }
    }

    api.subscribeTo(viewModelName, aggregateIds, onEvent, onSubscribeCallback, onResubscribe)

    return (): void => {
      if (!viewModel) {
        return
      }
      if (subscription) {
        api.unsubscribe(subscription)
      }
    }
  }, [])
}

export { useSubscription }
