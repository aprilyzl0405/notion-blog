import { useEffect, useState } from 'react'
import {
  color,
  nodeItemHeight as itemHeight,
  nodeItemWidth as itemWidth,
  contentHeight as defaultContentHeight,
  contentWidth,
  levelHeight,
  dpr,
  clone,
  paddingH,
  paddingTop,
} from './helper'
import Canvas, { useCanvas } from './canvas'
import { Node } from './type'
import useAnimate from './animate'
import { renderNode as renderItemNode } from './node-render'

const contentHeight = defaultContentHeight / 2

const n = 10
const level = Math.ceil(Math.log(n + 1) / Math.log(2)) + 1
const len = Math.pow(2, level) - 1
const branchIndex = Math.floor((len - 2) / 2)

const initArr = Array(len)
  .fill(0)
  .map(
    () =>
      ({
        n: null,
        x: 0,
        y: 0,

        to: {
          x: 0,
          y: 0,
        },

        width: itemWidth,
        height: itemHeight,
        fillStyle: color.black,
        strokeStyle: color.black,
      } as Node)
  )

const SortStrategy = ({ type }) => {
  const [canvas, ctx] = useCanvas()

  let arr = [...clone(initArr)]

  const setPos = () => {
    let count = 0

    for (let i = 0; i < level; i++) {
      const n = Math.pow(2, i)
      const perW = contentWidth / n

      for (let j = 0; j < n && count + j < arr.length; j++) {
        const index = count + j
        const node = arr[index]

        node.to.x = perW * j + perW / 2 - itemWidth / 2
        node.to.y = i * levelHeight
      }

      count += n
    }
  }

  const nextFrame = elapsed => {
    if (!ctx) return

    arr.forEach(node => {
      if (!node) return

      node.x = node.x + elapsed * (node.to.x - node.x)
      node.y = node.y + elapsed * (node.to.y - node.y)

      const renderLine = () => {
        for (let i = branchIndex; i > -1; i--) {
          const node = arr[i]
          const nodeL = arr[i * 2 + 1]
          const nodeR = arr[i * 2 + 2]

          ctx.beginPath()
          nodeL && ctx.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
          ctx.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
          nodeR && ctx.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
          ctx.strokeStyle = color.black
          ctx.stroke()
        }
      }

      const renderNode = () => {
        arr.forEach(node => {
          renderItemNode(ctx, node)
        })
      }

      ctx.fillStyle = color.white
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(0, paddingH)
      renderLine()
      renderNode()
      ctx.restore()
    })
  }

  const [restart, animate] = useAnimate(setPos, nextFrame, { duration: 200 })

  const createSegmentTree = async () => {
    if (!ctx) return

    const create = async (treeIndex, l, r) => {
      if (l >= r) {
        arr[treeIndex].fillStyle = color.blue
        arr[treeIndex].n = '[' + l + ']'
        await animate()
        return
      }

      arr[treeIndex].fillStyle = color.blue
      arr[treeIndex].n = '[' + l + '..' + r + ']'
      arr[treeIndex].width = Math.max(
        itemWidth,
        ctx.measureText(arr[treeIndex].n).width + 10
      )
      await animate()

      if (type === 'Left') {
        const mid = l + Math.floor((r - l) / 2)
        await create(treeIndex * 2 + 1, l, mid)
        await create(treeIndex * 2 + 2, mid + 1, r)
      } else {
        const mid = l + Math.ceil((r - l) / 2)
        await create(treeIndex * 2 + 1, l, mid - 1)
        await create(treeIndex * 2 + 2, mid, r)
      }
    }

    await create(0, 0, n)
  }

  useEffect(() => {
    ;(async () => {
      restart()
      arr = [...clone(initArr)]
      await animate()

      await createSegmentTree()
    })()
  }, [type])

  return null
}

const SegmentTree = () => {
  const [type, setType] = useState('')

  return (
    <>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {['Left', 'Right'].map(i => (
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

export default SegmentTree
