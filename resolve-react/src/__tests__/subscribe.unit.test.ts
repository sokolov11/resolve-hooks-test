import { mocked } from 'ts-jest/utils'

import { doSubscribe, doUnsubscribe, dropSubscribeAdapterPromise } from '../subscribe'

import { getSubscribeAdapterOptions } from '../client'

jest.mock('../client')
jest.mock('../empty_subscribe_adapter')

const mockedGetSubscribeAdapterOptions = mocked(getSubscribeAdapterOptions)

let context
let options
let mockSubscribeAdapter

mockedGetSubscribeAdapterOptions.mockResolvedValue({
  appId: 'application-id',
  url: 'htttp://options-url'
})

const mockInit = jest.fn()
const mockSubscribe = jest.fn()
const mockUnsubscribe = jest.fn()

const clearMocks = (): void => {
  mockedGetSubscribeAdapterOptions.mockClear()
  mockSubscribeAdapter.mockClear()
  mockInit.mockClear()
  mockSubscribe.mockClear()
  mockUnsubscribe.mockClear()
  dropSubscribeAdapterPromise()
}

describe('subscribe', () => {
  beforeEach(async () => {
    mockSubscribeAdapter = jest.fn().mockReturnValue({
      init: mockInit,
      subscribeToTopics: mockSubscribe,
      unsubscribeFromTopics: mockUnsubscribe
    })

    context = jest.fn()
    options = {
      origin: 'http://origin-url',
      rootPath: '',
      subscribeAdapter: mockSubscribeAdapter
    }
  })

  afterEach(() => {
    clearMocks()
  })

  test('init with params', async () => {
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: expect.any(Function),
      origin: 'http://origin-url',
      rootPath: '',
      url: 'htttp://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
    expect(mockSubscribe).toBeCalledTimes(1)
  })

  test('init only once with params', async () => {
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    })

    expect(mockSubscribeAdapter).toBeCalledWith({
      appId: 'application-id',
      onEvent: expect.any(Function),
      origin: 'http://origin-url',
      rootPath: '',
      url: 'htttp://options-url'
    })
    expect(mockInit).toBeCalledTimes(1)
  })

  test('is subscribed', async () => {
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    })
    expect(mockSubscribe).toBeCalledTimes(3)
  })

  test('is unsubscribed', async () => {
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    })

    await doUnsubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doUnsubscribe(context, options, {
      topicName: 'event-type-2',
      topicId: 'aggregate-id-2'
    })
    await doUnsubscribe(context, options, {
      topicName: 'event-type-3',
      topicId: 'aggregate-id-3'
    })
    expect(mockSubscribe).toBeCalledTimes(3)
    expect(mockUnsubscribe).toBeCalledTimes(3)
  })

  test('no multiple subscriptions', async () => {
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    await doSubscribe(context, options, {
      topicName: 'event-type-1',
      topicId: 'aggregate-id-1'
    })
    expect(mockSubscribe).toBeCalledTimes(1)
  })
})
