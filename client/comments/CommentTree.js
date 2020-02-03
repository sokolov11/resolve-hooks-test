import React, { useState, useCallback, useMemo } from 'react'
import nanoid from 'nanoid'
import { useCommand } from 'resolve-react-hooks'

const randomColour = () => `#${((Math.random() * 0xffffff) << 0).toString(16)}`

const InputField = React.memo(({ updateText, postComment }) => {
  return (
    <div>
      <input onChange={updateText} />
      <button style={{ background: randomColour() }} onClick={postComment}>
        post
      </button>
    </div>
  )
})

const CommentInput = ({ target, targetId }) => {
  const api = useApi()

  const { sendCommand } = api

  const postComment = useCallback(text => {
    sendCommand({
      aggregateName: 'comment',
      type: 'create',
      aggregateId: nanoid(),
      payload: {
        text
      }
    })
  }, [])

  postComment('shit')

  /*
  const [text, setText] = useState('')

  const updateText = useCallback(e => setText(e.target.value), [setText])

  const incUserComments = useCommand(({ userId }) => ({
    aggregateId: userId,
    aggregateName: 'user',
    type: 'incrementComments'
  }))

  incUserComments({ userId: 'user-id' })

  const postComment = useCommand(({ content }) => ({
    aggregateId: nanoid(),
    aggregateName: 'comment',
    type: 'create',
    payload: {
      target,
      targetId,
      text: content
    }
  }))

  return <InputField updateText={updateText} postComment={postComment} />
*/
}

const CommentTree = ({ target = 'system', targetId = 'root' }) => {
  return (
    <div>
      <div>Target: {target}</div>
      <div>TargetID: {targetId}</div>
      <br />
      <CommentInput target={target} targetId={targetId} />
    </div>
  )
}

export default CommentTree
