import unfetch from 'unfetch'
import { assertLeadingSlash } from './assertions'
import { isAbsoluteUrl } from './utils'
import { Context } from './context'

const getRootBasedUrl = (origin?: string, rootPath: string, path: string) => {
  if (isAbsoluteUrl(path)) {
    return path
  }

  assertLeadingSlash(path, 'Path')

  return `${origin ?? ''}${rootPath ? `/${rootPath}` : ''}${path}`
}

const doFetch = async (
  rootBasedUrl: string,
  options: RequestInit
): Promise<Response> => {
  try {
    return fetch(rootBasedUrl, options)
  } catch (err) {
    return unfetch(rootBasedUrl, options)
  }
}

const request = async (
  context: Context,
  url: string,
  body: object
): Promise<Response> => {
  const { origin, rootPath, jwtProvider } = context
  const rootBasedUrl = getRootBasedUrl(origin, rootPath, url)
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

  const response = await doFetch(rootBasedUrl, options)

  if (jwtProvider && response.headers) {
    await jwtProvider.set(response.headers.get('x-jwt') ?? '')
  }

  return response
}

interface Command {
  type: string
  aggregateId: string
  aggregateName: string
  payload?: object
}

export const sendCommand = async (
  context: Context,
  command: Command
): Promise<void> => {
  let response
  let result
  try {
    response = await request(context, '/api/commands', command)
  } catch (error) {
    throw new FetchError(error)
  }

  /*


  let response, result
  try {
    response = await request('/api/commands', {
      type: commandType,
      aggregateId,
      aggregateName,
      payload
    })
  } catch (error) {
    throw new FetchError(error)
  }

  await validateStatus(response)

  if (!response.ok) {
    throw new HttpError({
      code: response.status,
      message: await response.text()
    })
  }

  try {
    result = await response.json()
  } catch (error) {
    throw new HttpError(error)
  }

  return result

 */
}
