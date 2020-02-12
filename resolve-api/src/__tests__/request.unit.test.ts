import { mocked } from 'ts-jest/utils'
import { request } from '../request'
import { Context } from '../context'
import determineOrigin from '../determine_origin'
import { getRootBasedUrl } from '../utils'

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
  }
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

  mFetch.mockReturnValueOnce({
    ok: true,
    status: 200,
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
