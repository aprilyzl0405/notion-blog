import { useEffect, useState } from 'react'

interface Node {
  n: number
  x: number
  y: number

  isMine: boolean
  isFlag: boolean
  isOpen: boolean
}

enum GameStatus {
  Lost,
  Win,
  Playing,
}

type Row<T> = Array<T>
type Col<T> = Array<T>
type MineArea = Row<Col<Node>>

const scale = 2
const row = 20
const col = 20
const side = 512 / col
const total = row * col
const MineRate = 0.1

const contentWidth = col * side
const contentHeight = row * side

const colors = Array(8)
  .fill(0)
  .map((_, idx, arr) => {
    const h = (idx / arr.length) * 360
    return 'hsla(' + h + ', 60%, 30%, 1)'
  })
const font = '14px Arial'

const exportImg = async canvas => {
  const img = new Image()

  await new Promise(next => {
    canvas.toBlob(blob => {
      img.onload = next
      img.src = URL.createObjectURL(blob)
    })
  })

  return img
}

const inArea = (x, y, arr: MineArea) => {
  return y >= 0 && y < arr.length && x >= 0 && x < arr[0].length
}

const MineSweeper = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [opening, setOpening] = useState(false)
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing)
  const [msg, setMsg] = useState('Playing...')

  const [imgBg, setImgBg] = useState(null)
  const [imgFlag, setImgFlag] = useState(null)
  const [imgMine, setImgMine] = useState(null)

  const [arr, setArr] = useState<MineArea>(
    Array(row)
      .fill(0)
      .map((_, y) => {
        return Array(col)
          .fill(0)
          .map((_, x) => {
            const node: Node = {
              n: 0,
              x,
              y,

              isMine: y * col + x < total * MineRate,
              isFlag: false,
              isOpen: false,
            }

            return node
          })
      })
  )

  const open = (x: number, y: number) => {
    const node = arr[y][x]
    const queue = [{ y, x }]

    if (node.isMine) {
      arr.forEach(row => {
        row.forEach(node => {
          node.isOpen = true
        })
      })

      setArr([...arr])
      setStatus(GameStatus.Lost)

      setTimeout(_ => setMsg('😈😈 You lose 😈😈'), 10)
      return
    }

    node.isOpen = true

    if (node.n === 0) {
      while (queue.length > 0) {
        const { y, x } = queue.shift()

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newX = x + j
            const newY = y + i

            if (!inArea(newX, newY, arr)) continue

            const _node = arr[newY][newX]

            if (!_node.isOpen && !_node.isMine) {
              _node.n === 0 && queue.push({ x: newX, y: newY })
              _node.isOpen = true
            }
          }
        }
      }
    }

    setArr([...arr])

    let isStop = true

    arr.forEach(row => {
      row.forEach(node => {
        if (!node.isMine && !node.isOpen) {
          isStop = false
        }
      })
    })

    if (isStop) {
      setStatus(GameStatus.Win)
      setTimeout(_ => setMsg('🤩🤩 You Win 🤩🤩'), 10)
    }
  }

  useEffect(() => {
    ;(async () => {
      const canvas = document.getElementById('ms-canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')

      setCanvas(canvas)
      setCtx(ctx)

      // preset instance image
      const _canvas = canvas.cloneNode() as HTMLCanvasElement
      const _ctx = _canvas.getContext('2d')

      _canvas.width = _canvas.height = side

      // 绘制背景
      {
        _ctx.beginPath()
        _ctx.rect(0, 0, side, side)
        _ctx.fillStyle = '#ddd'
        _ctx.fill()

        _ctx.beginPath()
        _ctx.rect(0, 0, side, 2)
        _ctx.fillStyle = 'rgba(255,255,255,.7)'
        _ctx.fill()

        _ctx.beginPath()
        _ctx.rect(0, 0, 2, side)
        _ctx.fillStyle = 'rgba(255,255,255,.7)'
        _ctx.fill()

        _ctx.beginPath()
        _ctx.rect(side - 2, 0, 2, side)
        _ctx.fillStyle = 'rgba(0,0,0,.2)'
        _ctx.fill()

        _ctx.beginPath()
        _ctx.rect(0, side - 2, side, 2)
        _ctx.fillStyle = 'rgba(0,0,0,.2)'
        _ctx.fill()
      }

      const imgBg = await exportImg(_canvas)
      setImgBg(imgBg)

      // 绘制旗帜
      {
        const x = side / 2 + 4
        const y = side / 2 - 12

        _ctx.beginPath()
        _ctx.rect(x, y, 2, 24)
        _ctx.fillStyle = '#456'
        _ctx.fill()

        _ctx.beginPath()
        _ctx.lineTo(x, y)
        _ctx.lineTo(x - 14, y + 6)
        _ctx.lineTo(x, y + 12)
        _ctx.closePath()
        _ctx.fillStyle = '#c00'
        _ctx.fill()
      }

      const imgFlag = await exportImg(_canvas)
      setImgFlag(imgFlag)

      // 绘制炸弹
      {
        _ctx.drawImage(imgBg, 0, 0, side, side)

        const cx = side / 2
        const cy = side / 2

        _ctx.beginPath()
        _ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
        _ctx.fillStyle = '#c00'
        _ctx.fill()
      }

      const imgMine = await exportImg(_canvas)
      setImgMine(imgMine)

      // set canvas size
      canvas.width = contentWidth * scale
      canvas.style.width = contentWidth + 'px'
      canvas.height = contentHeight * scale

      // init event

      canvas.onclick = canvas.ondblclick = canvas.oncontextmenu = async e => {
        e.preventDefault()

        if (opening || status === GameStatus.Win) return
        setOpening(true)

        const _scale = (canvas.offsetWidth / canvas.width) * scale
        const x = Math.floor(e.offsetX / _scale / side)
        const y = Math.floor(e.offsetY / _scale / side)
        console.log(x, y)

        const node = arr[y][x]

        switch (e.type) {
          case 'click':
            if (node.isOpen || node.isFlag) break
            open(x, y)
            break
          case 'contextmenu':
            if (node.isOpen) break
            node.isFlag = !node.isFlag
            setArr([...arr])
            break
        }

        setOpening(false)
      }

      // init mine
      for (let i = total - 1; i > -1; i--) {
        const x1 = i % col
        const y1 = Math.floor(i / col)

        const n = Math.floor(Math.random() * (i + 1))
        const x2 = n % col
        const y2 = Math.floor(n / col)

        const t = arr[y1][x1]
        arr[y1][x1] = arr[y2][x2]
        arr[y2][x2] = t
      }

      for (let y = 0; y < arr.length; y++) {
        const row = arr[y]
        for (let x = 0; x < row.length; x++) {
          const node = arr[y][x]

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newY = y + i
              const newX = x + j

              if (inArea(newX, newY, arr)) {
                node.n += arr[newY][newX].isMine ? 1 : 0
              }
            }
          }
        }
      }

      setArr([...arr])
    })()
  }, [])

  useEffect(() => {
    if (canvas && ctx && imgMine && imgFlag) {
      ctx.fillStyle = '#b3b6b9'
      ctx.fillRect(0, 0, contentWidth * scale, contentHeight * scale)

      ctx.save()

      ctx.scale(scale, scale)

      console.log(arr)
      arr.forEach((row, idxRow) => {
        row.forEach((node, idxCol) => {
          const x = side * idxCol
          const y = side * idxRow

          if (node.isOpen) {
            if (node.isMine) {
              ctx.drawImage(imgMine, x, y, side, side)
            } else {
              ctx.beginPath()
              ctx.rect(x, y, side, side)
              ctx.strokeStyle = 'rgba(0,0,0,.2)'
              ctx.stroke()

              if (node.n > 0) {
                ctx.font = font
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillStyle = colors[node.n]
                ctx.font = '16px Arial'
                ctx.fillText(node.n, x + side / 2, y + side / 2)
              }
            }
          } else {
            let img

            if (node.isFlag) {
              img = imgFlag
            } else {
              img = imgBg
            }

            ctx.drawImage(img, x, y, side, side)
          }
        })
      })

      ctx.restore()
    }
  }, [canvas, ctx, imgMine, imgFlag, arr])

  return (
    <>
      <div
        className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
        role="alert"
      >
        <p className="text-center font-bold">{msg}</p>
      </div>
      <canvas id="ms-canvas" data-title="mine sweeper"></canvas>
    </>
  )
}

export default MineSweeper
