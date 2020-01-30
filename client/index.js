import React from 'react'

import { render } from 'react-dom'

import { ResolveContext } from 'resolve-react-hooks'

import App from './containers/App'

const entryPoint = ({ rootPath, viewModels, staticPath, subscribeAdapter }) => {
  const appContainer = document.createElement('div')
  document.body.appendChild(appContainer)
  render(
    <ResolveContext.Provider value={{ rootPath, viewModels, subscribeAdapter }}>
      <App staticPath={staticPath} />
    </ResolveContext.Provider>,
    appContainer
  )
}

export default entryPoint
