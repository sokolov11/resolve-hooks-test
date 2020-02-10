const regExpAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i')

export const isAbsoluteUrl = (value: string): boolean => regExpAbsoluteUrl.test(value)
