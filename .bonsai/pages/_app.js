import React from 'react'
import App, { Container } from 'next/app'
import styled from 'react-emotion'
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
  state = { routes: [] }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, currentPage: ctx.asPath }
  }
  fetchRoutes = () => {
    return fetch('http://localhost:3000/stories')
      .then(res => res.json())
      .then(routes => this.setState({ routes }))
  }

  componentDidMount() {
    this.fetchRoutes()
  }
  componentWillUpdate() {
    this.fetchRoutes()
  }
  render() {
    const { Component, pageProps, currentPage } = this.props
    const { routes } = this.state
    const source =
      currentPage !== '/' && routes.length !== 0
        ? routes.filter(r => r.route === currentPage)[0].src
        : ''
    return (
      <Container>
        <Layout>
          <Panel routes={routes} />
          <Preview showSrc={currentPage !== '/'} source={source}>
            <Component {...pageProps} />
          </Preview>
        </Layout>
      </Container>
    )
  }
}
