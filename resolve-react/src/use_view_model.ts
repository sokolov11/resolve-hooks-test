import React, { useState, useEffect, useContext, useCallback, EffectCallback } from 'react'

import { doSubscribe, doUnsubscribe } from './subscribe'

import { ResolveContext } from './context'

import { loadViewModelState } from './client'

interface SubscriptionKey {
  aggregateId: string
  eventType: string
}

interface Event {
  type: string
  [key: string]: any
}

type OnEventCallback = (event: Event) => Event

interface Callbacks {
  onEvent?: OnEventCallback
  onStateChange?: Function
}

const getSubscriptionKeys = (viewModel, aggregateIds: Array<string>): Array<SubscriptionKey> => {
  const eventTypes = Object.keys(viewModel.projection).filter(eventType => eventType !== 'Init')
  return eventTypes.reduce((acc: Array<SubscriptionKey>, eventType) => {
    if (Array.isArray(aggregateIds)) {
      acc.push(...aggregateIds.map(aggregateId => ({ aggregateId, eventType })))
    } else if (aggregateIds === '*') {
      acc.push({ aggregateId: '*', eventType })
    }
    return acc
  }, [])
}

const useViewModel = (
  viewModelName: string,
  aggregateIds: Array<string>,
  aggregateArgs: object,
  callbacks: Callbacks = {}
): void => {
  const context = useContext(ResolveContext)
  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }
  const { subscribeAdapter, viewModels } = context
  const { onEvent, onStateChange } = callbacks

  useEffect(() => {
    const viewModel = viewModels.find(({ name }) => name === viewModelName)

    if (!viewModel) {
      return undefined
    }

    const viewModelState: { data: object } = {
      data: {}
    }

    const onEventCallback = (event: Event): void => {
      const actualEvent = typeof onEvent === 'function' ? onEvent(event) ?? event : event

      if (typeof onStateChange === 'function') {
        const handler: Function = viewModel.projection[event.type]
        viewModelState.data = handler(viewModelState.data, actualEvent)
        onStateChange(viewModelState.data)
      }
    }

    if (typeof onStateChange === 'function') {
      loadViewModelState(context, {
        viewModelName,
        aggregateIds,
        aggregateArgs
      }).then(response => onStateChange(viewModel.deserializeState(response.result)))
    }

    const subscribe = async (): Promise<any> => {
      const subscriptionKeys = getSubscriptionKeys(viewModel, aggregateIds)
      if (subscribeAdapter) {
        await Promise.all(
          subscriptionKeys.map(({ aggregateId, eventType }) =>
            doSubscribe(
              context,
              subscribeAdapter,
              {
                topicName: eventType,
                topicId: aggregateId
              },
              onEventCallback
            )
          )
        )
      }
    }

    subscribe()

    return (): void => {
      if (!viewModel) {
        return
      }

      const unsubscribe = async (): Promise<any> => {
        if (viewModel) {
          const unsubscriptionKeys = getSubscriptionKeys(viewModel, aggregateIds)
          console.log('unmounting...', unsubscriptionKeys)
          if (subscribeAdapter) {
            for (const { aggregateId, eventType } of unsubscriptionKeys) {
              await doUnsubscribe(
                context,
                subscribeAdapter,
                {
                  topicName: eventType,
                  topicId: aggregateId
                },
                onEvent
              )
            }
          }
        }
      }
      unsubscribe()
    }
  }, [context, aggregateArgs, aggregateIds, viewModelName])
}

export { useViewModel }
