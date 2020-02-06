import { Context } from './context'

export type Api = {
  executeCommand: () => void
  executeQuery: () => void
  viewModel: () => void
}

export const useApi = (context: Context): Api => {
  return {}
}
