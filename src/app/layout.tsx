import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { StoreProvider } from "@/lib/providers/store-provider";
import { BackgroundProvider } from "@/lib/providers/background-provider";
import DebugPanel from "@/components/shared/DebugPanel";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROBUILT Frontend",
  description: "Next.js App Router starter with Redux, Tailwind, and motion-ready UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>
        <BackgroundProvider />
        <ThemeProvider>
          <StoreProvider>
            {children}
            <DebugPanel />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
