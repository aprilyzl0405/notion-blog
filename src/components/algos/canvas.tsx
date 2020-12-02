import { createContext, useContext, useEffect, useRef, useState } from 'react'

const CanvasContext = createContext(null)

const Canvas = ({ height, width, dpr, isAnimating, children }) => {
  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef(null)
  const actualWidth = width * dpr
  const actualHeight = height * dpr

  // the canvas' context is stored once it's created
  const [context, setContext] = useState({
    canvas: null,
    ctx: null,
  })

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvasContext = canvasRef.current.getContext('2d')
      if (canvasContext !== null) {
        canvasContext.scale(dpr, dpr)
        setContext({
          canvas: canvasRef.current,
          ctx: canvasContext,
        })
      }
    }
  }, [dpr])

  return (
    <CanvasContext.Provider value={context}>
      <canvas
        ref={canvasRef}
        height={actualHeight}
        width={actualWidth}
        style={{ width, height }}
        className="w-full"
      />
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas: () => [
  HTMLCanvasElement,
  CanvasRenderingContext2D
] = () => {
  const context = useContext(CanvasContext)
  return [context.canvas, context.ctx]
}

export default Canvas
