import React from 'react'
import { Navbar, Image } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

import List from './containers/List'
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

  return (
    <div>
      <div>
        <Helmet title="ReSolve Hooks Example" link={links} meta={[meta]} />
      </div>
      <CommentTree />
      {/* <List /> */}
    </div>
  )
}

export default App
