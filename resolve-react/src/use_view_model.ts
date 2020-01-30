import React, { useState, useEffect, useReducer, useContext } from 'react'

import getOrigin from './get_origin'

import { initSubscription, doSubscribe, doUnsubscribe } from './subscribe'

import { ResolveContext, Context } from './context'

import { loadViewModelState } from './client'

import {
  loadViewModelStateFailure,
  loadViewModelStateSuccess,
  loadViewModelStateRequest,

  ViewModelState,
  LoadViewModelState
} from './view_model_types'

const loadReducer = (state: ViewModelState, action: any): ViewModelState => {
  switch (action.type) {
    case LoadViewModelState.REQUEST:
      return { ...state, isLoading: true }
    case LoadViewModelState.SUCCESS:
      return {
        ...state,
        data: action.result,
        isLoading: false
      }
    case LoadViewModelState.FAILURE:
      return { ...state, isLoading: false, isError: action.error }
    default:
      return { ...state }
  }
}

const useViewModel = (
  viewModelName: string,
  aggregateIds: Array<string>,
  aggregateArgs: object,
  inititalData: object
): Array<any> => {
  const context = useContext(ResolveContext)
  console.log(context)

  if (!context) {
    throw Error('You cannot use resolve effects outside Resolve context')
  }
  const { rootPath, subscribeAdapter, viewModels } = context
  const origin = getOrigin()

  const [state, dispatch] = useReducer(loadReducer, {
    isLoading: false,
    data: inititalData
  })
  const [args, setArgs] = useState(aggregateArgs)
  const viewModel = viewModels.find(({ name }) => name === viewModelName)

  useEffect(() => {
    let unmounted = false

    const doLoadViewModelState = async () => {
      dispatch(
        loadViewModelStateRequest(viewModelName, aggregateIds, aggregateArgs)
      )
      try {
        console.log('requesting viewModel', viewModelName)
        const data = await loadViewModelState(context, {
          viewModelName,
          aggregateIds,
          aggregateArgs
        })

        if (!unmounted) {
          if (viewModel) {
            dispatch(
              loadViewModelStateSuccess(
                viewModelName,
                aggregateIds,
                args,
                viewModel.deserializeState(data.result),
                new Date().getTime()
              )
            )
          }
        }
      } catch (error) {
        console.log(error)
        if (!unmounted) {
          dispatch(
            loadViewModelStateFailure(viewModelName, aggregateIds, args, error)
          )
        }
      }
    }

    const doInitSubscription = async () => {
      if (!subscribeAdapter) {
        return
      }
      try {
        // TODO: dispatch subscription started
        if (viewModel) {
          await initSubscription(context,
            {
              origin,
              rootPath,
              subscribeAdapter
            })
          const eventTypes = Object.keys(viewModel.projection).filter(
            eventType => eventType !== 'Init'
          )
          let subscriptionKeys = eventTypes.reduce((acc: Array<{ aggregateId: string, eventType: string }>, eventType) => {
            if (Array.isArray(aggregateIds)) {
              acc.push(...aggregateIds.map(aggregateId => ({ aggregateId, eventType })))
            } else if (aggregateIds === '*') {
              acc.push({ aggregateId: '*', eventType })
            }
            return acc
          }, [])
          console.log('subscriptionKeys:', subscriptionKeys)
          for (const { aggregateId, eventType } of subscriptionKeys) {
            await doSubscribe({ topicName: eventType, topicId: aggregateId })
          }
        }

        // TODO: dispatch subscription succeed
      }
      catch (error) {
        console.log(error)
        // TODO: dispatch subscription failed
      }
    }

    doLoadViewModelState()
    doInitSubscription()

    return () => {
      unmounted = true
      // TODO: dropViewModelState, disconnect...
    }
  }, [args])
  return [state, setArgs]
}

export { useViewModel }
