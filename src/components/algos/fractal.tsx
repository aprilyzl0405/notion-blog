import { useEffect, useState } from 'react'
import { color, contentWidth, d2a } from './helper'

const scale = 3

const Fractal = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const NearOne = () => {
    const depth = 12

    const fillStyle = {
      r: 0,
      g: 170,
      b: 255,
      a: 1,
    }

    fillStyle.toString = function() {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'
    }

    const render = (x, y, side, pdepth) => {
      ++pdepth
      if (pdepth > depth) return

      const odd = pdepth % 2 === 1
      const w = odd ? side / 2 : side

      fillStyle.a = (depth - pdepth + 1) / pdepth

      ctx.beginPath()
      ctx.rect(x, y, w, side)
      ctx.fillStyle = fillStyle.toString()
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = color.black
      ctx.stroke()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = w / 5 + 'px Arial'
      ctx.fillStyle = color.black
      ctx.fillText('1/' + Math.pow(2, pdepth), x + w / 2, y + side / 2)

      odd && (side /= 2)
      render(x + (odd ? side : 0), odd ? side : 0, side, pdepth)
    }

    ctx.rect(0, 0, contentWidth, contentWidth)
    ctx.strokeStyle = color.black
    ctx.stroke()

    ctx.save()
    ctx.scale(scale, scale)
    render(0, 0, contentWidth, 0)
    ctx.restore()
  }

  const Fib = (arg = { renderAux: true }) => {
    const getFibList = end => {
      const result = []
      let a = 1
      let b = 1

      for (let i = 0; i < end; i++) {
        result.push(a)

        const t = b
        b += a
        a = t
      }

      return result
    }

    const fib = getFibList(15)
    canvas.width = fib[fib.length - 1] * scale
    canvas.height = fib[fib.length - 2] * scale

    let cx = fib[fib.length - 2]
    let cy = fib[fib.length - 2]

    ctx.save()
    ctx.scale(scale, scale)
    // ctx.translate(15, 15)

    for (let len = fib.length, i = len - 1; i > 2; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = fib[i - 1]
      ctx.beginPath()
      if (arg.renderAux) {
        ctx.lineTo(cx, cy)
        ctx.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        ctx.lineTo(cx, cy)
      } else {
        ctx.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      }
      ctx.strokeStyle = color.black
      ctx.stroke()

      switch (_i) {
        case 0:
          cy += fib[i - 3]
          break
        case 1:
          cx -= fib[i - 3]
          break
        case 2:
          cy -= fib[i - 3]
          break
        case 3:
          cx += fib[i - 3]
          break
      }
    }

    ctx.restore()
  }

  const Vicsek = () => {
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const depth = 5

    const render = (x, y, side, pdepth) => {
      if (pdepth >= depth) {
        ctx.beginPath()
        ctx.rect(x, y, side, side)
        ctx.fillStyle = color.blue
        ctx.fill()
        return
      }

      side /= 3

      for (let i = 0; i < dir.length; i++) {
        const _x = x + side * dir[i][1]
        const _y = y + side * dir[i][0]
        render(_x, _y, side, pdepth + 1)
      }
    }

    ctx.save()
    ctx.scale(scale, scale)
    render(0, 0, contentWidth, 0)
    ctx.restore()
  }

  const Sierpinski = () => {
    const depth = 5

    const render = (x, y, side, pdepth) => {
      if (pdepth >= depth) return

      ++pdepth
      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            ctx.beginPath()
            ctx.rect(x + side, y + side, side, side)
            ctx.fillStyle = color.purple
            ctx.fill()
          } else {
            render(x + j * side, y + i * side, side, pdepth)
          }
        }
      }
    }

    ctx.save()
    ctx.scale(scale, scale)
    render(0, 0, contentWidth, 0)
    ctx.restore()
  }

  const SierpinskiTriangle = () => {
    const depth = 5

    const render = (x1, y1, side, pdepth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side / 2
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (pdepth > depth) {
        ctx.beginPath()
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        ctx.fillStyle = color.cyan
        ctx.fill()
        return
      }

      pdepth++
      side /= 2

      render(x1, y1, side, pdepth)
      render(x1 + side, y1, side, pdepth)
      render(x1 + side / 2, (y1 + y3) / 2, side, pdepth)
    }

    const space = (contentWidth + contentWidth * Math.sin(d2a(-60))) / 2

    ctx.save()
    ctx.scale(scale, scale)
    render(0, contentWidth - space, contentWidth, 0)
    ctx.restore()
  }

  const KoachSnowflake = () => {
    const _canvas = canvas.cloneNode()
    const _ctx = _canvas.getContext('2d')

    const depth = 4

    const render = (x1, y1, side, deg, pdepth) => {
      pdepth++
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (pdepth > depth) {
        _ctx.beginPath()
        _ctx.lineTo(x1, y1)
        _ctx.lineTo(x2, y2)
        _ctx.lineTo(x3, y3)
        _ctx.lineTo(x4, y4)
        _ctx.lineTo(x5, y5)
        _ctx.strokeStyle = color.blue
        _ctx.stroke()
      } else {
        render(x1, y1, side, deg, pdepth)
        render(x2, y2, side, deg - 60, pdepth)
        render(x3, y3, side, deg + 60, pdepth)
        render(x4, y4, side, deg, pdepth)
      }
    }

    const side = _canvas.width

    _ctx.save()
    _ctx.scale(scale, scale)
    render(contentWidth * 0.1, contentWidth / 3.72, contentWidth * 0.8, 0, 0)
    _ctx.restore()

    ctx.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height)
    Array(3)
      .fill(0)
      .map((_, idx, arr) => {
        const deg = (360 / arr.length) * idx
        ctx.save()
        ctx.translate(side / 2, side / 2)
        ctx.rotate(d2a(deg))
        ctx.drawImage(_canvas, -side / 2, -side / 2, side, side)
        ctx.restore()
      })
  }

  const FractalTree = (
    arg = {
      degL: -12,
      degR: 12,
      translateX: 0,
      translateY: 10,
      side: 0,
    }
  ) => {
    const depth = 12

    const render = (x1, y1, side, deg, pdepth) => {
      pdepth++

      if (pdepth > depth) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      ctx.beginPath()
      ctx.lineTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color.black
      ctx.stroke()

      render(x2, y2, side * 0.8, deg + (arg.degL || -15), pdepth)
      render(x2, y2, side * 0.8, deg + (arg.degR || 15), pdepth)
    }

    ctx.save()
    ctx.scale(scale, scale)
    render(
      contentWidth / 2 + (arg.translateX || 0),
      contentWidth + (arg.translateY || -40),
      arg.side || 110,
      -90,
      0
    )
    ctx.restore()
  }

  const gtf = {
    nearone: NearOne,
    fib: Fib,
    vicesk: Vicsek,
    sierpinski: Sierpinski,
    sierpinskiTriangle: SierpinskiTriangle,
    koachSnowflake: KoachSnowflake,
    fractalTree: FractalTree,
  }

  const generateFractal = gt => {
    canvas.width = canvas.height = contentWidth * scale
    gtf[gt] && gtf[gt]()
  }

  useEffect(() => {
    const canvas = document.getElementById('fr-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  return (
    <>
      <div role="alert">
        <div className="bg-blue-500 text-white font-bold px-4 py-2">
          选择分形图
        </div>
        <div className="flex justify-center flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {[
            'nearone',
            'fib',
            'vicesk',
            'sierpinski',
            'sierpinskiTriangle',
            'koachSnowflake',
            'fractalTree',
          ].map(i => (
            <div className="flex-grow p-1" key={i}>
              <button
                className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3"
                onClick={e => generateFractal(i)}
              >
                {i}
              </button>
            </div>
          ))}
        </div>
      </div>
      <canvas id="fr-canvas" data-title="fractal" className="w-full"></canvas>
    </>
  )
}

export default Fractal
