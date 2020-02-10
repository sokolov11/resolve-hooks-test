export function assertLeadingSlash(value: string, name?: string): void {
  if (!value?.startsWith('/')) {
    console.error(value)
    throw Error(`${name ?? 'the value'} must have leading "/"`)
  }
}
