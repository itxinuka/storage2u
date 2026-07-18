"use client"

import { useEffect, useRef, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"

type LngLat = { lat: number; lng: number }
/** GeoJSON LineString coordinates: [lng, lat][] */
type RouteCoordinates = [number, number][]

type MoveInQuoteMapProps = {
  home: LngLat
  campus: LngLat
  route: RouteCoordinates
  className?: string
}

function createLabeledMarker(
  mapboxgl: typeof import("mapbox-gl").default,
  label: string,
  color: string
) {
  const el = document.createElement("div")
  el.style.display = "flex"
  el.style.flexDirection = "column"
  el.style.alignItems = "center"
  el.style.gap = "4px"

  const pin = document.createElement("div")
  pin.style.width = "14px"
  pin.style.height = "14px"
  pin.style.borderRadius = "9999px"
  pin.style.background = color
  pin.style.border = "2px solid #ffffff"
  pin.style.boxShadow = "0 1px 4px rgba(24, 20, 69, 0.35)"

  const text = document.createElement("span")
  text.textContent = label
  text.style.fontSize = "11px"
  text.style.fontWeight = "700"
  text.style.color = "#181445"
  text.style.background = "rgba(255, 255, 255, 0.92)"
  text.style.padding = "2px 6px"
  text.style.borderRadius = "6px"
  text.style.boxShadow = "0 1px 3px rgba(24, 20, 69, 0.15)"
  text.style.whiteSpace = "nowrap"

  el.append(pin, text)
  return new mapboxgl.Marker({ element: el, anchor: "bottom" })
}

export function MoveInQuoteMap({
  home,
  campus,
  route,
  className,
}: MoveInQuoteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  const routeKey = route.map((c) => c.join(",")).join(";")

  useEffect(() => {
    if (!token || !containerRef.current) return

    let cancelled = false
    let map: import("mapbox-gl").Map | null = null
    const markers: import("mapbox-gl").Marker[] = []

    void (async () => {
      const mapboxgl = (await import("mapbox-gl")).default
      if (cancelled || !containerRef.current) return

      mapboxgl.accessToken = token

      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend([home.lng, home.lat])
      bounds.extend([campus.lng, campus.lat])
      for (const coord of route) {
        bounds.extend(coord)
      }

      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds,
        fitBoundsOptions: { padding: 48, maxZoom: 12 },
        attributionControl: true,
      })

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      )

      map.on("load", () => {
        if (!map || cancelled) return

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          },
        })

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#6b38d4",
            "line-width": 4,
            "line-opacity": 0.9,
          },
        })

        markers.push(
          createLabeledMarker(mapboxgl, "Home", "#6b38d4")
            .setLngLat([home.lng, home.lat])
            .addTo(map),
          createLabeledMarker(mapboxgl, "Campus", "#a4d64c")
            .setLngLat([campus.lng, campus.lat])
            .addTo(map)
        )

        setReady(true)
      })
    })()

    return () => {
      cancelled = true
      for (const marker of markers) marker.remove()
      map?.remove()
      setReady(false)
    }
    // routeKey stands in for route so effect deps stay primitive/stable
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route serialized via routeKey
  }, [token, home.lat, home.lng, campus.lat, campus.lng, routeKey])

  if (!token) return null

  return (
    <div
      className={
        className ??
        "relative h-[240px] overflow-hidden rounded-2xl border border-border bg-muted sm:h-[280px]"
      }
    >
      <div ref={containerRef} className="h-full w-full" />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/80 text-sm text-muted-foreground">
          Loading map…
        </div>
      ) : null}
    </div>
  )
}
