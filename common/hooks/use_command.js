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
  const [command, setCommand] = useState(null)
  // command: { commandType, payload, aggregateId, aggregateName }

  const api = createApi({ origin, rootPath: '' })

  const [state, dispatch] = useReducer(commandReducer, {
    isLoading: false,
    isError: null
  })

  useEffect(() => {
    let unmounted = false
    const doSendCommand = async () => {
      console.log('sending...', command)
      dispatch(sendCommandRequest(command))
      try {
        await api.sendCommand(command)

        if (!unmounted) {
          dispatch(sendCommandSuccess(command))
        }
      } catch (error) {
        console.log(error)
        if (!unmounted) {
          dispatch(sendCommandFailure({ ...command }, error))
        }
      }
    }
    doSendCommand()
    return () => {}
  }, [command])
  return setCommand
}

export { useCommand }
