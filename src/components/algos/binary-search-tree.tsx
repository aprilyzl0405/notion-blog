import { useEffect, useState } from 'react'

const BinarySearchTree = () => {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    if (canvas && ctx) {
    }
  }, [canvas, ctx])

  useEffect(() => {
    const canvas = document.getElementById(
      'binary-search-tree'
    ) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    setCanvas(canvas)
    setCtx(ctx)
  })

  return (
    <>
      <canvas
        id="binary-search-tree"
        data-title="binary-search-tree"
        className="w-full"
      ></canvas>
    </>
  )
}

export default BinarySearchTree
