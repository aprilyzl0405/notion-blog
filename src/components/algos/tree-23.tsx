import { useState, useEffect } from 'react'
import {
  nodeItemWidth as itemWidth,
  nodeItemHeight as itemHeight,
  contentHeight as defaultContentHeight,
  contentWidth,
  dpr,
  len,
  color,
  clone,
  rand,
  min,
  max,
} from './helper'
import Canvas, { useCanvas } from './canvas'
import { Node } from './type'
import useAnimate from './animate'
import {
  Tree23SetPos as setPos,
  TreeNextFrame as nextFrame,
} from './node-render'

const contentHeight = (defaultContentHeight / 4) * 3

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

const SortStrategy = ({ type }) => {
  let arr = [...clone(initArr)]
  let root = null

  const [canvas, ctx] = useCanvas()

  const getPayload = () => ({
    canvas,
    ctx,
    arr,
    root,
    contentHeight,
    itemWidth,
    isRed,
  })

  const [restart, _animate] = useAnimate(setPos, nextFrame)

  const animate = async (duration?: number, delay?: number) => {
    await _animate({ ...getPayload() }, duration)
  }

  const flipColors = node => {
    node.l.fillStyle = node.r.fillStyle = color.black
    node.fillStyle = color.red
  }

  const isRed = node => (node ? node.fillStyle === color.red : false)

  const leftRotate = x => {
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = color.red

    return y
  }

  const rightRotate = x => {
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = color.red

    return y
  }

  const add = async (node, item, isR?: boolean) => {
    if (!node) return item

    if (item.n > node.n) {
      node.r = await add(node.r, item, isR)
    } else if (item.n < node.n) {
      node.l = await add(node.l, item, isR)
    } else {
      // ===
    }

    isRed(node) && (isR ? isRed(node.l) : isRed(node.l)) && (await animate())

    if (isR) {
      if (isRed(node.l) && !isRed(node.r)) node = rightRotate(node)
      if (isRed(node.r) && isRed(node.r.r)) node = leftRotate(node)
    } else {
      if (!isRed(node.l) && isRed(node.r)) node = leftRotate(node)
      if (isRed(node.l) && isRed(node.l.l)) node = rightRotate(node)
    }

    if (isRed(node.l) && isRed(node.r)) flipColors(node)

    return node
  }

  const createTree23 = async () => {
    const cloneArr = clone(arr)
    for (let i = 0; i < cloneArr.length; i++) {
      const node = cloneArr[i]
      arr[i].fillStyle = color.blue
      node.fillStyle = color.red
      root = await add(root, node)
      root.fillStyle = color.black
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
      await createTree23()
    })()
  }, [type])

  return null
}

const Tree23 = () => {
  const [type, setType] = useState('')

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
        <SortStrategy type={type} />
      </Canvas>
    </>
  )
}

export default Tree23
