import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webkit",
  description: "Small business website starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
