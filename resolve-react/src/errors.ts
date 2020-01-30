export class ApiError extends Error {}

export class FetchError extends ApiError {
  constructor(error) {
    super(error)
    this.name = 'FetchError'
  }
}

export class HttpError extends ApiError {
  constructor(error) {
    super(error)
    this.name = 'HttpError'
  }
}
