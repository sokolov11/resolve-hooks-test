import { mocked } from 'ts-jest/utils'
import { request } from '../request'
import { Context } from '../context'
import determineOrigin from '../determine_origin'
import { getRootBasedUrl } from '../utils'
import { HttpError } from '../errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      fetch?: Function
    }
  }
}

jest.mock('../determine_origin', () => jest.fn((origin): string => origin))
jest.mock('../utils', () => ({
  getRootBasedUrl: jest.fn(() => 'root-based-url')
}))
const mFetch = jest.fn(() => ({
  ok: true,
  status: 200,
  headers: {
    get: (): void => undefined
  },
  text: (): Promise<string> => Promise.resolve('response')
}))
const mDetermineOrigin = mocked(determineOrigin)
const mGetRootBasedUrl = mocked(getRootBasedUrl)
const createMockContext = (): Context => ({
  origin: 'mock-origin',
  staticPath: 'static-path',
  rootPath: 'root-path',
  jwtProvider: undefined,
  subscribeAdapter: undefined,
  viewModels: []
})

beforeAll(() => {
  global.fetch = mFetch
})

afterAll(() => {
  global.fetch = undefined
})

let mockContext

beforeEach(() => {
  mockContext = createMockContext()
})

afterEach(() => {
  mFetch.mockClear()
  mDetermineOrigin.mockClear()
  mGetRootBasedUrl.mockClear()
})

test('root based url constructed with valid parameters', async () => {
  await request(mockContext, '/request', {
    param: 'param'
  })

  expect(mDetermineOrigin).toHaveBeenCalledWith('mock-origin')
  expect(mGetRootBasedUrl).toHaveBeenCalledWith('root-path', '/request', 'mock-origin')
})

test('global fetch called', async () => {
  await request(mockContext, '/request', {
    param: 'param'
  })

  expect(mFetch).toHaveBeenCalledWith('root-based-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ param: 'param' })
  })
})

test('http error thrown with response text', async () => {
  const fetchResult = mFetch()
  mFetch.mockClear()

  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 500,
    text: () => Promise.resolve('error-text')
  })

  await expect(
    request(mockContext, '/request', {
      param: 'param'
    })
  ).rejects.toEqual(new HttpError(500, 'error-text'))
})

test('jwt set to authorization header', async () => {
  const jwtProvider = {
    get: jest.fn(() => 'j-w-t'),
    set: jest.fn()
  }

  await request({ ...mockContext, jwtProvider }, '/request', {
    param: 'param'
  })

  expect(jwtProvider.get).toHaveBeenCalled()
  expect(mFetch).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer j-w-t' })
    })
  )
})

test('jwt updated via provider with response header', async () => {
  const jwtProvider = {
    get: jest.fn(() => 'j-w-t'),
    set: jest.fn()
  }
  const getHeader = jest.fn(() => 'response-jwt')
  const fetchResult = mFetch()
  mFetch.mockClear()

  mFetch.mockReturnValueOnce({
    ...fetchResult,
    headers: {
      get: getHeader
    }
  })

  await request({ ...mockContext, jwtProvider }, '/request', {
    param: 'param'
  })

  expect(jwtProvider.set).toHaveBeenCalledWith('response-jwt')
  expect(getHeader).toHaveBeenCalledWith('x-jwt')
})

test('retry on error', async () => {
  const fetchResult = mFetch()
  mFetch.mockClear()

  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 401
  })

  const response = await request(
    mockContext,
    '/request',
    {
      param: 'param'
    },
    {
      retryOnError: {
        errors: 401,
        attempts: 1,
        period: 1
      },
      debug: false
    }
  )

  expect(mFetch).toHaveBeenCalledTimes(2)
  expect(response).toEqual(
    expect.objectContaining({
      ok: true,
      status: 200
    })
  )
})

test('retry on various errors', async () => {
  const fetchResult = mFetch()
  mFetch.mockClear()

  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 401
  })
  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 500
  })

  const response = await request(
    mockContext,
    '/request',
    {
      param: 'param'
    },
    {
      retryOnError: {
        errors: [401, 500],
        attempts: 2,
        period: 1
      },
      debug: false
    }
  )

  expect(mFetch).toHaveBeenCalledTimes(3)
  expect(response).toEqual(
    expect.objectContaining({
      ok: true,
      status: 200
    })
  )
})

test('fail on unexpected errors', async () => {
  const fetchResult = mFetch()
  mFetch.mockClear()

  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 500
  })
  mFetch.mockReturnValueOnce({
    ...fetchResult,
    ok: false,
    status: 401
  })

  await expect(
    request(
      mockContext,
      '/request',
      {
        param: 'param'
      },
      {
        retryOnError: {
          errors: 500,
          attempts: 1,
          period: 1
        },
        debug: false
      }
    )
  ).rejects.toEqual(
    expect.objectContaining({
      code: 401
    })
  )

  expect(mFetch).toHaveBeenCalledTimes(2)
})
