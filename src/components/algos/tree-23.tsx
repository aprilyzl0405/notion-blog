import { useEffect, useState } from 'react'

const Tree23 = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    if (canvas && ctx) {
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById('tree-23') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <canvas id="tree-23" data-title="tree-23" className="w-full"></canvas>
    </>
  )
}

export default Tree23
