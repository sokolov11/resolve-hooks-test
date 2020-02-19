import React, { useState } from 'react'
import { Navbar, Image } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

import Test from './containers/Test'

import CommentTree from './comments/CommentTree'

const App = ({ staticPath }) => {
  const stylesheetLink = {
    rel: 'stylesheet',
    type: 'text/css',
    href: `${staticPath}/bootstrap.min.css`
  }
  const faviconLink = {
    rel: 'icon',
    type: 'image/png',
    href: `${staticPath}/favicon.ico`
  }
  const links = [stylesheetLink, faviconLink]
  const meta = {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }

  const [online, setOnline] = useState(true)

  return (
    <div>
      <div>
        <Helmet title="ReSolve Hooks Example" link={links} meta={[meta]} />
      </div>
      <button
        onClick={() => {
          setOnline(true)
        }}
      >
        Go online
      </button>

      <button
        onClick={() => {
          setOnline(false)
        }}
      >
        Go offline
      </button>

      {online && <Test />}
    </div>
  )
}

export default App
