"use client"

import { useState } from "react"
import { Search, MapPin, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BookingData } from "./booking-form"

const UNIVERSITIES = [
  { name: "University of Michigan", location: "Ann Arbor, MI" },
  { name: "Ohio State University", location: "Columbus, OH" },
  { name: "University of Texas", location: "Austin, TX" },
  { name: "UCLA", location: "Los Angeles, CA" },
  { name: "NYU", location: "New York, NY" },
  { name: "Boston University", location: "Boston, MA" },
  { name: "University of Florida", location: "Gainesville, FL" },
  { name: "Penn State", location: "State College, PA" },
  { name: "University of Illinois", location: "Champaign, IL" },
  { name: "Indiana University", location: "Bloomington, IN" },
  { name: "University of Georgia", location: "Athens, GA" },
  { name: "Purdue University", location: "West Lafayette, IN" },
  { name: "University of Wisconsin", location: "Madison, WI" },
  { name: "University of Virginia", location: "Charlottesville, VA" },
  { name: "University of Maryland", location: "College Park, MD" },
  { name: "Michigan State", location: "East Lansing, MI" },
  { name: "University of Colorado", location: "Boulder, CO" },
  { name: "Arizona State", location: "Tempe, AZ" },
  { name: "University of Washington", location: "Seattle, WA" },
  { name: "University of Minnesota", location: "Minneapolis, MN" },
]

interface Props {
  data: BookingData
  update: (fields: Partial<BookingData>) => void
  onNext: () => void
}

export function StepUniversity({ data, update, onNext }: Props) {
  const [query, setQuery] = useState("")

  const filtered = UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.location.toLowerCase().includes(query.toLowerCase())
  )

  const canContinue = data.university !== ""

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Which university are you at?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Select your school so we can confirm service availability.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search your university..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search universities"
        />
      </div>

      {/* University grid */}
      <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
            No university found.{" "}
            <a
              href="mailto:hello@storage2u.com"
              className="font-semibold text-accent underline underline-offset-4"
            >
              Request yours
            </a>
          </p>
        ) : (
          filtered.map((uni) => {
            const selected = data.university === uni.name
            return (
              <button
                key={uni.name}
                type="button"
                onClick={() => update({ university: uni.name })}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  selected
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
                )}
                aria-pressed={selected}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    selected ? "bg-accent" : "bg-primary"
                  )}
                >
                  {selected ? (
                    <Check className="h-4 w-4 text-accent-foreground" strokeWidth={3} />
                  ) : (
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{uni.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{uni.location}</p>
                </div>
              </button>
            )
          })
        )}
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
