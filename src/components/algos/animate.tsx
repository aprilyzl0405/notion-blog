import { useRef } from 'react'
import { Tween } from './helper'

const _duration = 500
const _delay = 1

export type InitFn = (payload: object | null) => void | null
export type NextFrameFn = (
  elapsed: number,
  payload: object | null
) => void | null

export type useAnimateResult = [
  () => number,
  (
    payload?: object | null,
    duration?: number,
    delay?: number
  ) => Promise<number>
]
export interface useAnimateOptions {
  duration?: number
  delay?: number
}

const useAnimate: (
  initFn: InitFn,
  nextFrameFn: NextFrameFn,
  options?: useAnimateOptions
) => useAnimateResult = (initFn = null, nextFrameFn = null, options = null) => {
  const lastCall = useRef(0)
  const magicRef = useRef(0)

  const gduration = (options && options.duration) || _duration
  const gdelay = (options && options.delay) || _delay

  const restart: useAnimateResult[0] = () => (magicRef.current = Math.random())

  const animate: useAnimateResult[1] = (
    payload,
    duration = gduration,
    delay = gdelay
  ) => {
    const magic = magicRef.current

    let timeAni
    let timeStart = lastCall.current
    return new Promise(next => {
      const renderLoop = time => {
        if (magicRef.current !== magic) return

        if (0 === timeStart) timeStart = time

        lastCall.current = time
        const aduration = time - timeStart
        const isStop = aduration >= duration

        const fn = Tween['Quad']['easeInOut']
        const elapsed = fn(aduration, 0, 1, duration)

        nextFrameFn && nextFrameFn(elapsed, payload)

        if (isStop) {
          timeAni = 0
          delay ? setTimeout(_ => next && next(0), delay) : next(0)
        } else {
          timeAni = requestAnimationFrame(renderLoop)
        }
      }

      initFn && initFn(payload)
      cancelAnimationFrame(timeAni)
      renderLoop(lastCall.current)
    })
  }

  return [restart, animate]
}

export default useAnimate
