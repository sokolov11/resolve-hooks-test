import React, { useState, useCallback } from 'react'

import { useCommand } from 'resolve-react-hooks'

const uuid = () => 'bla'

const Recipe = ({ recipeId, name }) => {
  const [reason, setReason] = useState('')

  const { banRecipe, isBusy: banInProgress } = useCommand({
    aggregateId: recipeId,
    aggregateName: 'recipe',
    type: 'ban',
    payload: {
      reason
    }
  })

  const { dropRecipe, isBusy: dropInProgress } = useCommand({
    aggregateId: recipeId,
    aggregateName: 'recipe',
    type: 'drop'
  })

  const updateReason = useCallback(
    e => {
      setReason(e.target.value)
    },
    [setReason]
  )

  return (
    <div>
      <div>{name}</div>
      <button disabled={banInProgress || dropInProgress} onClick={banRecipe}>
        Ban
      </button>
      <button disabled={banInProgress || dropInProgress} onClick={dropRecipe}>
        Drop
      </button>
      <input onChange={updateReason} />
    </div>
  )
}

export default () => {
  return (
    <div>
      <Recipe recipeId="a" name="recipe #1" />
      <Recipe recipeId="b" name="recipe #2" />
    </div>
  )
}
