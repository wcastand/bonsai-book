import React from 'react'

const style = {
  fontSize: '2rem',
  color: 'hotpink',
  transform: 'rotate(30deg)',
}

export default ({ children, ...props }) => (
  <span style={style} {...props}>
    {children}
  </span>
)
