import { useEffect, useState } from 'react'

const AVLTree = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    if (canvas && ctx) {
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById('avl-tree') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <canvas id="avl-tree" data-title="avl-tree" className="w-full"></canvas>
    </>
  )
}

export default AVLTree
