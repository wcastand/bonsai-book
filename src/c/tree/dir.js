import React, { useState } from 'react'
import styled from 'react-emotion'
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
const Title = styled('h5')`
  display: flex;
  text-decoration: none;
  margin: 1px;
  padding: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #282a36;
  cursor: pointer;
  user-select: none;
`

const FolderTitle = ({ setUnfold, name, unfold }) => {
  return (
    <FolderTitleContainer onClick={() => setUnfold(!unfold)}>
      {unfold ? <FiFolderMinus size={16} /> : <FiFolderPlus size={16} />}
      <Title>{name}</Title>
    </FolderTitleContainer>
  )
}
export default ({ name, tree }) => {
  const [unfold, setUnfold] = useState(true)
  return (
    <SubContainer>
      <FolderTitle {...{ name, unfold, setUnfold }} />
      {unfold && <SubMenu>{tree}</SubMenu>}
    </SubContainer>
  )
}
