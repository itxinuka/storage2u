type ItemIconName =
  | "fridge"
  | "bike"
  | "suitcase"
  | "backpack"
  | "monitor"
  | "box"
  | "mirror"
  | "duffel"
  | "skis"
  | "desk_chair"

type PathEntry = string | { c: [number, number, number] }

const ITEM_PATHS: Record<ItemIconName, PathEntry[]> = {
  fridge: [
    "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
    "M5 10h14",
    "M9 6v1",
    "M9 14v3",
  ],
  bike: [
    { c: [18.5, 17.5, 3.5] },
    { c: [5.5, 17.5, 3.5] },
    { c: [15, 5, 1] },
    "M12 17.5V14l-3-3 4-3 2 3h2",
  ],
  suitcase: [
    "M6 6h12a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2z",
    "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    "M9 11v6",
    "M15 11v6",
  ],
  backpack: [
    "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
    "M9 6V5a3 3 0 0 1 6 0v1",
    "M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4",
    "M8 10h8",
  ],
  monitor: [
    "M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    "M8 21h8",
    "M12 17v4",
  ],
  box: [
    "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    "m3.3 7 8.7 5 8.7-5",
    "M12 22V12",
  ],
  mirror: [
    "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
    "M8 21h8",
    "M9 7h6v8H9z",
  ],
  duffel: [
    "M4 10h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z",
    "M8 10V8a4 4 0 0 1 8 0v2",
    "M4 14h16",
  ],
  skis: [
    "M6 3v18",
    "M10 3v18",
    "M4 7h4",
    "M8 11h4",
    "M14 3l6 18",
    "M18 9h-3",
  ],
  desk_chair: [
    "M8 4h8v6H8z",
    "M6 10h12",
    "M9 10v6",
    "M15 10v6",
    "M7 16h10",
    "M8 20h2",
    "M14 20h2",
  ],
}

function isItemIconName(name: string): name is ItemIconName {
  return name in ITEM_PATHS
}

type ItemIconProps = {
  name: string
  size?: number
  className?: string
}

export function ItemIcon({ name, size = 24, className }: ItemIconProps) {
  const items = isItemIconName(name) ? ITEM_PATHS[name] : ITEM_PATHS.box

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {items.map((entry, i) =>
        typeof entry === "string" ? (
          <path key={i} d={entry} />
        ) : (
          <circle key={i} cx={entry.c[0]} cy={entry.c[1]} r={entry.c[2]} />
        )
      )}
    </svg>
  )
}
