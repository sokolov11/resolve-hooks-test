import React, { useState, useEffect, useReducer, useContext } from 'react'

import createApi from './create_api'
import getOrigin from './get_origin'

import ResolveContext from './context'

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
      return { ...state, isLoading: true, isError: null }
    case LoadViewModelState.SUCCESS:
      return {
        ...state,
        data: action.result,
        isLoading: false,
        isError: null
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
  const { rootPath } = context
  const origin = getOrigin()
  const api = createApi({ origin, rootPath })

  const [state, dispatch] = useReducer(loadReducer, {
    isLoading: false,
    isError: null,
    data: inititalData
  })
  const [args, setArgs] = useState(aggregateArgs)

  useEffect(() => {
    let unmounted = false

    const doLoadViewModelState = async () => {
      dispatch(
        loadViewModelStateRequest(viewModelName, aggregateIds, aggregateArgs)
      )
      try {
        console.log('requesting viewModel', viewModelName)
        const data = await api.loadViewModelState({
          viewModelName,
          aggregateIds,
          aggregateArgs
        })

        if (!unmounted) {
          dispatch(
            loadViewModelStateSuccess(
              viewModelName,
              aggregateIds,
              args,
              data.result,
              new Date().getTime()
            )
          )
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

    doLoadViewModelState()
    return () => {
      unmounted = true
      // TODO: dropViewModelState, disconnect...
    }
  }, [args])
  return [state, setArgs]
}

export { useViewModel }
