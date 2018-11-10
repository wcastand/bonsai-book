import React from 'react'
import App, { Container } from 'next/app'
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

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, currentPage: ctx.asPath }
  }
  state = { socket: null, stories: [], tree: [] }

  componentDidMount() {
    const socket = io()
    this.setState({ socket })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.socket !== this.state.socket) {
      nextState.socket.on('stories', this.handleStories)
    }
  }

  componentWillUnmount() {
    this.state.socket.off('stories', this.handleStories)
    this.state.socket.close()
  }

  handleStories = res => this.setState(res)

  render() {
    const { Component, pageProps, currentPage } = this.props
    const { stories, tree } = this.state
    const source =
      currentPage !== '/' && stories.length !== 0
        ? stories.filter(r => r.path === currentPage)[0].src
        : ''
    return (
      <Container>
        <Layout>
          <Panel {...{ stories, tree }} />
          <Preview showSrc={currentPage !== '/'} source={source}>
            <Component {...pageProps} />
          </Preview>
        </Layout>
      </Container>
    )
  }
}
