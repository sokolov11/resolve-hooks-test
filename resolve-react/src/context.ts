import { createContext } from 'react'
import { JSONWebTokenProvider } from './jwt_provider'

export interface Context {
  origin: string
  rootPath: string
  jwtProvider?: JSONWebTokenProvider
}

export const ResolveContext = createContext<Context>({
  origin: '',
  rootPath: ''
})
