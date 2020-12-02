import {
  contentWidth,
  nodeItemHeight as defaultItemHeight,
  nodeItemWidth as defaultItemWidth,
  color,
  paddingTop,
  paddingH,
  font,
  dpr,
  paddingV,
  levelHeight as defaultLevelHeight,
} from './helper'

export const renderNode = (ctx, node) => {
  if (!node) return

  const defaultItemWidth = node.width
  const defaultItemHeight = node.height
  const x = node.width ? node.x - (node.width - defaultItemWidth) / 2 : node.x

  ctx.save()
  ctx.globalAlpha = 0.8
  ctx.beginPath()
  ctx.rect(x + 1, node.y, defaultItemWidth - 2, defaultItemHeight)
  ctx.fillStyle = node.fillStyle
  ctx.fill()
  ctx.restore()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = font
  ctx.fillStyle = color.white
  ctx.fillText(
    `${node.n}`,
    x + defaultItemWidth / 2,
    node.y + defaultItemHeight / 2
  )

  if ('balanceFactor' in node) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = color.black
    ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx) => {
      ctx.fillText(
        str,
        node.x + defaultItemWidth / 2,
        (idx - 1) * 18 + node.y - 4
      )
    })
  }
}

const updatePos = (elapsed, node) => {
  if (!node) return

  node.x = node.x + elapsed * (node.to.x - node.x)
  node.y = node.y + elapsed * (node.to.y - node.y)
}

export const TreeSetPos = ({
  canvas,
  ctx,
  arr,
  root,
  root2,
  levelHeight,
  itemWidth,
  contentHeight,
}) => {
  const nodeItemWidth = itemWidth || defaultItemWidth
  const nodeLevelHeight = levelHeight || defaultLevelHeight

  let iLeft = 0
  const updateCoordRec = translateX => {
    const updateCoord = node => {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.to.x += translateX
    }
    ;[root, root2].forEach(rootNode => {
      updateCoord(rootNode)
    })
  }

  arr.forEach((node, idx) => {
    node.to.x = idx * defaultItemWidth
  })

  console.log(JSON.stringify(arr))

  const setPos = (node, depth) => {
    if (!node) return

    setPos(node.l, depth + 1)

    node.to.x = iLeft
    iLeft += nodeItemWidth / 2
    node.to.y = depth * nodeLevelHeight + paddingTop
    setPos(node.r, depth + 1)

    contentHeight = Math.max(contentHeight, node.to.y)

    if (node.l && node.r) {
      node.to.x = (node.l.to.x + node.r.to.x) / 2
    }
  }
  ;[root, root2].forEach(rootNode => {
    if (!rootNode) return

    setPos(rootNode, 0)
    iLeft += nodeItemWidth
  })

  updateCoordRec((contentWidth - iLeft) / 2)

  if (canvas) {
    canvas.height = (contentHeight + paddingV * 3 + defaultItemHeight) * dpr
    canvas.style.height = canvas.height / dpr + 'px'
  }
}

export const Tree23SetPos = ({
  canvas,
  ctx,
  arr,
  root,
  root2,
  levelHeight,
  itemWidth,
  isRed,
}) => {
  const nodeItemWidth = itemWidth || defaultItemWidth
  const nodeLevelHeight = levelHeight || defaultLevelHeight

  let iLeft = 0
  let contentHeight = 0

  const updateCoordRec = translateX => {
    const updateCoord = node => {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.to.x += translateX
    }
    ;[root].forEach(rootNode => {
      updateCoord(rootNode)
    })
  }

  arr.forEach((node, idx) => {
    node.to.x = idx * nodeItemWidth
  })

  const setPos = (node, depth) => {
    if (!node) return

    setPos(node.l, depth + (isRed(node.l) ? 0 : 1))

    node.to.x = iLeft
    iLeft += nodeItemWidth / 2
    node.to.y = depth * nodeLevelHeight + paddingTop

    if (isRed(node)) {
      if (!node.l && !node.r) iLeft += nodeItemWidth / 2
      if (isRed(node.l) || isRed(node.r)) iLeft += nodeItemWidth / 2
    }

    setPos(node.r, depth + (isRed(node.r) ? 0 : 1))
    contentHeight = Math.max(contentHeight, node.to.y)
  }
  ;[root].forEach((rootNode, idx) => {
    if (!rootNode) return
    setPos(rootNode, 0)
    iLeft += nodeItemWidth / 2
  })

  updateCoordRec((contentWidth - iLeft) / 2)

  if (canvas) {
    canvas.height = (contentHeight + paddingV * 3 + defaultItemHeight) * dpr
    canvas.style.height = canvas.height / dpr + 'px'
  }
}

