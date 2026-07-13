import "server-only"

import type { MoveInCampus } from "@/lib/move-in-campuses"

export type HomeAddress = {
  street: string
  city: string
  province: string
  postalCode: string
}

export type GeocodeResult =
  | { success: true; lat: number; lng: number }
  | { success: false; error: string }

export type DrivingDistanceResult =
  | { success: true; distanceKm: number }
  | { success: false; error: string }

function getMapboxToken(): string | null {
  return process.env.MAPBOX_ACCESS_TOKEN ?? null
}

function formatHomeAddress(address: HomeAddress): string {
  return `${address.street.trim()}, ${address.city.trim()}, ${address.province.trim()} ${address.postalCode.trim()}, Canada`
}

export async function geocodeHomeAddress(
  address: HomeAddress
): Promise<GeocodeResult> {
  const token = getMapboxToken()
  if (!token) {
    return { success: false, error: "Mapbox is not configured." }
  }

  const query = encodeURIComponent(formatHomeAddress(address))
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=CA&limit=1`

  try {
    const response = await fetch(url, { next: { revalidate: 0 } })
    if (!response.ok) {
      return { success: false, error: "Geocoding request failed." }
    }

    const data = (await response.json()) as {
      features?: Array<{ center?: [number, number] }>
    }

    const center = data.features?.[0]?.center
    if (!center || center.length < 2) {
      return { success: false, error: "Address not found." }
    }

    return { success: true, lng: center[0], lat: center[1] }
  } catch {
    return { success: false, error: "Geocoding request failed." }
  }
}

export async function getDrivingDistanceKm(
  home: { lat: number; lng: number },
  campus: MoveInCampus
): Promise<DrivingDistanceResult> {
  const token = getMapboxToken()
  if (!token) {
    return { success: false, error: "Mapbox is not configured." }
  }

  const coordinates = `${home.lng},${home.lat};${campus.lng},${campus.lat}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?access_token=${token}&geometries=geojson&overview=false`

  try {
    const response = await fetch(url, { next: { revalidate: 0 } })
    if (!response.ok) {
      return { success: false, error: "Directions request failed." }
    }

    const data = (await response.json()) as {
      routes?: Array<{ distance?: number }>
      code?: string
    }

    if (data.code !== "Ok" || !data.routes?.[0]?.distance) {
      return { success: false, error: "Could not calculate driving distance." }
    }

    const distanceKm = data.routes[0].distance / 1000
    return { success: true, distanceKm }
  } catch {
    return { success: false, error: "Directions request failed." }
  }
}

export async function quoteDrivingDistanceKm(
  homeAddress: HomeAddress,
  campus: MoveInCampus
): Promise<DrivingDistanceResult> {
  const geocoded = await geocodeHomeAddress(homeAddress)
  if (!geocoded.success) {
    return { success: false, error: geocoded.error }
  }

  return getDrivingDistanceKm(
    { lat: geocoded.lat, lng: geocoded.lng },
    campus
  )
}

export { formatHomeAddress }
