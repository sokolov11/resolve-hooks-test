import { createContext } from 'react'
import { Context } from 'resolve-api'

/* import { JSONWebTokenProvider } from './jwt_provider'
import { ViewModel } from './view_model_types'
import { CreateSubscribeAdapter } from './empty_subscribe_adapter'

export interface Context {
  origin?: string
  rootPath: string
  jwtProvider?: JSONWebTokenProvider
  viewModels: Array<ViewModel>
  subscribeAdapter?: CreateSubscribeAdapter
}
 */
export const ResolveContext = createContext<Context>({
  origin: '',
  rootPath: '',
  staticPath: '',
  viewModels: []
})
