import unfetch from 'unfetch'
import { Context } from './context'
import { isAbsoluteUrl } from './utils'
import { assertLeadingSlash } from './assertions'

type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>

let determinedFetch: FetchFunction | null = null

const determineFetch = (): FetchFunction => {
  if (!determinedFetch) {
    determinedFetch = typeof fetch === 'function' ? fetch : unfetch
  }
  return determinedFetch
}


const getRootBasedUrl = (rootPath: string, path: string, origin?: string): string => {
  if (isAbsoluteUrl(path)) {
    return path
  }

  assertLeadingSlash(path, 'Path')

  return `${origin ?? ''}${rootPath ? `/${rootPath}` : ''}${path}`
}

const request = async (context: Context, url: string, body: object): Promise<Response> => {
  const { origin, rootPath, jwtProvider } = context
  const rootBasedUrl = getRootBasedUrl(rootPath, url, origin)
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  }

  if (options.headers) {
    const token = await jwtProvider?.get()
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }
  }

  let response: Response

  try {
    response = await doFetch(rootBasedUrl, options)
  } catch (error) {
    throw new FetchError(error)
  }

  if (temporaryErrorHttpCodes.includes(response.status)) {
    throw new FetchError({
      code: response.status,
      message: await response.text()
    })
  }

  if (!response.ok) {
    throw new HttpError({
      code: response.status,
      message: await response.text()
    })
  }

  if (jwtProvider && response.headers) {
    await jwtProvider.set(response.headers.get('x-jwt') ?? '')
  }

  return response
}

export type API = {
  execCommand: unknown
  execQuery: unknown
  bindViewModel: unknown
}

const getApiForContext = (context: Context) => {}
