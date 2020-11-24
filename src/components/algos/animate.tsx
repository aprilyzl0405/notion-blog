import { useRef, useState } from 'react'
import { Tween } from './helper'

const _duration = 500
const _delay = 1

const useAnimate = (
  initFn = null,
  nextFrameFn = null,
  duration = _duration,
  delay = _delay
) => {
  const lastCall = useRef(0)
  const magicRef = useRef(0)

  const restart = () => (magicRef.current = Math.random())

  const animate = (pmagic: number) => {
    let timeAni
    let timeStart = lastCall.current
    return new Promise(next => {
      const renderLoop = time => {
        if (magicRef.current !== pmagic) return

        if (0 === timeStart) timeStart = time

        lastCall.current = time
        const aduration = time - timeStart
        const isStop = aduration >= duration

        const fn = Tween['Quad']['easeInOut']
        const elapsed = fn(aduration, 0, 1, duration)

        nextFrameFn && nextFrameFn(elapsed)

        if (isStop) {
          timeAni = 0
          delay ? setTimeout(_ => next && next(0), delay) : next(0)
        } else {
          timeAni = requestAnimationFrame(renderLoop)
        }
      }

      initFn && initFn()
      cancelAnimationFrame(timeAni)
      renderLoop(lastCall.current)
    })
  }

  return [restart, animate] as [() => number, (number) => Promise<number>]
}

export default useAnimate
