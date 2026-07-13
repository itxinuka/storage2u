/** Campus anchors for move-in distance quoting (Mapbox driving distance). */

export type MoveInCampus = {
  id: string
  universityId: string
  name: string
  /** Full address string for Mapbox geocoding / directions. */
  address: string
  lat: number
  lng: number
}

export type MoveInUniversity = {
  id: string
  name: string
  short: string
}

export const MOVE_IN_UNIVERSITIES: MoveInUniversity[] = [
  { id: "memorial", name: "Memorial University", short: "Memorial" },
  { id: "stfx", name: "St. Francis Xavier University", short: "StFX" },
  { id: "dalhousie", name: "Dalhousie University", short: "Dalhousie" },
  { id: "cna", name: "College of the North Atlantic", short: "CNA" },
]

export const MOVE_IN_CAMPUSES: MoveInCampus[] = [
  {
    id: "memorial_st_johns",
    universityId: "memorial",
    name: "St. John's (main campus)",
    address: "230 Elizabeth Ave, St. John's, NL A1B 3X9, Canada",
    lat: 47.5707,
    lng: -52.7357,
  },
  {
    id: "stfx_antigonish",
    universityId: "stfx",
    name: "Antigonish",
    address: "4130 University Ave, Antigonish, NS B2G 2W5, Canada",
    lat: 45.6167,
    lng: -61.9986,
  },
  {
    id: "dal_studley",
    universityId: "dalhousie",
    name: "Studley Campus (Halifax)",
    address: "6299 South St, Halifax, NS B3H 4R2, Canada",
    lat: 44.6366,
    lng: -63.5912,
  },
  {
    id: "dal_sexton",
    universityId: "dalhousie",
    name: "Sexton Campus (Halifax)",
    address: "5269 Morris St, Halifax, NS B3J 1B6, Canada",
    lat: 44.6424,
    lng: -63.5749,
  },
  {
    id: "cna_ppd",
    universityId: "cna",
    name: "Prince Philip Drive (St. John's)",
    address: "Prince Philip Dr, St. John's, NL A1B 3R9, Canada",
    lat: 47.5612,
    lng: -52.7789,
  },
  {
    id: "cna_corner_brook",
    universityId: "cna",
    name: "Corner Brook",
    address: "432 Massachusetts Dr, Corner Brook, NL A2H 6X9, Canada",
    lat: 48.9489,
    lng: -57.9436,
  },
  {
    id: "cna_gander",
    universityId: "cna",
    name: "Gander",
    address: "20 Airport Blvd, Gander, NL A1V 1K8, Canada",
    lat: 48.9569,
    lng: -54.6089,
  },
  {
    id: "cna_grand_falls",
    universityId: "cna",
    name: "Grand Falls-Windsor",
    address: "1 College Rd, Grand Falls-Windsor, NL A2A 1N3, Canada",
    lat: 48.9178,
    lng: -55.6514,
  },
]

export function getCampusesForUniversity(universityId: string): MoveInCampus[] {
  return MOVE_IN_CAMPUSES.filter((c) => c.universityId === universityId)
}

export function getCampusById(campusId: string): MoveInCampus | undefined {
  return MOVE_IN_CAMPUSES.find((c) => c.id === campusId)
}

export function getUniversityById(
  universityId: string
): MoveInUniversity | undefined {
  return MOVE_IN_UNIVERSITIES.find((u) => u.id === universityId)
}
