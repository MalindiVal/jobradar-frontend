import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "JobRadar", description: "Veille intelligente des offres d'alternance" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
