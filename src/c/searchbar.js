import React from 'react'
import styled from 'react-emotion'
import { FiSearch } from 'react-icons/fi'

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SearchBox = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 8px 24px;
  padding: 8px;
  border-radius: 24px;
  background-color: #f8f8f8;
  border: 1px solid #a7a7a7;
`

const Input = styled('input')`
  flex: 1;
  outline: none;
  border: none;
  background-color: #f8f8f8;
  margin-left: 4px;
`

export default ({ input, setInput }) => {
  const onChange = e => setInput(e.target.value)
  return (
    <Container>
      <SearchBox>
        <FiSearch />
        <Input value={input} onChange={onChange} />
      </SearchBox>
    </Container>
  )
}
