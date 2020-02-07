import { rootCallback, addCallback, removeCallback, dropCallbackMap } from '../view_model_subscribe_callback'

describe('subscribe callbacks', () => {
  afterEach(() => {
    dropCallbackMap()
  })

  test('single callback added', async () => {
    const callback = jest.fn()
    const event = { type: 'topic-1', aggregateId: 'id-1' }
    addCallback('topic-1', 'id-1', callback)
    rootCallback(event)
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith(event)
  })

  test('single callback removed', async () => {
    const callback = jest.fn()
    const event = { type: 'topic-1', aggregateId: 'id-1' }

    addCallback('topic-1', 'id-1', callback)
    removeCallback('topic-1', 'id-1', callback)
    rootCallback(event)

    expect(callback).toBeCalledTimes(0)
  })

  test('multiple callbacks added', async () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()

    const event = { type: 'topic-1', aggregateId: 'id-1' }
    addCallback('topic-1', 'id-1', callback1)
    addCallback('topic-1', 'id-1', callback2)
    addCallback('topic-1', 'id-1', callback3)

    rootCallback(event)

    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toBeCalledWith(event)
    expect(callback2).toBeCalledTimes(1)
    expect(callback2).toBeCalledWith(event)
    expect(callback3).toBeCalledTimes(1)
    expect(callback3).toBeCalledWith(event)
  })

  test('multiple callbacks removed', async () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()

    const event = { type: 'topic-1', aggregateId: 'id-1' }
    addCallback('topic-1', 'id-1', callback1)
    addCallback('topic-1', 'id-1', callback2)
    addCallback('topic-1', 'id-1', callback3)
    removeCallback('topic-1', 'id-1', callback2)
    removeCallback('topic-1', 'id-1', callback3)

    rootCallback(event)

    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toBeCalledWith(event)
    expect(callback2).toBeCalledTimes(0)
    expect(callback3).toBeCalledTimes(0)
  })
})