export const TreeNextFrame = (
  elapsed,
  { canvas, ctx, arr, root, root2, levelHeight, itemWidth, contentHeight }
) => {
  const nodeItemWidth = itemWidth || defaultItemWidth

  const render = () => {
    const renderArr = () => {
      arr.forEach(node => {
        renderNode(ctx, node)
      })
    }

    const renderLine = node => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      ctx.beginPath()
      node.l &&
        ctx.lineTo(
          node.l.x + nodeItemWidth / 2,
          node.l.y + defaultItemHeight / 2
        )
      ctx.lineTo(node.x + nodeItemWidth / 2, node.y + defaultItemHeight / 2)
      node.r &&
        ctx.lineTo(
          node.r.x + nodeItemWidth / 2,
          node.r.y + defaultItemHeight / 2
        )
      ctx.strokeStyle = color.black
      ctx.stroke()
    }

    const recRenderNode = node => {
      if (!node) return

      recRenderNode(node.l)
      recRenderNode(node.r)

      renderNode(ctx, node)
    }

    ctx.fillStyle = color.white
    ctx.fillRect(0, 0, contentWidth * dpr, canvas.height)

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.translate(0, paddingH)

    renderArr()
    ;[root, root2].forEach((rootNode, idx) => {
      if (!rootNode) return

      renderLine(rootNode)
      recRenderNode(rootNode)
    })

    ctx.restore()
  }

  if (!ctx) return

  arr.forEach(node => {
    updatePos(elapsed, node)
  })

  const loopUpdatePos = node => {
    if (!node) return

    loopUpdatePos(node.l)
    loopUpdatePos(node.r)

    updatePos(elapsed, node)
  }
  ;[root, root2].forEach(rootNode => {
    loopUpdatePos(rootNode)
  })

  render()
}

export const SortSetPos = ({ canvas, ctx, arr, steps }) => {
  const stair = steps.length - 1

  const contentHeight = steps.length * defaultLevelHeight + defaultItemHeight

  canvas.height = contentHeight * dpr
  canvas.style.height = canvas.height / dpr + 'px'

  steps[steps.length - 1].forEach((node, idx) => {
    if (!node) return

    let nodeFrom
    let _stair = stair

    while (!nodeFrom && --_stair > -1) {
      nodeFrom = steps[_stair][node.fromIndex]
    }

    stair === 0 && (nodeFrom = nodeFrom || node)

    node.x = node.from.x = nodeFrom.to.x
    node.y = node.from.y = nodeFrom.to.y

    node.to.x = idx * defaultItemWidth
    node.to.y = stair * defaultLevelHeight
  })
}

export const SortNextFrame = (elapsed, { canvas, ctx, arr, steps }) => {
  const renderLine = () => {
    // return
    steps.forEach((row, stair) => {
      stair > 0 &&
        row.forEach((nodeFrom, idx) => {
          if (!nodeFrom) return

          let nodeTo
          let _stair = stair

          while (!nodeTo && --_stair > -1) {
            nodeTo = steps[_stair][nodeFrom.fromIndex]
          }

          ctx.beginPath()
          ctx.lineTo(
            nodeFrom.x + defaultItemWidth / 2 + 0.5,
            nodeFrom.y + defaultItemHeight / 2
          )
          ctx.lineTo(
            nodeTo.x + defaultItemWidth / 2 + 0.5,
            nodeTo.y + defaultItemHeight / 2
          )
          ctx.strokeStyle = nodeFrom.strokeStyle
          ctx.stroke()
        })
    })
  }

  const itRenderNode = () => {
    steps.forEach(row => {
      row.forEach(ndoe => {
        renderNode(ctx, ndoe)
      })
    })
  }

  const render = () => {
    ctx.fillStyle = color.white
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.translate(0, paddingV)
    renderLine()
    itRenderNode()
    ctx.restore()
  }

  if (!ctx) return

  steps.forEach(row => {
    row.forEach(node => {
      updatePos(elapsed, node)
    })
  })

  render()
}
