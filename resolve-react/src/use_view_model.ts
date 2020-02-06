import React, { useState, useEffect, useContext, useCallback } from 'react'

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
  inititalData: object,
  callbacks: Callbacks = {}
): Array<any> => {
  const context = useContext(ResolveContext)
  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }
  const { subscribeAdapter, viewModels } = context
  const { onEvent, onStateChange } = callbacks
  const [state, setState] = useState({ data: inititalData, isLoading: false, error: null })
  const [args, setArgs] = useState(aggregateArgs)

  const stateLoader = useCallback(() => {
    try {
      setState({ ...state, isLoading: false, error: null })
      loadViewModelState(context, {
        viewModelName,
        aggregateIds,
        aggregateArgs: args
      }).then(response => {
        const viewModel = viewModels.find(({ name }) => name === viewModelName)
        if (viewModel) {
          const data = viewModel.deserializeState(response.result)
          setState({ data, isLoading: false, error: null })
        }
      })
    } catch (error) {
      setState({ ...state, isLoading: false, error })
    }
  }, [args])

  useEffect(() => {
    stateLoader()
  }, [args])

  const onEventCallback: Function | undefined = onEvent
    ? (event: Event): Event => {
      const actualEvent = onEvent(event) || event
      // apply to viewmodel (actualEvent)
      const viewModel = viewModels.find(({ name }) => name === viewModelName)
      if (viewModel) {
        const handler: Function = viewModel.projection[event.type]
        setState({ ...state, data: handler(state.data, actualEvent) })
      }
      return event
    }
    : undefined

  useEffect(() => {
    const subscribe = async (): Promise<any> => {
      const viewModel = viewModels.find(({ name }) => name === viewModelName)
      if (viewModel) {
        const subscriptionKeys = getSubscriptionKeys(viewModel, aggregateIds)
        if (subscribeAdapter) {
          for (const { aggregateId, eventType } of subscriptionKeys) {
            await doSubscribe(
              context,
              subscribeAdapter,
              {
                topicName: eventType,
                topicId: aggregateId
              },
              onEventCallback
            )
          }
        }
      }
    }
    subscribe()

    return (): void => {
      const unsubscribe = async (): Promise<any> => {
        const viewModel = viewModels.find(({ name }) => name === viewModelName)
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
  }, [])

  useEffect(() => {
    if (typeof onStateChange === 'function') {
      onStateChange(state)
    }
  }, [state])

  return [state, setArgs]
}

export { useViewModel }
