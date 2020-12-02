import { useEffect, useState } from 'react'
import Canvas, { useCanvas } from './canvas'
import {
  color,
  nodeItemHeight as itemHeight,
  nodeItemWidth,
  contentHeight as defaultContentHeight,
  contentWidth,
  dpr,
  len,
  clone,
  rand,
  min,
  max,
} from './helper'
import { Node } from './type'
import { TreeSetPos as setPos, TreeNextFrame as nextFrame } from './node-render'
import useAnimate from './animate'

const itemWidth = 50
const contentHeight = (defaultContentHeight / 4) * 3
const levelHeight = 64

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

        width: nodeItemWidth,
        height: itemHeight,
        fillStyle: color.black,
        strokeStyle: color.black,
      } as Node)
  )

const AVLTreeData = ({ type }) => {
  let arr = [...clone(initArr)]
  let root = null

  const [canvas, ctx] = useCanvas()

  const getPayload = () => ({
    canvas,
    ctx,
    arr,
    root,
    contentHeight,
    levelHeight,
    itemWidth,
  })

  const [restart, _animate] = useAnimate(setPos, nextFrame)

  const animate = async (duration?: number, delay?: number) => {
    await _animate({ ...getPayload() }, duration)
  }

  const getBalanceFactor = node => {
    return node ? getHeight(node.l) - getHeight(node.r) : 0
  }

  const getHeight = node => {
    return node ? node.h : 0
  }

  const leftRotate = x => {
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(getHeight(x.l), getHeight(x.r)) + 1
    y.h = Math.max(getHeight(y.l), getHeight(y.r)) + 1

    x.balanceFactor = getBalanceFactor(x)
    y.balanceFactor = getBalanceFactor(y)

    return y
  }

  const rightRotate = x => {
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(getHeight(x.l), getHeight(x.r)) + 1
    y.h = Math.max(getHeight(y.l), getHeight(y.r)) + 1

    x.balanceFactor = getBalanceFactor(x)
    y.balanceFactor = getBalanceFactor(y)

    return y
  }

  const add = async (node, item) => {
    if (!node) return item

    if (item.n > node.n) {
      node.r = await add(node.r, item)
    } else if (item.n < node.n) {
      node.l = await add(node.l, item)
    } else {
      // ===
    }

    const balanceFactor = getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      await animate()

      if (balanceFactor > 0) {
        if (getBalanceFactor(node.l) < 0) node.l = leftRotate(node.l)
        node = rightRotate(node)
      } else {
        if (getBalanceFactor(node.r) > 0) node.r = rightRotate(node.r)
        node = leftRotate(node)
      }
    }

    node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
    node.balanceFactor = getBalanceFactor(node)

    return node
  }

  const createAVLTree = async () => {
    const cloneArr = clone(arr)
    for (let i = 0; i < cloneArr.length; i++) {
      const node = cloneArr[i]
      arr[i].fillStyle = color.blue
      node.width = itemWidth

      node.h = 1
      node.balanceFactor = 0
      node.fillStyle = color.blue
      root = await add(root, node)
      await animate()
    }
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
      await animate()
      await createAVLTree()
    })()
  }, [type])

  return null
}

const AVLTree = () => {
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
        <AVLTreeData type={type} />
      </Canvas>
    </>
  )
}

export default AVLTree
