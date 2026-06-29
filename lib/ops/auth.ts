export function isOpsStaff(role: unknown): boolean {
  return role === "admin" || role === "ops"
}
