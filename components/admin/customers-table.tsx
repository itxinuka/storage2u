"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type AdminCustomer = {
  id: string
  name: string
  email: string
  university: string
  phone: string
  activeItems: number
  totalBookings: number
  memberSince: string
}

interface CustomersTableProps {
  customers: AdminCustomer[]
}

function formatMemberSince(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState("")

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return customers

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    )
  }, [customers, search])

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search by name or email..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active items</TableHead>
              <TableHead>Total bookings</TableHead>
              <TableHead>Member since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.university}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.activeItems}</TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>{formatMemberSince(customer.memberSince)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/bookings?customer=${customer.id}`} />}>
                      View bookings
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
