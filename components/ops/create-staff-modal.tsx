"use client"

import { Plus } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

import { createStaffProfile } from "@/app/ops/actions"
import { Modal } from "@/components/ops/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FIELD_CLASS =
  "h-[52px] w-full rounded-full border-0 bg-card px-5 text-[15px] font-medium text-foreground shadow-[inset_0_0_0_2px_var(--color-border)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--color-primary)] focus-visible:ring-0"

type CreateStaffModalProps = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const defaultForm = (): {
  name: string
  role: "driver" | "mover" | "dispatcher"
  phone: string
} => ({
  name: "",
  role: "driver",
  phone: "",
})

function ModalField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function CreateStaffModal({
  open,
  onClose,
  onCreated,
}: CreateStaffModalProps) {
  const [form, setForm] = useState(defaultForm)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (open) {
      setForm(defaultForm())
    }
  }, [open])

  function resetAndClose() {
    setForm(defaultForm())
    onClose()
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Name is required")
      return
    }

    startTransition(async () => {
      const result = await createStaffProfile({
        name: form.name.trim(),
        role: form.role,
        phone: form.phone.trim() || undefined,
      })

      if (!result.success) {
        toast.error(result.error ?? "Could not create driver profile")
        return
      }

      toast.success("Driver profile created")
      onCreated?.()
      resetAndClose()
    })
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Add driver"
      subtitle="Creates a staff profile. Add them to a shift separately."
      width={480}
      footer={
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={resetAndClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={pending}>
            <Plus className="size-4" />
            Create profile
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ModalField label="Name">
          <Input
            className={FIELD_CLASS}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Marcus Chen"
          />
        </ModalField>

        <ModalField label="Role">
          <select
            className={FIELD_CLASS}
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                role: e.target.value as "driver" | "mover" | "dispatcher",
              }))
            }
          >
            <option value="driver">Driver</option>
            <option value="mover">Mover</option>
            <option value="dispatcher">Dispatcher</option>
          </select>
        </ModalField>

        <ModalField label="Phone (optional)">
          <Input
            className={FIELD_CLASS}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="(604) 555-0100"
          />
        </ModalField>
      </div>
    </Modal>
  )
}
