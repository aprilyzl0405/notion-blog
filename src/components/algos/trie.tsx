import { useEffect, useRef, useState } from 'react'
import { color } from './helper'

type char = string

interface Node {
  c: char

  isWord: boolean
  map: {
    [key: string]: Node
  }

  x?: number
  y?: number
  fillStyle?: string
}

const scale = 2
const itemWidth = 30
const itemHeight = 18
const row = 3
const paddingTop = row * 18 + 10
const levelHeight = 36
const str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda new news`
const arr = str.toLowerCase().match(/\w+/g)
const strArr = str.split(/\s+/g)
const lenStep = Math.ceil(strArr.length / row)
const steps = []

const root: Node = {
  c: 'root',

  isWord: false,
  fillStyle: color.black,
  map: {},
}

for (let i = 0; i < strArr.length; i += lenStep) {
  steps.push(strArr.slice(i, i + lenStep).join(' '))
}

for (let word of arr) {
  let node = root

  for (let i = 0; i < word.length; i++) {
    const c = word[i]
    node.map[c] = node.map[c] || { c, isWord: i === word.length - 1, map: {} }
    node = node.map[c]
    node.fillStyle = color[node.isWord ? 'blue' : 'black']
  }
}

const Trie = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const contentWidth = useRef(512)
  const contentHeight = useRef(512)

  const setPos = () => {
    let iLeft = 0

    const setPos = (node, depth) => {
      const keys = Object.keys(node.map) || []

      keys.forEach(k => {
        setPos(node.map[k], depth + 1)
      })

      node.x = iLeft
      node.y = depth * levelHeight + paddingTop
      contentHeight.current = Math.max(contentHeight.current, node.y)

      if (keys.length === 0) {
        iLeft += itemWidth
      } else {
        node.x = (node.map[keys[0]].x + node.map[keys[keys.length - 1]].x) / 2
      }
    }

    setPos(root, 0)

    contentWidth.current = iLeft
    contentHeight.current += itemHeight
    canvas.height = (contentHeight.current + 15 * 2) * scale
  }

  const renderText = () => {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = color.black

    steps.forEach((str, idx) => {
      ctx.fillText(str, contentWidth.current / 2, idx * 18)
    })
  }

  const renderLine = node => {
    const keys = Object.keys(node.map)

    keys.forEach(k => {
      const _node = node.map[k]

      ctx.beginPath()
      ctx.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      ctx.lineTo(_node.x + itemWidth / 2, _node.y + itemHeight / 2)
      ctx.strokeStyle = color.black
      ctx.stroke()

      renderLine(_node)
    })
  }

  const renderNode = node => {
    const keys = Object.keys(node.map)

    keys.forEach(k => {
      renderNode(node.map[k])
    })

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

    renderItemNode(node)
  }

  useEffect(() => {
    if (canvas && ctx) {
      setPos()

      canvas.width = contentWidth.current * scale
      canvas.height = contentHeight.current * scale

      ctx.fillStyle = color.white
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.scale(scale, scale)
      ctx.translate(0, 15)

      renderText()
      renderLine(root)
      renderNode(root)
      ctx.restore()
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById('trie') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  return (
    <>
      <canvas id="trie" data-title="trie" className="w-full"></canvas>
    </>
  )
}

export default Trie
