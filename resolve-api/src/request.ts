import unfetch from 'unfetch'
import { Context } from './context'
import { getRootBasedUrl } from './utils'
import determineOrigin from './determine_origin'
import { GenericError, HttpError } from './errors'

type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>
type ResponseValidator = (response: Response) => Promise<boolean>
export type NarrowedResponse = {
  ok: boolean
  status: number
  headers: {
    get: (name: string) => string | null
  }
  json: () => Promise<object>
  text: () => Promise<string>
}

const everythingValid: ResponseValidator = () => Promise.resolve(true)

let cachedFetch: FetchFunction | null = null

const determineFetch = (): FetchFunction => {
  if (!cachedFetch) {
    cachedFetch = typeof fetch === 'function' ? fetch : unfetch
  }
  return cachedFetch
}

export type RequestOptions = {
  retryOnError?: {
    errors: number[] | number
    attempts: number
    period: number
  }
  waitForResponse?: {
    validator: ResponseValidator
    attempts: number
    period: number
  }
  debug?: boolean
}

const insistentRequest = async (
  input: RequestInfo,
  init: RequestInit,
  options?: RequestOptions,
  attempts = {
    error: 0,
    response: 0
  }
): Promise<Response> => {
  let response

  try {
    response = await determineFetch()(input, init)
  } catch (error) {
    throw new GenericError(error)
  }

  if (response.ok) {
    if (options?.waitForResponse) {
      const isValid = await (options?.waitForResponse?.validator ?? everythingValid)(response)
      if (isValid) {
        return response
      }

      const isMaxAttemptsReached = attempts.response >= (options?.waitForResponse?.attempts ?? 0)

      if (isMaxAttemptsReached) {
        throw new GenericError(` ${attempts.response} retries`)
      }

      if (options?.debug) {
        console.warn(
          `Unexpected response. Attempting again #${attempts.response + 1}/${
            options?.waitForResponse?.attempts
          }.`
        )
      }

      const period = options?.retryOnError?.period

      if (typeof period === 'number' && period > 0) {
        await new Promise(resolve => setTimeout(resolve, period))
      }

      return insistentRequest(input, init, options, {
        ...attempts,
        response: attempts.response + 1
      })
    }
    return response
  }

  const expectedErrors = options?.retryOnError?.errors

  if (expectedErrors) {
    const isErrorExpected =
      typeof expectedErrors === 'number'
        ? expectedErrors === response.status
        : expectedErrors.includes(response.status)
    const isMaxAttemptsReached = attempts.error >= (options?.retryOnError?.attempts ?? 0)

    if (isErrorExpected && !isMaxAttemptsReached) {
      if (options?.debug) {
        console.warn(
          `Error code ${response.status} was expected. Attempting again #${attempts.error + 1}/${
            options?.retryOnError?.attempts
          }.`
        )
      }

      const period = options?.retryOnError?.period

      if (typeof period === 'number' && period > 0) {
        await new Promise(resolve => setTimeout(resolve, period))
      }
      return insistentRequest(input, init, options, {
        ...attempts,
        error: attempts.error + 1
      })
    }
  }

  const error = new HttpError(response.status, await response.text())

  if (options?.debug) {
    console.error(error)
  }

  throw error
}

export const request = async (
  context: Context,
  url: string,
  body: object,
  options?: RequestOptions
): Promise<NarrowedResponse> => {
  const { origin, rootPath, jwtProvider } = context
  const rootBasedUrl = getRootBasedUrl(rootPath, url, determineOrigin(origin))
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  }

  if (init.headers) {
    const token = await jwtProvider?.get()
    if (token) {
      init.headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await insistentRequest(rootBasedUrl, init, options)

  if (jwtProvider && response.headers) {
    await jwtProvider.set(response.headers.get('x-jwt') ?? '')
  }

  return response
}
