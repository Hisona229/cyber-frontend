import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sensors Monitoring",
  description: "Кіберфізичні системи лабораторна 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="antialiased bg-gray-50 text-gray-800">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}