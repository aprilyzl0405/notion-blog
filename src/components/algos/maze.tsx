import { useEffect, useRef, useState } from 'react'
import useAnimate from './animate'
import { contentWidth, color } from './helper'

interface Node {
  s: string // symbol

  inMist?: boolean
  isPath?: boolean
  visited?: boolean
}

interface Point {
  x: number
  y: number
  from?: Point
}

type Row<T> = Array<T>
type Col<T> = Array<T>
type MazeData = Row<Col<Node>>

const row = 41
const col = 41
const itemWidth = contentWidth / row
const road = ' '
const wall = '#'
const dir = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]
const enter = {
  x: 0,
  y: 1,
}
const exit = {
  x: col - 1,
  y: row - 2,
}

const inArea = (x, y, arr: MazeData) => {
  return y >= 0 && y < arr.length && x >= 0 && x < arr[0].length
}

const initMaze: () => MazeData = () => {
  return Array(row)
    .fill(0)
    .map((_, idxRow) => {
      return Array(col)
        .fill(0)
        .map((_, idxCol) => {
          return {
            s: idxCol % 2 === 1 && idxRow % 2 === 1 ? road : wall,

            isPath: false,
            inMist: false,
            visited: false,
          } as Node
        })
    })
}

const initRandMaze = () => {
  const mazeData = initMaze()

  const queue = [[1, 1]]

  while (queue.length) {
    const [x, y] = queue[Math.random() < 0.5 ? 'pop' : 'shift']()

    for (let i = 0; i < 4; i++) {
      const newX = x + dir[i][1] * 2
      const newY = y + dir[i][0] * 2

      if (inArea(newX, newY, mazeData) && !mazeData[newY][newX].visited) {
        mazeData[newY][newX].visited = true
        mazeData[y + dir[i][0]][x + dir[i][1]].s = road
        queue[Math.random() < 0.5 ? 'push' : 'unshift']([newX, newY])
      }
    }
  }

  mazeData.forEach(row => row.forEach(node => (node.visited = false)))

  return mazeData
}

