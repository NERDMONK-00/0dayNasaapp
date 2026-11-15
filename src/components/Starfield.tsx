import { useEffect, useRef } from 'react'

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let animationId = 0
    let width = 0
    let height = 0

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.7 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      drift: Math.random() * 0.3 + 0.1,
    }))

    const render = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight

      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        const x = (star.x * width + (performance.now() * 0.02 * star.drift) % width) % width
        const y = (star.y * height + (performance.now() * 0.01 * star.drift) % height) % height
        context.beginPath()
        context.fillStyle = `rgba(255,255,255,${star.alpha})`
        context.arc(x, y, star.r, 0, Math.PI * 2)
        context.fill()
      }

      animationId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  )
}
