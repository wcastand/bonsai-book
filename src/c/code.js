import React, { useEffect, useState, useReducer, useRef } from 'react'
import styled from 'react-emotion'
import Highlight from 'react-highlight'
import { useSpring, animated } from 'react-spring'

if (process.browser) {
  const Hammer = require('hammerjs')
}

const Container = styled(animated.div)`
  position: relative;
  flex: 1;
  max-width: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: #f8f8f8;
  overflow: hidden;
`

const Code = styled(Highlight)`
  flex: 1;
  padding: 24px;
  font-size: 14px;
  overflow: auto;
`

const DragZone = styled(animated.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 30px;
  z-index: 99;
  cursor: col-resize;
`

const SourceCode = ({ source, show }) => {
  const node = useRef()
  const dragnode = useRef()
  const [drag, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'toggle':
          return { ...state, on: action.payload }
          break
        case 'end':
          return { ...state, delta: state.delta + (action.payload - state.ld), ld: 0 }
        case 'set':
          return { ...state, delta: state.delta + (action.payload - state.ld), ld: action.payload }
          break
        default:
          return state
      }
    },
    { on: false, delta: 0, ld: 0 },
  )
  const [props, set] = useSpring({ x: show ? 500 + drag.delta : 0 })

  useEffect(() => {
    if (process.browser) {
      const hammertime = new Hammer(dragnode.current)
      hammertime.on('panstart', () => dispatch({ type: 'toggle', payload: true }))
      hammertime.on('panmove', e => dispatch({ type: 'set', payload: e.deltaX }))
      hammertime.on('panend', e => {
        dispatch({ type: 'toggle', payload: false })
        dispatch({ type: 'end', payload: e.deltaX })
      })

      return () => {
        hammertime.off('panstart')
        hammertime.off('panmove')
        hammertime.off('panend')

        hammertime.stop()
      }
    }
  }, [])

  useEffect(
    () => {
      set({ x: show ? 500 + drag.delta : 0 })
    },
    [show, drag],
  )
  return (
    <Container
      innerRef={node}
      style={{
        maxWidth: drag.on ? 500 + drag.delta : props.x,
      }}
    >
      <DragZone innerRef={dragnode} />
      <Code className="javascript">{source}</Code>
    </Container>
  )
}

export default SourceCode
