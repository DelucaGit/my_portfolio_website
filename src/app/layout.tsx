import { Geist_Mono, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink, { MAIN_ID } from "@/components/SkipLink";
import SmoothScroll from "@/components/SmoothScroll";
import { getDefaultMetadata } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";

// Both fonts are downloaded at build time and served from our own domain.
// theme.css turns the variables into --sans and --mono.
const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  // Variable font: all weights, plus optical size so big headings look right
  axes: ["opsz"],
  variable: "--font-google-sans-flex",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = getDefaultMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the script below may add data-theme to <html>
    // before React starts, and React must leave it alone.
    <html
      lang="sv"
      className={`${googleSansFlex.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved theme before the first paint, so the page never
            flashes in the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SkipLink />
        <SmoothScroll>
          <Navbar />
          <main id={MAIN_ID} tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
