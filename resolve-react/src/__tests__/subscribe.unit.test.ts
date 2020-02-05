import { mocked } from 'ts-jest/utils'

import { doSubscribe, doUnsubscribe, dropSubscribeAdapterPromise } from '../subscribe'

import { getSubscribeAdapterOptions } from '../client'

jest.mock('../client')
jest.mock('../empty_subscribe_adapter')

const mockedGetSubscribeAdapterOptions = mocked(getSubscribeAdapterOptions)

let context
let mockSubscribeAdapter

mockedGetSubscribeAdapterOptions.mockResolvedValue({
  appId: 'application-id',
  url: 'htttp://options-url'
})

const mockInit = jest.fn()
const mockSubscribe = jest.fn()
const mockUnsubscribe = jest.fn()
const mockCallback = jest.fn()

const clearMocks = (): void => {
  mockedGetSubscribeAdapterOptions.mockClear()
  mockSubscribeAdapter.mockClear()
  mockInit.mockClear()
  mockSubscribe.mockClear()
  mockUnsubscribe.mockClear()
  dropSubscribeAdapterPromise()
  mockCallback.mockClear()
}

describe('subscribe', () => {
  beforeEach(async () => {
    mockSubscribeAdapter = jest.fn().mockReturnValue({
      init: mockInit,
      subscribeToTopics: mockSubscribe,
      unsubscribeFromTopics: mockUnsubscribe
    })

    context = {
      origin: 'http://origin-url',
      rootPath: ''
    }
  })

  afterEach(() => {
    clearMocks()
  })

  test('init with params', async () => {
    await doSubscribe(
      context,
      mockSubscribeAdapter,
      {
        topicName: 'event-type-1',
        topicId: 'aggregate-id-1'
      },
      mockCallback
    )

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: mockCallback,
      origin: 'http://origin-url',
      rootPath: '',
      url: 'htttp://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
    expect(mockSubscribe).toBeCalledTimes(1)
  })

  test('init only once with params', async () => {
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    }, mockCallback)

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: mockCallback,
      origin: 'http://origin-url',
      rootPath: '',
      url: 'htttp://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
  })

  test('is subscribed', async () => {
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    }, mockCallback)
    expect(mockSubscribe).toBeCalledTimes(3)
  })

  test('is unsubscribed', async () => {
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    }, mockCallback)

    await doUnsubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doUnsubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    }, mockCallback)
    await doUnsubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    }, mockCallback)
    expect(mockSubscribe).toBeCalledTimes(3)
    expect(mockUnsubscribe).toBeCalledTimes(3)
  })

  test('no multiple subscriptions', async () => {
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    await doSubscribe(context, mockSubscribeAdapter, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    }, mockCallback)
    expect(mockSubscribe).toBeCalledTimes(1)
  })
})