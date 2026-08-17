import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Smart-Tech Invoice System",
  description: "Service center invoice & dealer management platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
