import React, { useState } from 'react'
import styled from 'react-emotion'
import { FiCode } from 'react-icons/fi'

import Code from './code'

const Container = styled('div')`
  position: relative;
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  overflow: auto;
  background-color: #fff;
`

const Show = styled('div')`
  z-index: 1;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`

const CodeIcon = styled(FiCode)`
  z-index: 10;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`

const Preview = ({ source, ...props }) => {
  const [showCode, toggleCode] = useState(false)
  return (
    <Container>
      {source !== null && <Code source={source} show={showCode} />}
      <Show {...props} />
      {source !== null && <CodeIcon onClick={() => toggleCode(!showCode)} />}
    </Container>
  )
}

export default Preview
