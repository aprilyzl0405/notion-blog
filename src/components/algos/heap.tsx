import { useEffect, useState } from 'react'
import useAnimate from './animate'
import {
  color,
  contentWidth,
  levelHeight,
  paddingTop,
  paddingV,
  rand,
  swap,
} from './helper'

interface Node {
  n: number

  from?: Node
  to?: Node

  x?: number
  y?: number
  fillStyle?: string
}

const scale = 2
const itemWidth = 30
const itemHeight = 18
const duration = 500

const len = 20
const min = 1
const max = 20
const branchIndex = (len - 1 - 1) / 2
const level = Math.ceil(Math.log(len + 1) / Math.log(2))

const _contentWidth = Math.pow(2, level - 1) * itemWidth
const contentHeight = (level - 1) * levelHeight + itemHeight + paddingTop
const translateX = (contentWidth - _contentWidth) / 2

const Heap = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [type, setType] = useState(null)

  const [{ animate, restart }] = useAnimate()

  const [arr, setArr] = useState<Node[]>(
    Array(len)
      .fill(0)
      .map(
        () =>
          ({
            n: rand(min, max),
          } as Node)
      )
  )
  const [_arr, set_Arr] = useState([...arr])
  const [_arr_, set_Arr_] = useState([...arr])

  const generateHeap = gt => {
    setType(gt)
  }

  const setPos = () => {
    let count = 0

    const r_arr = Array(len)
      .fill(0)
      .map(
        () =>
          ({
            n: rand(min, max),
          } as Node)
      )

    const arr = [...r_arr]
    const _arr = [...r_arr]
    const _arr_ = [...r_arr]
    ;[_arr, _arr_].forEach((arr, stair) => {
      arr.forEach((node, idx) => {
        node.to.x = idx * itemWidth
        node.to.y = stair * itemHeight + 2
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

    setArr(arr)
    set_Arr(_arr)
    set_Arr_(_arr_)
  }

  const renderItemNode = node => {
    const x = node.width
      ? node.x - (node.width - (itemWidth || itemWidth)) / 2
      : node.x

    ctx.save()
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    ctx.fillStyle = node.fillStyle
    ctx.fill()
    ctx.restore()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color.white
    ctx.fillText(node.c, x + itemWidth / 2, node.y + itemHeight / 2)
  }

  const renderLine = () => {
    const isPreReady = duration === 500

    for (let i = branchIndex; i > -1; i--) {
      const node = arr[i]
      const nodeL = arr[i * 2 + 1]
      const nodeR = arr[i * 2 + 2]

      ctx.beginPath()
      if (isPreReady) {
        nodeL && ctx.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
        ctx.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        nodeR && ctx.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
      } else {
        nodeL &&
          ctx.lineTo(nodeL.to.x + itemWidth / 2, nodeL.to.y + itemHeight / 2)
        ctx.lineTo(node.to.x + itemWidth / 2, node.to.y + itemHeight / 2)
        nodeR &&
          ctx.lineTo(nodeR.to.x + itemWidth / 2, nodeR.to.y + itemHeight / 2)
      }
      ctx.strokeStyle = color.black
      ctx.stroke()
    }
  }

  const renderNode = () => {
    arr.forEach(node => {
      renderItemNode(node)
    })
  }

  const shiftDown = k => {
    while (k * 2 + 1 < arr.length) {
      let j = k * 2 + 1

      if (j + 1 < arr.length && arr[j + 1].n > arr[j].n) {
        j++
      }

      if (arr[k].n > arr[j].n) {
        break
      }

      swap(k, j, arr)

      k = j
    }
  }

  const shiftUp = k => {
    while (k > 0) {
      const j = (k - 1) / 2

      if (arr[j].n > arr[k].n) {
        break
      }

      swap(j, k, arr)

      k = j
    }
  }

  useEffect(() => {
    if (canvas && ctx) {
      ctx.fillStyle = color.white
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.scale(scale, scale)
      ctx.translate(paddingV, paddingV)
      ;[_arr, _arr_].forEach(arr => {
        arr.forEach(node => {
          renderItemNode(node)
        })
      })
      renderLine()
      renderNode()
      ctx.restore()
    }
  }, [arr, _arr, _arr_])

  useEffect(() => {
    if (canvas && ctx) {
      const magic = restart()

      setPos()

      // if (type === 'shiftUp') {
      //   for (let i = 1; i < arr.length; i++) {
      //     shiftUp(i)
      //   }
      // }

      // if (type === 'heapify') {
      //   for (let i = branchIndex; i >= 0; i--) {
      //     shiftDown(i)
      //   }
      // }
    }
  }, [canvas, ctx, type])

  useEffect(() => {
    const canvas = document.getElementById('heap') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    canvas.width = 512
    canvas.height = 512

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {['shiftUp', 'heapify'].map(i => (
            <button
              key={i}
              className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3"
              onClick={e => generateHeap(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <canvas id="heap" data-title="heap" className="w-full"></canvas>
    </>
  )
}

export default Heap
