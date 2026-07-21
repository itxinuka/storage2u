"use client"

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Plus,
  ScanLine,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"

import {
  addPickupUnits,
  completePickupWithSignoff,
  markUnitsMissing,
  recordUnitScan,
} from "@/app/ops/pickup-actions"
import { BarcodeScanner } from "@/components/ops/barcode-scanner"
import { SignaturePad } from "@/components/ops/signature-pad"
import { BarcodeSvg } from "@/components/ops/unit-label-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { PickupPageData, PickupSessionUnit } from "@/lib/ops/pickup-data"
import { cn } from "@/lib/utils"

type Step = "scan" | "resolve" | "sign"

type PickupViewProps = {
  data: PickupPageData
}

function statusTone(status: PickupSessionUnit["pickupStatus"]) {
  if (status === "scanned" || status === "added") {
    return "bg-lime-soft text-accent-foreground"
  }
  if (status === "missing") {
    return "bg-[var(--danger-bg)] text-[var(--danger-fg)]"
  }
  return "bg-muted text-muted-foreground"
}

function statusLabel(status: PickupSessionUnit["pickupStatus"]) {
  if (status === "scanned") return "Scanned"
  if (status === "added") return "Added"
  if (status === "missing") return "Missing"
  return "Pending"
}

export function PickupView({ data }: PickupViewProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>("scan")
  const [units, setUnits] = useState(data.units)
  const [session, setSession] = useState(data.session)
  const [manualCode, setManualCode] = useState("")
  const [cameraKey, setCameraKey] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [addCatalogId, setAddCatalogId] = useState(
    data.catalog.find((item) => item.kind === "box")?.id ?? data.catalog[0]?.id ?? ""
  )
  const [addQty, setAddQty] = useState(1)
  const [newUnitCodes, setNewUnitCodes] = useState<
    Array<{ id: string; code: string; labelName: string }>
  >([])
  const [selectedMissing, setSelectedMissing] = useState<string[]>([])
  const [missingReason, setMissingReason] = useState("")
  const [signerName, setSignerName] = useState(data.customerName === "—" ? "" : data.customerName)
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)

  const pendingUnits = useMemo(
    () => units.filter((unit) => unit.pickupStatus === "expected"),
    [units]
  )
  const scannedUnits = useMemo(
    () =>
      units.filter(
        (unit) =>
          unit.pickupStatus === "scanned" || unit.pickupStatus === "added"
      ),
    [units]
  )
  const missingUnits = useMemo(
    () => units.filter((unit) => unit.pickupStatus === "missing"),
    [units]
  )
  const addedCount = useMemo(
    () => units.filter((unit) => unit.pickupStatus === "added").length,
    [units]
  )

  const canProceedToSign = pendingUnits.length === 0

  function applyLocalScan(unitId: string) {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              pickupStatus:
                unit.pickupStatus === "added" ? "added" : "scanned",
            }
          : unit
      )
    )
  }

  function handleScan(code: string) {
    if (pending || step !== "scan") return
    startTransition(async () => {
      const result = await recordUnitScan(session.id, code)
      if (!result.success) {
        toast.error(result.error ?? "Scan failed")
        return
      }
      if (result.alreadyScanned) {
        toast.message("Already scanned", {
          description: result.labelName ?? code,
        })
        return
      }
      if (result.unitId) {
        applyLocalScan(result.unitId)
      }
      toast.success(result.labelName ?? "Unit scanned")
      router.refresh()
    })
  }

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!manualCode.trim()) return
    handleScan(manualCode)
    setManualCode("")
  }

  function handleAddUnits() {
    if (!addCatalogId || addQty < 1) return
    startTransition(async () => {
      const result = await addPickupUnits(session.id, {
        catalogId: addCatalogId,
        qty: addQty,
      })
      if (!result.success) {
        toast.error(result.error ?? "Could not add units")
        return
      }
      const added = result.units ?? []
      setUnits((prev) => [
        ...prev,
        ...added.map((unit) => ({
          id: unit.id,
          code: unit.code,
          labelName: unit.labelName,
          unitIndex: 0,
          bookingItemId: null,
          pickupStatus: "added" as const,
          kind: null,
        })),
      ])
      setNewUnitCodes(added)
      setSession((prev) => ({
        ...prev,
        addedCount: prev.addedCount + added.length,
        scannedCount: prev.scannedCount + added.length,
      }))
      if (result.billingNote) {
        toast.message("Units added — billing note", {
          description: result.billingNote,
        })
      } else {
        toast.success(`Added ${added.length} unit${added.length === 1 ? "" : "s"}`)
      }
      setAddOpen(false)
      setAddQty(1)
      router.refresh()
    })
  }

  function handleMarkMissing() {
    if (selectedMissing.length === 0) {
      toast.error("Select at least one pending unit")
      return
    }
    startTransition(async () => {
      const result = await markUnitsMissing(
        session.id,
        selectedMissing,
        missingReason
      )
      if (!result.success) {
        toast.error(result.error ?? "Could not mark missing")
        return
      }
      setUnits((prev) =>
        prev.map((unit) =>
          selectedMissing.includes(unit.id)
            ? { ...unit, pickupStatus: "missing" }
            : unit
        )
      )
      setSession((prev) => ({
        ...prev,
        shortfallAcknowledged: true,
        missingCount: prev.missingCount + selectedMissing.length,
      }))
      setSelectedMissing([])
      setMissingReason("")
      toast.success("Shortfall recorded")
      router.refresh()
    })
  }

  function handleComplete() {
    if (!signerName.trim() || !signatureDataUrl) {
      toast.error("Customer name and signature are required")
      return
    }
    startTransition(async () => {
      const result = await completePickupWithSignoff(session.id, {
        signerName,
        signatureDataUrl,
      })
      if (!result.success) {
        toast.error(result.error ?? "Could not complete pickup")
        return
      }
      toast.success("Pickup completed")
      router.push("/ops/schedule")
      router.refresh()
    })
  }

  const tallyParts: string[] = []
  const boxCount = units.filter(
    (unit) =>
      (unit.pickupStatus === "scanned" || unit.pickupStatus === "added") &&
      unit.kind !== "item"
  ).length
  const itemCount = units.filter(
    (unit) =>
      (unit.pickupStatus === "scanned" || unit.pickupStatus === "added") &&
      unit.kind === "item"
  ).length
  if (boxCount > 0) tallyParts.push(`${boxCount} box${boxCount === 1 ? "" : "es"}`)
  if (itemCount > 0) {
    tallyParts.push(`${itemCount} item${itemCount === 1 ? "" : "s"}`)
  }
  if (addedCount > 0) tallyParts.push(`${addedCount} added`)
  if (missingUnits.length > 0) {
    tallyParts.push(`${missingUnits.length} missing`)
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pb-28">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0"
          render={<Link href="/ops/schedule" aria-label="Back to schedule" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Field pickup
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            {data.customerName}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            #{data.displayId} · {data.university} · {data.address}
          </p>
        </div>
      </div>

      <Card className="py-4">
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              Progress
            </div>
            <div className="text-2xl font-extrabold tabular-nums">
              {scannedUnits.length}
              <span className="text-base font-bold text-muted-foreground">
                {" "}
                / {units.length}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {addedCount > 0 ? (
                <Badge className="rounded-full border-transparent bg-purple-soft font-bold text-primary">
                  +{addedCount} added
                </Badge>
              ) : null}
              {missingUnits.length > 0 ? (
                <Badge className="rounded-full border-transparent bg-[var(--danger-bg)] font-bold text-[var(--danger-fg)]">
                  {missingUnits.length} missing
                </Badge>
              ) : null}
              {pendingUnits.length > 0 ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-transparent bg-muted font-bold text-muted-foreground"
                >
                  {pendingUnits.length} pending
                </Badge>
              ) : null}
            </div>
          </div>
          <ScanLine className="size-8 text-primary" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["scan", "Scan"],
            ["resolve", "Resolve"],
            ["sign", "Sign"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStep(id)}
            className={cn(
              "rounded-full px-3 py-2 text-[12.5px] font-bold transition-colors",
              step === id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {step === "scan" ? (
        <div className="flex flex-col gap-4">
          <BarcodeScanner
            key={cameraKey}
            enabled={step === "scan"}
            onScan={handleScan}
          />

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Or type code (S2U-…)"
              className="font-mono"
              autoCapitalize="characters"
            />
            <Button type="submit" disabled={pending || !manualCode.trim()}>
              Add
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setAddOpen((open) => !open)}
            >
              <Plus className="size-4" />
              Add unlabeled
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCameraKey((key) => key + 1)}
            >
              Retry cam
            </Button>
          </div>

          {addOpen ? (
            <Card className="py-4">
              <CardContent className="flex flex-col gap-3">
                <div className="text-sm font-bold">Add unit on site</div>
                <select
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
                  value={addCatalogId}
                  onChange={(event) => setAddCatalogId(event.target.value)}
                >
                  {data.catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · ${item.price}/mo
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={addQty}
                    onChange={(event) =>
                      setAddQty(Math.max(1, Number(event.target.value) || 1))
                    }
                  />
                  <Button
                    type="button"
                    disabled={pending}
                    onClick={handleAddUnits}
                  >
                    Create labels
                  </Button>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  Extra units charge the card on file. Show the QR below on a
                  blank sticker — print full labels later from the order.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {newUnitCodes.length > 0 ? (
            <div className="grid gap-3">
              {newUnitCodes.map((unit) => (
                <Card key={unit.id} className="py-4">
                  <CardContent className="flex flex-col items-center gap-2 text-center">
                    <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                      New label — write on sticker
                    </div>
                    <QRCodeSVG value={unit.code} size={160} level="M" />
                    <BarcodeSvg value={unit.code} height={40} className="w-full max-w-[220px]" />
                    <div className="font-mono text-sm font-bold">{unit.code}</div>
                    <div className="text-[12.5px] text-muted-foreground">
                      {unit.labelName}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          <UnitList units={units} />

          <Button
            type="button"
            className="w-full"
            disabled={pending}
            onClick={() => setStep(pendingUnits.length > 0 ? "resolve" : "sign")}
          >
            {pendingUnits.length > 0 ? "Resolve mismatches" : "Continue to sign-off"}
          </Button>
        </div>
      ) : null}

      {step === "resolve" ? (
        <div className="flex flex-col gap-4">
          {pendingUnits.length === 0 && missingUnits.length === 0 && addedCount === 0 ? (
            <Card className="py-5">
              <CardContent className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <div>
                  <div className="font-bold">Counts match</div>
                  <p className="text-muted-foreground">
                    Every expected unit was scanned. Continue to customer
                    sign-off.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {addedCount > 0 ? (
            <Card className="py-4">
              <CardContent className="flex items-start gap-3 text-sm">
                <CircleAlert className="mt-0.5 size-5 text-primary" />
                <div>
                  <div className="font-bold">{addedCount} extra unit(s) added</div>
                  <p className="text-muted-foreground">
                    Billed to the card on file (or flagged for office if billing
                    failed).
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {pendingUnits.length > 0 ? (
            <Card className="py-4">
              <CardContent className="flex flex-col gap-3">
                <div className="text-sm font-bold">
                  Mark missing ({pendingUnits.length} pending)
                </div>
                <div className="flex flex-col gap-2">
                  {pendingUnits.map((unit) => {
                    const checked = selectedMissing.includes(unit.id)
                    return (
                      <label
                        key={unit.id}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted px-3 py-2.5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedMissing((prev) =>
                              checked
                                ? prev.filter((id) => id !== unit.id)
                                : [...prev, unit.id]
                            )
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">
                            {unit.labelName}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {unit.code}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <Input
                  value={missingReason}
                  onChange={(event) => setMissingReason(event.target.value)}
                  placeholder="Reason (optional)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    setSelectedMissing(pendingUnits.map((unit) => unit.id))
                  }
                >
                  Select all pending
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending || selectedMissing.length === 0}
                  onClick={handleMarkMissing}
                >
                  Confirm shortfall
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <UnitList units={units} />

          <Button
            type="button"
            className="w-full"
            disabled={!canProceedToSign}
            onClick={() => setStep("sign")}
          >
            Continue to sign-off
          </Button>
        </div>
      ) : null}

      {step === "sign" ? (
        <div className="flex flex-col gap-4">
          {!canProceedToSign ? (
            <Card className="py-4">
              <CardContent className="text-sm text-muted-foreground">
                Resolve pending units before sign-off.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="py-4">
                <CardContent>
                  <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                    Customer confirms
                  </div>
                  <p className="mt-1 text-[15px] font-bold text-foreground">
                    {tallyParts.join(" · ") || `${scannedUnits.length} units collected`}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    I confirm this is the exact amount of items being stored
                    today.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <label className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
                  Printed name
                </label>
                <Input
                  value={signerName}
                  onChange={(event) => setSignerName(event.target.value)}
                  placeholder="Customer full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
                  Signature
                </label>
                <SignaturePad onChange={setSignatureDataUrl} />
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={pending || !signerName.trim() || !signatureDataUrl}
                onClick={handleComplete}
              >
                Complete pickup
              </Button>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

function UnitList({ units }: { units: PickupSessionUnit[] }) {
  if (units.length === 0) {
    return (
      <div className="rounded-3xl bg-muted px-4 py-5 text-sm text-muted-foreground">
        No units on this order yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      {units.map((unit, index) => (
        <div
          key={unit.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3",
            index > 0 && "border-t border-border"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-foreground">
              {unit.labelName}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              {unit.code}
            </div>
          </div>
          <Badge
            className={cn(
              "rounded-full border-transparent font-bold",
              statusTone(unit.pickupStatus)
            )}
          >
            {statusLabel(unit.pickupStatus)}
          </Badge>
        </div>
      ))}
    </div>
  )
}
