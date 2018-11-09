import React from 'react'
import Link from 'next/link'
import styled from 'react-emotion'

const Container = styled('div')`
  width: 250px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #f8f8f8;
  border-right: 1px solid #ef8354;
`

const Menu = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0;
  padding: 24px;
`

const Item = styled('a')`
  display: flex;
  text-decoration: none;
  padding: 8px;
  cursor: pointer;
  font-size: ${({ big }) => (big ? 22 : 16)}px;
`

export default ({ routes }) => (
  <Container>
    <Menu>
      <Link href="/">
        <Item big>Bonsai UI</Item>
      </Link>
      {routes.map(({ route, name }) => (
        <Link href={route} key={`menu_item_${name}`}>
          <Item>{name}</Item>
        </Link>
      ))}
    </Menu>
  </Container>
)
