import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QTAB Trading Game",
  description: "Trading game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono antialiased">{children}</body>
    </html>
  );
}
