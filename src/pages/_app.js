import React, { useState, useEffect } from 'react'
import App, { Container } from 'next/app'
import { IconContext } from 'react-icons'
import styled from 'react-emotion'
import io from 'socket.io-client'
import preval from 'preval.macro'
import 'isomorphic-fetch'

import Panel from '../c/panel'
import Preview from '../c/preview'

const default_stories = preval`
const { getSubTree } = require('../utils')
module.exports = getSubTree()
`

const Layout = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  min-height: 100vh;
`

const MyApp = ({ Component, pageProps, currentPage }) => {
  const [stories, setStories] = useState(default_stories.stories || [])
  const [tree, setTree] = useState(default_stories.tree || [])

  const handleStories = res => {
    setStories(res.stories)
    setTree(res.tree)
  }

  const getSource = () => {
    if (currentPage === '/') {
      const currentStory = stories.find(r => r.path === '/index')
      return typeof currentStory === 'undefined' ? null : currentStory.src
    }
    const currentStory = stories.length !== 0 ? stories.find(r => r.path === currentPage) : null
    if (currentStory !== null && currentStory.isDir && currentStory.hasIndex)
      return stories.find(r => r.path === currentStory.path + '/index').src
    if (currentStory !== null && !currentStory.isDir) return currentStory.src
    return null
  }

  useEffect(() => {
    const socket = io()
    socket.on('stories', handleStories)
    return () => {
      socket.off('stories', handleStories)
      socket.close()
    }
  }, [])

  const source = getSource()

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
