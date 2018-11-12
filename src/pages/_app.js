import React, { useState, useEffect } from 'react'
import App, { Container } from 'next/app'
import { IconContext } from 'react-icons'
import styled from 'react-emotion'
import io from 'socket.io-client'
import 'isomorphic-fetch'

import Panel from '../c/panel'
import Preview from '../c/preview'

const Layout = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  min-height: 100vh;
`

const MyApp = ({ Component, pageProps, currentPage }) => {
  const [stories, setStories] = useState([])
  const [tree, setTree] = useState([])

  const handleStories = res => {
    setStories(res.stories)
    setTree(res.tree)
  }

  useEffect(() => {
    const socket = io()
    socket.on('stories', handleStories)
    return () => {
      socket.off('stories', handleStories)
      socket.close()
    }
  }, [])

  const source =
    currentPage !== '/' && stories.length !== 0
      ? stories.filter(r => r.path === currentPage)[0].src
      : null
  return (
    <Container>
      <IconContext.Provider value={{ className: 'react-icons' }}>
        <Layout>
          <Panel {...{ stories, tree, currentPage }} />
          <Preview source={source}>
            <Component {...pageProps} />
          </Preview>
        </Layout>
      </IconContext.Provider>
    </Container>
  )
}

MyApp.getChildContext = App.getChildContext
MyApp.getInitialProps = async ({ Component, router, ctx }) => {
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps, currentPage: ctx.asPath }
}

export default MyApp
