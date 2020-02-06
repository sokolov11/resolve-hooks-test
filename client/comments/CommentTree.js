import React, { useState, useCallback, useMemo } from 'react'
import { useApi } from 'resolve-react-hooks'
import nanoid from 'nanoid'

const randomColour = () => `#${((Math.random() * 0xffffff) << 0).toString(16)}`

const CommentInput = ({ target, targetId }) => {
  const [text, setText] = useState('')
  const aggregateId = useMemo(() => nanoid(), [true])

  const { execCommand } = useApi()
  const postComment = useCallback(() => {
    execCommand(
      {
        type: 'testConflict',
        aggregateName: 'comment',
        aggregateId,
        payload: {
          target,
          targetId,
          text
        }
      },
      {
        retryOnError: {
          attempts: 5,
          period: 1000,
          errors: [500]
        },
        debug: true
      }
    )
  }, [text, execCommand])

  // memo does not make sense here - just for testing
  return useMemo(() => {
    return (
      <div>
        <input onChange={setText} />
        <button style={{ background: randomColour() }} onClick={postComment}>
          post
        </button>
      </div>
    )
  }, [postComment, setText])
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
