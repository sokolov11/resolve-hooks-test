import React, { useState, useEffect, useReducer } from 'react'

import createApi from './create_api'
import getOrigin from './get_origin'

interface ViewModelState {
  data: object,
  isLoading: boolean,
  isError: Error | null
}

import {
  LOAD_VIEWMODEL_STATE_FAILURE,
  LOAD_VIEWMODEL_STATE_SUCCESS,
  LOAD_VIEWMODEL_STATE_REQUEST
} from './action_types'

import {
  loadViewModelStateFailure,
  loadViewModelStateSuccess,
  loadViewModelStateRequest,
  LoadViewModelAction
} from './actions'

const loadReducer = (state: ViewModelState, action: LoadViewModelAction): ViewModelState => {
  switch (action.type) {
    case LOAD_VIEWMODEL_STATE_REQUEST:
      return { ...state, isLoading: true, isError: null }
    case LOAD_VIEWMODEL_STATE_SUCCESS:
      return {
        ...state,
        data: action.result,
        isLoading: false,
        isError: null
      }
    case LOAD_VIEWMODEL_STATE_FAILURE:
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
  const origin = getOrigin()
  const api = createApi({ origin, rootPath: '' })

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
        console.log('requesting...', viewModelName)
        const data = await api.loadViewModelState({
          viewModelName,
          aggregateIds,
          aggregateArgs
        })

        // const result = await axios(
        //   `http://localhost:3000/api/query/${viewModelName}/${aggregateId}` // TODO add rootPath as parameter
        // )

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
