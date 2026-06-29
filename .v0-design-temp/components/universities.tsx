import { MapPin } from "lucide-react"

const universities = [
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

export function Universities() {
  return (
    <section id="universities" className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Campus Coverage
            </p>
            <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              We serve your university
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Storage2U is available at 20+ universities across the country — and growing every semester.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {universities.length} universities &amp; counting
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {universities.map((uni) => (
            <div
              key={uni.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{uni.name}</p>
                <p className="truncate text-xs text-muted-foreground">{uni.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your school?{" "}
            <a href="mailto:hello@storage2u.com" className="font-semibold text-accent underline underline-offset-4 hover:text-accent/80 transition-colors">
              Request your university
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
