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
  static async getInitialProps({ Component, router, ctx }) {
    const routes = await fetch('http://localhost:3000/stories').then(res => res.json())
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, routes, currentPage: ctx.asPath }
  }

  render() {
    const { Component, pageProps, routes, currentPage } = this.props
    console.log(routes)
    const source = currentPage !== '/' ? routes.filter(r => r.route === currentPage)[0].src : ''
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
