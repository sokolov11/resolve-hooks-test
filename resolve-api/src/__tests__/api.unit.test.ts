import { mocked } from 'ts-jest/utils'
import { API, getApi } from '../api'
import { Context } from '../context'
import { NarrowedResponse, request } from '../request'

jest.mock('../request', () => ({
  request: jest.fn()
}))

const createMockResponse = (overrides: object = {}): NarrowedResponse => ({
  ok: true,
  status: 200,
  headers: {
    get: (header: string): string | null => `${header}-value`
  },
  json: (): Promise<object> =>
    Promise.resolve({
      data: 'response-data'
    }),
  text: (): Promise<string> => Promise.resolve('response-text'),
  ...overrides
})

const createMockContext = (): Context => ({
  origin: 'mock-origin',
  staticPath: 'static-path',
  rootPath: 'root-path',
  jwtProvider: undefined,
  subscribeAdapter: undefined,
  viewModels: []
})

const mRequest = mocked(request)

let mockContext: Context
let api: API

beforeAll(() => {
  mRequest.mockResolvedValue(createMockResponse())
})

beforeEach(() => {
  mockContext = createMockContext()
  api = getApi(mockContext)
})

afterAll(() => {
  mRequest.mockClear()
})

describe('query', () => {
  let getHeader: () => string
  let getJson: () => Promise<object>

  beforeEach(() => {
    getHeader = jest.fn((): string => '12345')
    getJson = jest.fn(
      (): Promise<object> =>
        Promise.resolve({
          result: 'query-result'
        })
    )
    mRequest.mockResolvedValueOnce(
      createMockResponse({
        headers: {
          get: getHeader
        },
        json: getJson
      })
    )
  })

  test('a request made', async () => {
    await api.query({
      name: 'query-name',
      resolver: 'query-resolver',
      args: {
        name: 'value'
      }
    })

    expect(mRequest).toHaveBeenCalledWith(
      mockContext,
      '/api/query/query-name/query-resolver',
      { name: 'value' },
      undefined
    )
  })

  test('result constructed from response data', async () => {
    const result = await api.query({
      name: 'query-name',
      resolver: 'query-resolver',
      args: {
        name: 'value'
      }
    })

    expect(getHeader).toHaveBeenCalledWith('Date')
    expect(getJson).toHaveBeenCalled()
    expect(result).toEqual({
      timestamp: 12345,
      data: {
        result: 'query-result'
      }
    })
  })

  test('callback instead of options', done => {
    api.query(
      {
        name: 'query-name',
        resolver: 'query-resolver',
        args: {
          name: 'value'
        }
      },
      (error, result) => {
        if (error) {
          done(error)
        }

        expect(result).toEqual({
          timestamp: 12345,
          data: {
            result: 'query-result'
          }
        })

        done()
      }
    )
  })
})
