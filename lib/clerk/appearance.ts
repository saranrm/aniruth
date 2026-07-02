import { dark } from "@clerk/ui/themes"

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: "var(--background)",
    colorBorder: "var(--border)",
    colorDanger: "var(--destructive)",
    colorForeground: "var(--foreground)",
    colorInput: "var(--background)",
    colorInputForeground: "var(--foreground)",
    colorMuted: "var(--muted)",
    colorMutedForeground: "var(--muted-foreground)",
    colorNeutral: "var(--muted-foreground)",
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorRing: "var(--ring)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    borderRadius: "var(--radius)",
  },
  elements: {
    cardBox: "shadow-none",
    card: "border border-border bg-card text-card-foreground shadow-none",
    footer: "bg-card",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
    formFieldInput:
      "border-border bg-background text-foreground focus:ring-ring",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton:
      "border-border bg-background text-foreground hover:bg-accent",
  },
}
