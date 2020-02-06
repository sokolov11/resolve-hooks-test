import React from 'react'

import { useViewModel, useCommand } from 'resolve-react-hooks'

const viewModelName = 'myViewModel'
const aggregateId = '63adaa7d-bcf0-4d0f-bb22-3dce823c6019'

function List() {
  const callbacks = {
    onEvent: event => {
      console.log('--- topic event', event)
      return event
    },
    onStateChange: event => {
      console.log('--- view model state changed', event)
      return event
    }
  }

  const [{ data, isLoading, isError }, setViewModelArgs] = useViewModel(
    viewModelName,
    [aggregateId],
    {},
    null,
    callbacks
  )

  const sendCommand = useCommand()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      {isError ? (
        <div>Error</div>
      ) : (
        <code>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data)}</pre>
        </code>
      )}
      <button
        onClick={() => {
          setViewModelArgs({})
        }}
      >
        reload
      </button>
      &nbsp;
      <button
        onClick={() => {
          sendCommand({
            commandType: 'createShoppingItem',
            payload: { text: 'list item', id: new Date().getTime() },
            aggregateId,
            aggregateName: 'ShoppingList'
          })
        }}
      >
        send command
      </button>
    </React.Fragment>
  )
}
export default List
