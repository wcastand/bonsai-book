import React from 'react'
import Link from 'next/link'
import styled from 'react-emotion'

const Container = styled('div')`
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #f8f8f8;
  border-right: 1px solid #ef8354;
`

const SubContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Menu = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
  padding-left: 24px;
`

const SubMenu = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
  padding-left: 24px;
`

const Item = styled('a')`
  display: flex;
  text-decoration: none;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
`

const Title = styled('h5')`
  display: flex;
  text-decoration: none;
  margin: 0;
  padding: 8px;
  font-size: 18px;
  font-weight: 700;
`

export default ({ stories, tree }) => {
  const makeMenu = t =>
    t.map(id => {
      if (Array.isArray(id)) {
        const dir = stories.find(story => story.id === id[0])
        return (
          <SubContainer key={`menu_item_${dir.name}`}>
            <Title>{dir.name}</Title>
            <SubMenu>{makeMenu(id[1])}</SubMenu>
          </SubContainer>
        )
      } else {
        const file = stories.find(story => story.id === id)
        return (
          <Link href={file.path} key={`menu_item_${id}`}>
            <Item>{file.name}</Item>
          </Link>
        )
      }
    })
  return (
    <Container>
      <Link href="/">
        <Item big>Bonsai UI</Item>
      </Link>
      <Menu>{makeMenu(tree)}</Menu>
    </Container>
  )
}
