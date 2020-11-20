import { useEffect, useState } from 'react'

const SegmentTree = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    if (canvas && ctx) {
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById('segment-tree') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <canvas
        id="segment-tree"
        data-title="segment-tree"
        className="w-full"
      ></canvas>
    </>
  )
}

export default SegmentTree
