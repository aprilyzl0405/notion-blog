export interface Node {
  n: number

  from?: {
    x: number
    y: number
  }

  to?: {
    x: number
    y: number
  }

  x?: number
  y?: number

  l?: Node
  r?: Node

  h?: number
  balanceFactor?: number

  width: number
  height: number
  fillStyle?: string
  strokeStyle?: string
}
