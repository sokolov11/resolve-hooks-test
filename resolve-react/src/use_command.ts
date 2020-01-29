import React, { useState, useEffect, useReducer } from 'react'

import createApi from './create_api'
import getOrigin from './get_origin'

import {
  SEND_COMMAND_FAILURE,
  SEND_COMMAND_SUCCESS,
  SEND_COMMAND_REQUEST
} from './action_types'

import {
  sendCommandFailure,
  sendCommandSuccess,
  sendCommandRequest
} from './actions'

const commandReducer = (state, action) => {
  switch (action.type) {
    case SEND_COMMAND_REQUEST:
      return { ...state, isLoading: true, isError: false }
    case SEND_COMMAND_SUCCESS:
      return {
        ...state,
        data: action.result,
        isLoading: false,
        isError: false
      }
    case SEND_COMMAND_FAILURE:
      return { ...state, isLoading: false, isError: action.error }
    default:
      return { ...state }
  }
}

const useCommand = () => {
  const origin = getOrigin()
  const [command, setCommand] = useState({ aggregateId: null, aggregateName: null, payload: {}, commandType: null })
  const { commandType, payload, aggregateId, aggregateName } = command

  const api = createApi({ origin, rootPath: '' })

  const [state, dispatch] = useReducer(commandReducer, {
    isLoading: false,
    isError: null
  })

  useEffect(() => {
    let unmounted = false
    const doSendCommand = async () => {
      console.log('sending command', command)
      if (!aggregateId) {
        return
      }
      dispatch(sendCommandRequest(commandType, aggregateId, aggregateName, payload))
      try {
        await api.sendCommand({ commandType, payload, aggregateId, aggregateName })

        if (!unmounted) {
          dispatch(sendCommandSuccess(commandType, aggregateId, aggregateName, payload))
        }
      } catch (error) {
        console.log(error)
        if (!unmounted) {
          dispatch(sendCommandFailure(commandType, aggregateId, aggregateName, payload, error))
        }
      }
    }
    doSendCommand()
    return () => { }
  }, [command])
  return setCommand
}

export { useCommand }
