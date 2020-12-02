import { useEffect, useRef, useState } from 'react'
import useAnimate from './animate'
import Canvas, { useCanvas } from './canvas'
import { Node } from './type'
import {
  color,
  dpr,
  contentWidth,
  levelHeight,
  paddingTop,
  rand,
  swap,
  font,
  paddingV,
  clone,
  len,
  nodeItemHeight as itemHeight,
  nodeItemWidth as itemWidth,
  max,
  min,
} from './helper'

const branchIndex = Math.floor((len - 1 - 1) / 2)
// Heap tree height
const level = Math.ceil(Math.log(len + 1) / Math.log(2))
const _contentWidth = Math.pow(2, level - 1) * itemWidth
const translateX = (contentWidth - _contentWidth) / 2

const initArr = Array(len)
  .fill(0)
  .map(
    () =>
      ({
        n: rand(min, max),
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

const HeapData = ({ type = 'shiftUp' }) => {
  const [, ctx] = useCanvas()

  let [arr, _arr, _arr_] = [
    [...clone(initArr)],
    [...clone(initArr)],
    [...clone(initArr)],
  ]

  const setPos = () => {
    let count = 0
    ;[_arr, _arr_].forEach((__arr, stair) => {
      __arr.forEach((node, idx) => {
        node.to.x = idx * itemWidth
        node.to.y = stair * (itemHeight + 2)
      })
    })

    for (let i = 0; i < level; i++) {
      const n = Math.pow(2, i)
      const perW = _contentWidth / n

      for (let j = 0; j < n && count + j < arr.length; j++) {
        const index = count + j
        const node = arr[index]

        node.to.x = perW * j + perW / 2 - itemWidth / 2 + translateX
        node.to.y = i * levelHeight + paddingTop
      }

      count += n
    }
  }

  const renderNode = node => {
    const itemWidth = node.width
    const itemHeight = node.height
    const x = node.width ? node.x - (node.width - itemWidth) / 2 : node.x

    ctx.save()
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    ctx.fillStyle = node.fillStyle
    ctx.fill()
    ctx.restore()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = font
    ctx.fillStyle = color.white
    ctx.fillText(node.n, x + itemWidth / 2, node.y + itemHeight / 2)
  }

  const nextFrame = elapsed => {
    if (!ctx) return
    ;[_arr, _arr_, arr].forEach(__arr => {
      __arr.forEach(node => {
        node.x = node.x + elapsed * (node.to.x - node.x)
        node.y = node.y + elapsed * (node.to.y - node.y)
      })
    })

    ctx.fillStyle = color.white
    ctx.fillRect(0, 0, contentWidth, contentWidth)

    ctx.save()
    ctx.translate(0, paddingV)
    ;[_arr, _arr_].forEach(__arr => {
      __arr.forEach(node => {
        renderNode(node)
      })
    })

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

    arr.forEach(node => {
      renderNode(node)
    })
    ctx.restore()
  }

  const [restart, animate] = useAnimate(setPos, nextFrame)

  const shiftUp = async k => {
    while (k > 0) {
      const j = Math.floor((k - 1) / 2)

      arr[k].fillStyle = color.green
      _arr_[k].fillStyle = color.green
      await animate()

      arr[j].fillStyle = color.orange
      _arr_[j].fillStyle = color.orange
      await animate()

      if (arr[j].n > arr[k].n) {
        arr[k].fillStyle = color.blue
        _arr_[k].fillStyle = color.blue
        arr[j].fillStyle = color.blue
        _arr_[j].fillStyle = color.blue
        await animate()
        break
      }

      swap(j, k, arr)
      swap(j, k, _arr_)

      await animate()

      arr[k].fillStyle = color.blue
      _arr_[k].fillStyle = color.blue

      if (Math.floor((k - 1) / 2) === 0) {
        arr[j].fillStyle = color.blue
        _arr_[j].fillStyle = color.blue
        await animate()
      }

      k = j
    }
  }

  const shiftDown = async k => {
    while (k * 2 + 1 < arr.length) {
      let j = k * 2 + 1

      arr[k].fillStyle = color.green
      _arr_[k].fillStyle = arr[k].fillStyle
      await animate()

      arr[j].fillStyle = color.orange
      _arr_[j].fillStyle = arr[j].fillStyle
      await animate()

      if (j + 1 < arr.length && arr[j + 1].n > arr[j].n) {
        arr[j].fillStyle = color.blue
        _arr_[j].fillStyle = arr[j].fillStyle
        arr[j + 1].fillStyle = color.orange
        _arr_[j + 1].fillStyle = arr[j + 1].fillStyle
        j++
        await animate()
      }

      if (arr[k].n > arr[j].n) {
        arr[k].fillStyle = color.blue
        _arr_[k].fillStyle = arr[k].fillStyle
        arr[j].fillStyle = color.blue
        _arr_[j].fillStyle = arr[j].fillStyle
        await animate()
        break
      }

      swap(k, j, arr)
      swap(k, j, _arr_)

      await animate()

      arr[k].fillStyle = color.blue
      _arr_[k].fillStyle = arr[k].fillStyle

      if (!(j * 2 + 1 < arr.length)) {
        arr[j].fillStyle = color.blue
        _arr_[j].fillStyle = arr[j].fillStyle
        await animate()
      }

      k = j
    }
  }

  useEffect(() => {
    ;(async () => {
      restart()
      arr = [...clone(initArr)]
      _arr = [...clone(initArr)]
      _arr_ = [...clone(initArr)]
      await animate()

      if (type === 'shiftUp') {
        for (let i = 1; i < arr.length; i++) {
          await shiftUp(i)
        }
      }

      if (type === 'heapify') {
        for (let i = branchIndex; i >= 0; i--) {
          await shiftDown(i)
        }
      }
    })()
  }, [type])

  return null
}

const Heap = () => {
  const [type, setType] = useState(null)

  return (
    <>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {['shiftUp', 'heapify'].map(i => (
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
        height={(contentWidth / 4) * 3}
        dpr={dpr}
        isAnimating={true}
      >
        <HeapData type={type} />
      </Canvas>
    </>
  )
}

export default Heap
