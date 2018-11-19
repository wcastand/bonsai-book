import React, { useState } from 'react'
import styled from 'react-emotion'
import Link from 'next/link'
import { FiFolderPlus, FiFolderMinus } from 'react-icons/fi'

const SubContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const SubMenu = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
  padding-left: 18px;
`

const FolderTitleContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const Title = styled('a')`
  display: flex;
  text-decoration: none;
  margin: 1px;
  padding: 8px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ active }) => (active ? '#028F76' : '#282a36')};
  cursor: pointer;
  user-select: none;
`

const FolderTitle = ({ unfold, setUnfold, active, dir: { name, hasIndex, path } }) => {
  return (
    <FolderTitleContainer>
      {unfold ? (
        <FiFolderMinus size={16} onClick={() => setUnfold(!unfold)} />
      ) : (
        <FiFolderPlus size={16} onClick={() => setUnfold(!unfold)} />
      )}
      {hasIndex ? (
        <Link href={path}>
          <Title active={active}>{name}</Title>
        </Link>
      ) : (
        <Title>{name}</Title>
      )}
    </FolderTitleContainer>
  )
}
export default ({ dir, active, tree }) => {
  const [unfold, setUnfold] = useState(true)
  return (
    <SubContainer>
      <FolderTitle {...{ dir, active, unfold, setUnfold }} />
      {unfold && <SubMenu>{tree}</SubMenu>}
    </SubContainer>
  )
}