const Maze = () => {
  const [ctx, setCtx] = useState(null)

  const [isRenderVisited, setIsRenderVisited] = useState(false)
  const [mazeData, setMazeData] = useState<MazeData>([])
  const [restart, animate] = useAnimate(null, null, 1)
  const [generateType, setGenerateType] = useState('')
  const [findType, setFindType] = useState('')

  const generateMaze = async gt => {
    setFindType(null)
    setGenerateType(gt)
  }

  const findPath = ft => {
    setGenerateType(null)
    setFindType(ft)
  }

  useEffect(() => {
    ;(async () => {
      if (!generateType) return

      const mazeData = initMaze()

      mazeData[enter.y][enter.x].s = road
      mazeData[exit.y][exit.x].s = road

      setIsRenderVisited(false)

      const magic = restart()

      if (generateType === 'dfs') {
        const dfsRecursive = async (x: number, y: number) => {
          mazeData[y][x].visited = true

          await animate(magic)

          for (let i = 0; i < 4; i++) {
            const newX = x + dir[i][1] * 2
            const newY = y + dir[i][0] * 2

            if (inArea(newX, newY, mazeData) && !mazeData[newY][newX].visited) {
              mazeData[y + dir[i][0]][x + dir[i][1]].s = road
              setMazeData([...mazeData])
              await dfsRecursive(newX, newY)
            }
          }
        }

        setMazeData(mazeData)
        await dfsRecursive(1, 1)
      }

      if (generateType === 'bfs') {
        const bfs = async () => {
          const queue = [[1, 1]]

          while (queue.length) {
            const [x, y] = queue.shift()

            await animate(magic)

            for (let i = 0; i < 4; i++) {
              const newX = x + dir[i][1] * 2
              const newY = y + dir[i][0] * 2

              if (
                inArea(newX, newY, mazeData) &&
                !mazeData[newY][newX].visited
              ) {
                mazeData[newY][newX].visited = true
                mazeData[y + dir[i][0]][x + dir[i][1]].s = road
                setMazeData([...mazeData])
                queue.push([newX, newY])
              }
            }
          }
        }

        setMazeData(mazeData)
        await bfs()
      }

      if (generateType === 'rand') {
        const bfsRand = async () => {
          const queue = [[1, 1]]

          while (queue.length) {
            const [x, y] = queue[Math.random() < 0.5 ? 'pop' : 'shift']()

            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const _x = x + j
                const _y = y + i
                if (inArea(_x, _y, mazeData)) {
                  mazeData[_y][_x].inMist = false
                }
              }
            }

            await animate(magic)

            for (let i = 0; i < 4; i++) {
              const newX = x + dir[i][1] * 2
              const newY = y + dir[i][0] * 2

              if (
                inArea(newX, newY, mazeData) &&
                !mazeData[newY][newX].visited
              ) {
                mazeData[newY][newX].visited = true
                mazeData[y + dir[i][0]][x + dir[i][1]].s = road
                setMazeData([...mazeData])
                queue[Math.random() < 0.5 ? 'push' : 'unshift']([newX, newY])
              }
            }
          }
        }

        mazeData.forEach(row => row.forEach(node => (node.inMist = true)))
        setMazeData(mazeData)
        await bfsRand()
      }
    })()
  }, [generateType])

  useEffect(() => {
    ;(async () => {
      if (!findType) return

      const mazeData = initRandMaze()

      mazeData[enter.y][enter.x].s = road
      mazeData[exit.y][exit.x].s = road

      setIsRenderVisited(true)

      const magic = restart()

      if (findType === 'dfsRec') {
        const dfsRecursive = async (x: number, y: number) => {
          mazeData[y][x].isPath = true
          mazeData[y][x].visited = true

          await animate(magic)

          if (x === exit.x && y === exit.y) {
            setMazeData(mazeData)
            return true
          }

          for (let i = 0; i < 4; i++) {
            const newX = x + dir[i][1]
            const newY = y + dir[i][0]

            if (
              inArea(newX, newY, mazeData) &&
              !mazeData[newY][newX].visited &&
              mazeData[newY][newX].s === road
            ) {
              const find = await dfsRecursive(newX, newY)

              if (find) return true
            }
          }

          mazeData[y][x].isPath = false
          setMazeData([...mazeData])
          return false
        }

        setMazeData(mazeData)
        await dfsRecursive(enter.x, enter.y)
      }

      const findPath = (p: Point) => {
        mazeData.forEach(row => {
          row.forEach(node => {
            node.isPath = false
          })
        })

        while (p) {
          mazeData[p.y][p.x].isPath = true
          p = p.from
        }

        setMazeData([...mazeData])
      }

      if (findType === 'dfs') {
        const dfs = async () => {
          const stack: Point[] = [{ ...enter }]
          let p

          while (stack.length > 0) {
            p = stack.pop()

            mazeData[p.y][p.x].visited = true

            findPath(p)

            await animate(magic)

            if (p.y === exit.y && p.x === exit.x) break

            for (let i = 0; i < 4; i++) {
              const newX = p.x + dir[i][1]
              const newY = p.y + dir[i][0]

              if (
                inArea(newX, newY, mazeData) &&
                !mazeData[newY][newX].visited &&
                mazeData[newY][newX].s === road
              ) {
                stack.push({
                  x: newX,
                  y: newY,
                  from: p,
                })
              }
            }
          }

          findPath(p)
        }

        setMazeData([...mazeData])
        await dfs()
      }

      if (findType === 'bfs') {
        const bfs = async () => {
          const queue: Point[] = [{ ...enter }]
          let p

          while (queue.length > 0) {
            p = queue.shift()

            mazeData[p.y][p.x].visited = true

            findPath(p)

            await animate(magic)

            if (p.y === exit.y && p.x === exit.x) break

            for (let i = 0; i < 4; i++) {
              const newX = p.x + dir[i][1]
              const newY = p.y + dir[i][0]

              if (
                inArea(newX, newY, mazeData) &&
                !mazeData[newY][newX].visited &&
                mazeData[newY][newX].s === road
              ) {
                queue.push({
                  x: newX,
                  y: newY,
                  from: p,
                })
              }
            }
          }

          findPath(p)
        }

        setMazeData([...mazeData])
        await bfs()
      }
    })()
  }, [findType])

  useEffect(() => {
    ;(async () => {
      const canvas = document.getElementById('mz-canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')

      setCtx(ctx)

      canvas.width = canvas.height = contentWidth

      setMazeData(initRandMaze())
    })()
  }, [])

  useEffect(() => {
    if (ctx) {
      ctx.fillStyle = color.green
      ctx.fillRect(0, 0, contentWidth, contentWidth)

      mazeData.forEach((row, idxRow) => {
        row.forEach((node, idxCol) => {
          if (!node.inMist && node.s === wall) return
          ctx.beginPath()
          ctx.rect(idxCol * itemWidth, idxRow * itemWidth, itemWidth, itemWidth)
          ctx.fillStyle =
            color[
              node.inMist
                ? 'white'
                : node.s === wall
                ? 'green'
                : node.isPath
                ? 'red'
                : node.visited && isRenderVisited
                ? 'yellow'
                : 'white'
            ]
          ctx.fill()
        })
      })
    }
  }, [mazeData, isRenderVisited])

  return (
    <div>
      <div className="flex mb-10">
        <div className="w-1/2 h-12">
          <div role="alert">
            <div className="bg-blue-500 text-white font-bold px-4 py-2">
              创建迷宫
            </div>
            <div className="flex border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
              {['dfs', 'bfs', 'rand'].map(i => (
                <button
                  key={i}
                  className="flex-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3"
                  onClick={e => generateMaze(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/2 h-12">
          <div role="alert">
            <div className="bg-red-500 text-white font-bold px-4 py-2 text-right">
              迷宫寻路
            </div>
            <div className="flex border-t-0 border-red-400 bg-red-100 px-4 py-3 text-red-700 text-end">
              {['dfsRec', 'dfs', 'bfs'].map(i => (
                <button
                  key={i}
                  className="flex-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3"
                  onClick={e => findPath(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <canvas id="mz-canvas" data-title="maze" className="w-full"></canvas>
    </div>
  )
}

export default Maze
