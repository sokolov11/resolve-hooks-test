import React from 'react'

import { useViewModel, useCommand } from '../../hooks'

const viewModelName = 'myViewModel'
const aggregateId = '63adaa7d-bcf0-4d0f-bb22-3dce823c6019'

function List() {
  const [{ data, isLoading, isError }, setViewModelArgs] = useViewModel(
    viewModelName,
    [aggregateId],
    {},
    null
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
          <pre style={{ whiteSpace: 'pre-wrap' }}>{data}</pre>
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
