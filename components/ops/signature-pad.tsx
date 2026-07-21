"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SignaturePadProps = {
  onChange: (dataUrl: string | null) => void
  className?: string
}

export function SignaturePad({ onChange, className }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const ratio = window.devicePixelRatio || 1
      const width = parent.clientWidth
      const height = 160
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.lineWidth = 2.5
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = "#111111"
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  function pointFromEvent(
    event: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function emit(hasMarks: boolean) {
    const canvas = canvasRef.current
    if (!canvas || !hasMarks) {
      onChange(null)
      return
    }
    onChange(canvas.toDataURL("image/png"))
  }

  function clear() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const ratio = window.devicePixelRatio || 1
    const width = canvas.width / ratio
    const height = canvas.height / ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111111"
    setHasInk(false)
    onChange(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <canvas
          ref={canvasRef}
          className="touch-none block w-full cursor-crosshair"
          onPointerDown={(event) => {
            const point = pointFromEvent(event)
            const canvas = canvasRef.current
            const ctx = canvas?.getContext("2d")
            if (!point || !ctx || !canvas) return
            drawingRef.current = true
            canvas.setPointerCapture(event.pointerId)
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
          }}
          onPointerMove={(event) => {
            if (!drawingRef.current) return
            const point = pointFromEvent(event)
            const ctx = canvasRef.current?.getContext("2d")
            if (!point || !ctx) return
            ctx.lineTo(point.x, point.y)
            ctx.stroke()
            if (!hasInk) setHasInk(true)
          }}
          onPointerUp={() => {
            drawingRef.current = false
            emit(true)
          }}
          onPointerLeave={() => {
            if (!drawingRef.current) return
            drawingRef.current = false
            emit(true)
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-muted-foreground">
          Sign with finger or stylus
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
