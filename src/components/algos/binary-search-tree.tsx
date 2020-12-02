import React, { useEffect, useState } from 'react'
import Canvas, { useCanvas } from './canvas'
import { Node } from './type'
import {
  contentWidth,
  dpr,
  len,
  nodeItemHeight as itemHeight,
  nodeItemWidth as itemWidth,
  levelHeight as defaultLevelHight,
  color,
  clone,
  paddingTop,
  rand,
  min,
  max,
} from './helper'
import useAnimate from './animate'
import { TreeSetPos as setPos, TreeNextFrame as nextFrame } from './node-render'

const contentHeight = contentWidth / 2

const initArr = Array(len)
  .fill(0)
  .map(
    (_, idx) =>
      ({
        n: idx + 1,
        x: 0,
        y: 0,

        to: {
          x: 0,
          y: 0,
        },

        r: null,
        l: null,

        width: itemWidth,
        height: itemHeight,
        fillStyle: color.black,
        strokeStyle: color.black,
      } as Node)
  )

const BinarySearchTreeData = ({ type = 'random' }) => {
  let arr = [...clone(initArr)]
  let root = null
  let root2 = null

  const [canvas, ctx] = useCanvas()

  const [restart, _animate] = useAnimate(setPos, nextFrame)

  const getPayload = () => {
    // const levelHeight = (contentHeight - paddingTop) / getHeight(root)

    return {
      canvas,
      ctx,
      arr,
      root,
      root2,
      contentHeight,
      levelHeight: defaultLevelHight,
    }
  }

  const animate = async (duration?: number, delay?: number) => {
    await _animate({ ...getPayload() }, duration)
  }

  const getHeight = node => {
    if (!node) return 0

    const leftHeight = getHeight(node.l)
    const rightHeight = getHeight(node.r)

    return Math.max(leftHeight, rightHeight) + 1
  }

  const add = (node, onode) => {
    if (!node) return onode

    if (onode.n > node.n) {
      node.r = add(node.r, onode)
    } else if (onode.n < node.n) {
      node.l = add(node.l, onode)
    } else {
    }

    return node
  }

  const flip = node => {
    if (!node) return

    flip(node.l)
    flip(node.r)

    const t = node.l
    node.l = node.r
    node.r = t

    return node
  }

  const createBinarySearchTree = async () => {
    const cloneArr = clone(arr)
    for (let i = 0; i < cloneArr.length; i++) {
      const node = cloneArr[i]
      arr[i].fillStyle = color.blue
      node.fillStyle = color.blue
      root = add(root, node)

      await animate()
    }

    root2 = flip(clone(root))

    await animate(1500)
  }

  useEffect(() => {
    ;(async () => {
      restart()
      if (type === 'random') {
        arr = [
          ...clone([...initArr.map(node => ({ ...node, n: rand(min, max) }))]),
        ]
      }

      if (type === 'positive') {
        arr = [...clone([...initArr].sort((a, b) => a.n - b.n))]
      }

      if (type === 'reverse') {
        arr = [...clone([...initArr].sort((a, b) => b.n - a.n))]
      }

      root = null
      root2 = null
      await animate()
      await createBinarySearchTree()
    })()
  }, [type])

  return null
}

const BinarySearchTree = () => {
  const [type, setType] = useState(null)

  return (
    <>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {['random', 'positive', 'reverse'].map(i => (
            <button
              key={i}
              className={`text-xs ${
                type === i ? 'hover:bg-blue-400' : 'hover:bg-gray-400'
              } ${
                type === i ? 'bg-blue-300' : 'bg-gray-300'
              } text-gray-800 font-bold py-1 px-3`}
              onClick={_ => setType(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <Canvas
        width={contentWidth}
        height={contentHeight}
        dpr={dpr}
        isAnimating={true}
      >
        <BinarySearchTreeData type={type} />
      </Canvas>
    </>
  )
}

export default BinarySearchTree
