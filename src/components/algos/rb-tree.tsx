import { useEffect, useState } from 'react'

const RBTree = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    if (canvas && ctx) {
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById('rb-tree') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <canvas id="rb-tree" data-title="rb-tree" className="w-full"></canvas>
    </>
  )
}

export default RBTree
