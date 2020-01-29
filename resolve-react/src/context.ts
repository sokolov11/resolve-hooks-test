import React from 'react'
import { JSONWebTokenProvider } from './jwt_provider'

export const ResolveContext = React.createContext(null)

export interface Context {
  origin?: string
  rootPath: string
  jwtProvider?: JSONWebTokenProvider
}
