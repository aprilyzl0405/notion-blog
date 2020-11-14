import { useRef, useState } from 'react'

const _duration = 1
const _delay = 1

const useAnimate = (duration: number = _duration, delay: number = _delay) => {
  const [timerAni, setTimerAni] = useState(0)
  const magicRef = useRef(0)

  const restart = () => (magicRef.current = Math.random())

  const animate = (pmagic: number) => {
    return new Promise(next => {
      const timeStart = Date.now()
      const renderLoop = () => {
        if (magicRef.current !== pmagic) return

        const isStop = Date.now() - timeStart >= duration

        if (isStop) {
          setTimerAni(0)
          setTimeout(_ => next && next(0), delay)
        } else {
          const timeAni = requestAnimationFrame(renderLoop)
          setTimerAni(timeAni)
        }
      }

      cancelAnimationFrame(timerAni)
      renderLoop()
    })
  }

  return [{ animate, restart }]
}

export default useAnimate
