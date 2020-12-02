import { useEffect, useState } from 'react'
import {
  clone,
  contentWidth,
  nodeItemHeight as itemHeight,
  nodeItemWidth as itemWidth,
  dpr,
  len,
  max,
  min,
  rand,
  color,
  swap,
} from './helper'
import Canvas, { useCanvas } from './canvas'
import useAnimate from './animate'
import { Node } from './type'
import { SortSetPos as setPos, SortNextFrame as nextFrame } from './node-render'

const contentHeight = contentWidth / 2

const sortTypeArr = [
  'SelectionSort',
  'InsertionSort',
  'BubbleSort',
  'BubbleSortOptimize',
  'MergeSort',
  'QuickSort1',
  'QuickSort2',
  'QuickSort3',
]

const initArr = Array(len)
  .fill(0)
  .map(
    () =>
      ({
        n: rand(min, max),
        x: 0,
        y: 0,

        from: {
          x: 0,
          y: 0,
        },

        to: {
          x: 0,
          y: 0,
        },

        r: null,
        l: null,

        width: itemWidth,
        height: itemHeight,
        fillStyle: color.black,
        strokeStyle: color.black,
      } as Node)
  )

const SortStrategy = ({ order, type }) => {
  let arr = [...clone(initArr)]
  let steps = [clone(arr)]

  const [canvas, ctx] = useCanvas()

  const [restart, _animate] = useAnimate(setPos, nextFrame)

  const getPayload = () => ({ canvas, ctx, arr, steps })

  const animate = async (duration?: number, delay?: number) => {
    await _animate({ ...getPayload() }, duration, delay)
  }

  const pushStep = async arr => {
    steps.push(arr)
    await animate()
  }

  const SelectionSort = async () => {
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i

      for (let j = i + 1; j < arr.length; j++) {
        arr[j].fromIndex = j
        arr[j].fillStyle = color.green

        if (arr[j].n < arr[minIndex].n) {
          minIndex = j
        }
      }

      arr[i].fromIndex = i
      arr[i].fillStyle = color.orange
      arr[minIndex].fromIndex = minIndex
      arr[minIndex].fillStyle = color.blue
      swap(minIndex, i, arr)

      await pushStep(
        Array(i)
          .fill(null)
          .concat(clone(arr.slice(i, arr.length)))
      )
    }

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const InsertionSort = async () => {
    for (let i = 1; i < arr.length; i++) {
      let j = i

      arr[i].fromIndex = i
      arr[i].fillStyle = color.blue

      for (; j > 0; j--) {
        arr[j - 1].fromIndex = j - 1
        arr[j - 1].fillStyle = color.green

        if (arr[j].n < arr[j - 1].n) {
          swap(j, j - 1, arr)
        } else {
          break
        }
      }

      await pushStep(
        Array(j)
          .fill(null)
          .concat(clone(arr.slice(j, i + 1)))
      )
    }

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const BubbleSort = async () => {
    let n = arr.length
    let newN = 0

    do {
      newN = 0

      for (let i = 0; i < n; i++) {
        arr[i].fromIndex = i
      }

      for (let i = 1; i < n; i++) {
        arr[i - 1].fillStyle = color.green

        if (arr[i].n < arr[i - 1].n) {
          arr[i].fillStyle = color.orange
          swap(i, i - 1, arr)
          newN = i
        }
      }

      arr[n - 1].fillStyle = color.blue

      await pushStep(clone(arr.slice(0, n)))

      n = newN
    } while (newN > 0)

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const BubbleSortOptimize = async () => {
    let n = arr.length
    let newN = 0

    do {
      newN = 0

      for (let i = 0; i < n; i++) {
        arr[i].fromIndex = i
      }

      for (let i = 1; i < n; i++) {
        arr[i - 1].fillStyle = color.green

        if (arr[i].n < arr[i - 1].n) {
          arr[i].fillStyle = color.orange
          swap(i, i - 1, arr)
          newN = i
        }
      }

      arr[n - 1].fillStyle = color.blue

      await pushStep(clone(arr.slice(0, n)))

      n = newN
    } while (newN > 0)

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const MergeSort = async () => {
    const mergeSort = async (l, r) => {
      if (l >= r) return

      const mid = l + Math.floor((r - l) / 2)
      await mergeSort(l, mid)
      await mergeSort(mid + 1, r)

      let aux = Array(r - l + 1).fill(null)

      for (let i = l; i <= r; i++) {
        aux[i - l] = arr[i]
        aux[i - l].fromIndex = i
      }

      let i = l
      let j = mid + 1

      for (let k = l; k <= r; k++) {
        if (i > mid) {
          arr[k] = aux[j++ - l]
        } else if (j > r) {
          arr[k] = aux[i++ - l]
        } else if (aux[i - l].n <= aux[j - l].n) {
          arr[k] = aux[i++ - l]
        } else {
          arr[k] = aux[j++ - l]
        }
      }

      const fillStyle =
        color[l === 0 && r === arr.length - 1 ? 'blue' : 'green']

      await pushStep(
        Array(l)
          .fill(null)
          .concat(
            clone(arr.slice(l, r + 1)).map(node => {
              node.fillStyle = fillStyle
              return node
            })
          )
      )
    }

    await mergeSort(0, arr.length - 1)
  }

  const QuickSort1 = async () => {
    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        arr[i].fromIndex = i
      }

      swap(l, rand(l + 1, r), arr)

      const v = arr[l].n
      let j = l

      for (let i = l; i <= r; i++) {
        if (arr[i].n < v) {
          arr[i].fillStyle = color.green
          swap(i, j + 1, arr)
          j++
        } else {
          arr[i].fillStyle = color.orange
        }
      }

      arr[l].fillStyle = color.blue
      swap(l, j, arr)
      await pushStep(
        Array(l)
          .fill(null)
          .concat(clone(arr.slice(l, r + 1)))
      )
      await quickSort(l, j - 1)
      await quickSort(j + 1, r)
    }

    await quickSort(0, arr.length - 1)

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const QuickSort2 = async () => {
    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        arr[i].fromIndex = i
      }

      swap(l, rand(l + 1, r), arr)

      const v = arr[l].n
      let i = l + 1
      let j = r

      while (true) {
        while (i <= r && arr[i].n < v) {
          arr[i].fillStyle = color.green
          i++
        }
        while (j > l && arr[j].n > v) {
          arr[j].fillStyle = color.orange
          j--
        }
        if (i > j) break
        swap(i, j, arr)
        arr[i].fillStyle = color.green
        arr[j].fillStyle = color.orange
        i++
        j--
      }

      arr[l].fillStyle = color.blue
      swap(l, j, arr)
      await pushStep(
        Array(l)
          .fill(null)
          .concat(clone(arr.slice(l, r + 1)))
      )
      await quickSort(l, j - 1)
      await quickSort(j + 1, r)
    }

    await quickSort(0, arr.length - 1)

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  const QuickSort3 = async () => {
    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        arr[i].fromIndex = i
      }

      swap(l, rand(l + 1, r), arr)

      const v = arr[l].n
      let lt = l
      let gt = r + 1
      let i = l + 1

      while (i < gt) {
        if (arr[i].n < v) {
          arr[i].fillStyle = color.green
          swap(i, lt + 1, arr)
          lt++
          i++
        } else if (arr[i].n > v) {
          arr[i].fillStyle = color.orange
          swap(i, gt - 1, arr)
          gt--
        } else {
          arr[i].fillStyle = color.purple
          i++
        }
      }

      arr[l].fillStyle = color.blue
      swap(l, lt, arr)
      await pushStep(
        Array(l)
          .fill(null)
          .concat(clone(arr.slice(l, r + 1)))
      )
      await quickSort(l, lt - 1)
      await quickSort(gt, r)
    }

    await quickSort(0, arr.length - 1)

    await pushStep(
      clone(arr).map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = color.blue
        return node
      })
    )
  }

  useEffect(() => {
    ;(async () => {
      if (!order || !type) return

      restart()

      if (order === 'random') {
        arr = [...clone([...initArr])]
      }

      if (order === 'positive') {
        arr = [...clone([...initArr].sort((a, b) => a.n - b.n))]
      }

      if (order === 'reverse') {
        arr = [...clone([...initArr].sort((a, b) => b.n - a.n))]
      }

      steps = [clone(arr)]
      await animate()

      await eval(type)()
    })()
  }, [order, type])

  return null
}

