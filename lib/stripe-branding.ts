/** Storage2U hosted Checkout branding (file IDs from Stripe Files API upload). */
export const STRIPE_CHECKOUT_BRANDING = {
  displayName: "Storage2U",
  backgroundColor: "#fcf8ff",
  buttonColor: "#6b38d4",
  borderStyle: "rounded" as const,
  logoFileId:
    process.env.STRIPE_BRAND_LOGO_FILE_ID ?? "file_1TrJiWRt5Yna6OxDxoQhPPvG",
  iconFileId:
    process.env.STRIPE_BRAND_ICON_FILE_ID ?? "file_1TrJiVRt5Yna6OxDqweeXHWy",
}
