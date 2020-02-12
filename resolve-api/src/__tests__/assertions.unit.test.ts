import { assertLeadingSlash } from '../assertions'

describe('assertLeadingSlash', () => {
  test('value values', () => {
    assertLeadingSlash('/path')
    assertLeadingSlash('/../path')
    assertLeadingSlash('//path')
  })

  test('invalid values', () => {
    expect(() => assertLeadingSlash('path')).toThrow()
    expect(() => assertLeadingSlash(' /path')).toThrow()
    expect(() => assertLeadingSlash('\\path')).toThrow()
    expect(() => assertLeadingSlash('')).toThrow()
    expect(() => assertLeadingSlash(' ')).toThrow()
  })
})
