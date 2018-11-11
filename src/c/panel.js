import React, { useState } from 'react'
import Link from 'next/link'
import styled from 'react-emotion'

import Logo from './logo'
import Dir from './tree/dir'
import File from './tree/file'

const Container = styled('div')`
  z-index: 99;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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

export default ({ stories, tree, currentPage }) => {
  const makeMenu = t =>
    t.map(id => {
      if (Array.isArray(id)) {
        const dir = stories.find(story => story.id === id[0])
        const name = dir.name
        const tree = makeMenu(id[1])
        return <Dir key={`dir_${name}`} {...{ name, tree }} />
      } else {
        const file = stories.find(story => story.id === id)
        const active = currentPage === file.path
        return <File key={`dir_item_${id}`} {...{ file, active, id }} />
      }
    })

  return (
    <Container>
      <Logo src="/static/logo.svg" />
      <Menu>{makeMenu(tree)}</Menu>
    </Container>
  )
}
