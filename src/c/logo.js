import React from 'react'
import Link from 'next/link'
import styled from 'react-emotion'

const LogoContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Logo = styled('img')`
  height: 48px;
`

const LogoText = styled('h2')`
  text-align: center;
  text-decoration: none;
  margin: 24px;
  padding: 0;
  font-size: 22px;
  font-weight: 700;
  color: #282a36;
`

export default () => {
  return (
    <Link href="/">
      <LogoContainer>
        <Logo src="/static/logo.svg" />
        <LogoText>Bonsai UI</LogoText>
      </LogoContainer>
    </Link>
  )
}
