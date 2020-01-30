import React, { useState } from 'react'

import { useCommand } from 'resolve-react-hooks'

const uuid = () => 'bla'

export default () => {
  const banRecipe = useCommand((recipeId, reason, trashy) => ({
    type: 'ban',
    aggregateId: recipeId,
    aggregateName: 'recipe',
    payload: {
      reason
    }
  }))

  banRecipe('a', 'b', 'c')

  /*
  const directExecutor = useCommand({
    aggregateName
  })
  const customExecutor = useCommand(recipeId => ({}))
  */

  return (
    <div>
      <button onClick={() => banRecipe('recipeA', 'shit')}>Recipe A</button>
      <button onClick={() => banRecipe('recipeB', 'trash')}>Recipe B</button>
    </div>
  )
}
