import { COMMENT_CREATED } from '../comment_events'

const assert = (payload, name) => {
  if (!payload[name]) {
    throw Error(`"${name}" required`)
  }
}

export default {
  create: ({ isExist }, { payload }) => {
    if (isExist) {
      throw Error('the comment already exists')
    }

    assert(payload, 'target')
    assert(payload, 'targetId')
    assert(payload, 'text')

    const { target, targetId, parentId, text } = payload

    return {
      type: COMMENT_CREATED,
      payload: {
        target,
        targetId,
        text,
        parentId
      }
    }
  }
}
