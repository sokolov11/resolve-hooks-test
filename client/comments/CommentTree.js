import React, { useState, useCallback, useMemo } from 'react'
import { useApi } from 'resolve-react-hooks'
import nanoid from 'nanoid'

const randomColour = () => `#${((Math.random() * 0xffffff) << 0).toString(16)}`

const CommentInput = ({ target, targetId }) => {
  const [text, setText] = useState('')
  const aggregateId = useMemo(() => nanoid(), [true])

  const updateText = useCallback(e => setText(e.target.value), [setText])

  const { execCommand } = useApi()
  const postComment = useCallback(() => {
    execCommand(
      {
        type: 'create',
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
          attempts: 3,
          period: 1000,
          errors: [409]
        },
        debug: true
      },
      (error, result) => {
        if (error) {
          console.log(`Truba: ${JSON.stringify(error.message, null, 2)}`)
          return
        }
        console.log(`Norm: ${JSON.stringify(result, null, 2)}`)
      }
    )
  }, [text, execCommand])

  const postCommentAsync = useCallback(() => {
    const exec = async () => {
      try {
        const result = await execCommand(
          {
            type: 'create',
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
              attempts: 3,
              period: 1000,
              errors: [409]
            },
            debug: true
          }
        ).promise()

        console.log(`Norm: ${JSON.stringify(result, null, 2)}`)
      } catch (error) {
        console.log(`Truba: ${error}`)
      }
    }

    exec()
  }, [text, execCommand])

  // memo does not make sense here - just for testing
  return useMemo(() => {
    return (
      <div>
        <input onChange={updateText} />
        <button style={{ background: randomColour() }} onClick={postComment}>
          post with callbacks
        </button>
        <button style={{ background: randomColour() }} onClick={postCommentAsync}>
          post with async
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
