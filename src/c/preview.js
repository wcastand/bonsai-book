import React from 'react'
import styled from 'react-emotion'
import Highlight from 'react-highlight'

const Container = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  overflow: auto;
  background-color: #f8f8f8;
`

const Show = styled('div')`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Code = styled(Highlight)`
  flex: 1;
  padding: 24px;
  font-size: 14px;
`

const Preview = ({ showSrc, source, ...props }) => {
  return (
    <Container>
      <Show {...props} />
      {showSrc && <Code className="javascript">{source}</Code>}
    </Container>
  )
}

export default Preview
