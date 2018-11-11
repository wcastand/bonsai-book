import Document, { Head, Main, NextScript } from 'next/document'
import { extractCritical } from 'emotion-server'
import { injectGlobal } from 'emotion'

injectGlobal`
  *{ box-sizing: border-box;}
  html, body {
    font-size: 16px;
    margin: 0;
    padding: 0;
    width: 100%;
    font-family: 'Roboto', Arial, sans-serif;
    font-style: 400;
    font-size: 16px;
  }
  pre{
    flex: 1;
    display: flex;
    min-width: 0;
    overflow: auto;
  }

  .react-icons {
    cursor:pointer;
  }
  `

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  constructor(props) {
    super(props)
    const { __NEXT_DATA__, ids } = props
    if (ids) {
      __NEXT_DATA__.ids = ids
    }
  }

  render() {
    return (
      <html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,500,700"
            rel="stylesheet"
          />
          <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
          <link rel="stylesheet" href="/static/github.css" />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
