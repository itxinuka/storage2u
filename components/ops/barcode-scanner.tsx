"use client"

import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BarcodeScannerProps = {
  onScan: (code: string) => void
  enabled?: boolean
  className?: string
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>
}

function getBarcodeDetector():
  | (new (options?: { formats: string[] }) => BarcodeDetectorLike)
  | null {
  if (typeof window === "undefined") return null
  const ctor = (
    window as unknown as {
      BarcodeDetector?: new (options?: {
        formats: string[]
      }) => BarcodeDetectorLike
    }
  ).BarcodeDetector
  return ctor ?? null
}

export function BarcodeScanner({
  onScan,
  enabled = true,
  className,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onScanRef = useRef(onScan)
  const lastCodeRef = useRef<string>("")
  const lastAtRef = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let stream: MediaStream | null = null
    let rafId = 0
    let zxingControls: IScannerControls | null = null
    let detector: BarcodeDetectorLike | null = null

    function emit(code: string) {
      const normalized = code.trim()
      if (!normalized) return
      const now = Date.now()
      if (
        normalized === lastCodeRef.current &&
        now - lastAtRef.current < 2000
      ) {
        return
      }
      lastCodeRef.current = normalized
      lastAtRef.current = now
      onScanRef.current(normalized)
    }

    async function startNative(video: HTMLVideoElement) {
      const Detector = getBarcodeDetector()
      if (!Detector) return false

      try {
        detector = new Detector({
          formats: ["qr_code", "code_128", "code_39", "ean_13", "ean_8"],
        })
      } catch {
        return false
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop())
        return true
      }

      video.srcObject = stream
      await video.play()
      setRunning(true)
      setError(null)

      const tick = async () => {
        if (cancelled || !detector || video.readyState < 2) {
          rafId = requestAnimationFrame(tick)
          return
        }
        try {
          const results = await detector.detect(video)
          if (results[0]?.rawValue) {
            emit(results[0].rawValue)
          }
        } catch {
          // Ignore transient detect errors
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
      return true
    }

    async function startZxing(video: HTMLVideoElement) {
      const reader = new BrowserMultiFormatReader()
      zxingControls = await reader.decodeFromVideoDevice(
        undefined,
        video,
        (result, _error, controls) => {
          zxingControls = controls
          if (result) {
            emit(result.getText())
          }
        }
      )
      setRunning(true)
      setError(null)
    }

    async function start() {
      const video = videoRef.current
      if (!video) return

      try {
        const usedNative = await startNative(video)
        if (cancelled) return
        if (!usedNative) {
          await startZxing(video)
        }
      } catch (err) {
        if (cancelled) return
        setRunning(false)
        setError(
          err instanceof Error
            ? err.message
            : "Camera access denied. Use manual code entry."
        )
      }
    }

    void start()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((track) => track.stop())
      zxingControls?.stop()
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setRunning(false)
    }
  }, [enabled])

  return (
    <div className={cn("overflow-hidden rounded-3xl bg-black", className)}>
      <div className="relative aspect-[4/3] w-full bg-black">
        <video
          ref={videoRef}
          className="size-full object-cover"
          muted
          playsInline
          autoPlay
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[42%] w-[72%] rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        </div>
        {!running && !error ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
            Starting camera…
          </div>
        ) : null}
      </div>
      {error ? (
        <div className="bg-card px-4 py-3 text-sm text-muted-foreground">
          {error}
        </div>
      ) : (
        <div className="bg-card px-4 py-2.5 text-center text-[12.5px] font-semibold text-muted-foreground">
          Align QR or barcode inside the frame
        </div>
      )}
      {error ? (
        <div className="border-t border-border bg-card px-4 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setError(null)
              setRunning(false)
            }}
          >
            Retry camera
          </Button>
        </div>
      ) : null}
    </div>
  )
}
