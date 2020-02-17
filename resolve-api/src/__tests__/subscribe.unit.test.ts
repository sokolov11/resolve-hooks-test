import { doSubscribe, doUnsubscribe, dropSubscribeAdapterPromise } from '../subscribe'

import { rootCallback } from '../view_model_subscribe_callback'

jest.useFakeTimers()
jest.mock('../empty_subscribe_adapter')

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      fetch?: Function
    }
  }
}

const mFetch = jest.fn(() => ({
  ok: true,
  status: 200,
  headers: {
    get: (): void => undefined
  },
  json: (): Promise<object> => Promise.resolve({ appId: 'application-id', url: 'http://options-url' }),
  text: (): Promise<string> => Promise.resolve('response')
}))

const mockInit = jest.fn()
const mockSubscribe = jest.fn()
const mockUnsubscribe = jest.fn()
const mockCallback = jest.fn()

let mockSubscribeAdapter
let context

const clearMocks = (): void => {
  mockSubscribeAdapter.mockClear()
  mockInit.mockClear()
  mockSubscribe.mockClear()
  mockUnsubscribe.mockClear()
  dropSubscribeAdapterPromise()
  mockCallback.mockClear()
}

describe('subscribe', () => {
  beforeAll(() => {
    global.fetch = mFetch
  })

  afterAll(() => {
    global.fetch = undefined
  })

  beforeEach(async () => {
    mockSubscribeAdapter = jest.fn().mockReturnValue({
      init: mockInit,
      subscribeToTopics: mockSubscribe,
      unsubscribeFromTopics: mockUnsubscribe
    })

    context = {
      origin: 'http://origin-url',
      rootPath: '',
      subscribeAdapter: mockSubscribeAdapter
    }
  })

  afterEach(() => {
    clearMocks()
  })

  test('init with params', async () => {
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: rootCallback,
      origin: 'http://origin-url',
      rootPath: '',
      url: 'http://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
    expect(mockSubscribe).toBeCalledTimes(1)
  })

  test('init only once with params', async () => {
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-2',
        topicId: 'aggregate-id-2'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-3',
        topicId: 'aggregate-id-3'
      },
      mockCallback
    )

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: rootCallback,
      origin: 'http://origin-url',
      rootPath: '',
      url: 'http://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
  })

  test('is subscribed', async () => {
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-2',
        topicId: 'aggregate-id-2'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-3',
        topicId: 'aggregate-id-3'
      },
      mockCallback
    )
    expect(mockSubscribe).toBeCalledTimes(3)
  })

  test('is unsubscribed', async () => {
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-2',
        topicId: 'aggregate-id-2'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-3',
        topicId: 'aggregate-id-3'
      },
      mockCallback
    )

    await doUnsubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doUnsubscribe(
      context,
      {
        topicName: 'event-type-2',
        topicId: 'aggregate-id-2'
      },
      mockCallback
    )
    await doUnsubscribe(
      context,
      {
        topicName: 'event-type-3',
        topicId: 'aggregate-id-3'
      },
      mockCallback
    )
    expect(mockSubscribe).toBeCalledTimes(3)
    expect(mockUnsubscribe).toBeCalledTimes(3)
  })

  test('no multiple subscriptions', async () => {
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    await doSubscribe(
      context,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )
    expect(mockSubscribe).toBeCalledTimes(1)
  })
})

describe('re-subscribe', () => {
  beforeAll(() => {
    global.fetch = mFetch
  })

  afterAll(() => {
    global.fetch = undefined
  })

  afterEach(() => {
    clearMocks()
  })
})