const Sort = () => {
  const [order, setOrder] = useState('')
  const [type, setType] = useState('')

  return (
    <>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
          {['random', 'positive', 'reverse'].map(i => (
            <button
              key={i}
              className={`text-xs ${
                order === i ? 'hover:bg-blue-400' : 'hover:bg-gray-400'
              } ${
                order === i ? 'bg-blue-300' : 'bg-gray-300'
              } text-gray-800 font-bold py-1 px-3`}
              onClick={_ => setOrder(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div role="alert">
        <div className="flex justify-between flex-wrap border-t-0 border-orange-400 bg-orange-100 px-4 py-3 text-orange-700">
          {sortTypeArr.map(i => (
            <div className="flex-grow p-1" key={i}>
              <button
                className={`text-xs ${
                  type === i ? 'hover:bg-orange-400' : 'hover:bg-gray-400'
                } ${
                  type === i ? 'bg-orange-300' : 'bg-gray-300'
                } text-gray-800 font-bold py-1 px-3`}
                onClick={_ => setType(i)}
              >
                {i}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Canvas
        width={contentWidth}
        height={contentHeight}
        dpr={dpr}
        isAnimating={true}
      >
        <SortStrategy type={type} order={order} />
      </Canvas>
    </>
  )
}

export default Sort
