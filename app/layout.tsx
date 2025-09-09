import type { Metadata } from "next";
    import "./globals.css";
    import { Inter } from "next/font/google";

    const inter = Inter({
      subsets: ["latin-ext"],
      display: "swap",
      variable: "--font-inter"
    });

    export const metadata: Metadata = {
      title: "Generator zapowiedzi meczu",
      description: "Aplikacja do tworzenia zapowiedzi meczu ligowego (1200x630 px)"
    };

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="pl" className={inter.variable}>
          <body className="font-sans">{children}</body>
        </html>
      );
    }
