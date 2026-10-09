import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

// Display + body face shared with yizhouyu.dev ("E · Bright Grid"), loaded from Google Fonts by absolute URL.
// Not next/font: in production /weeks is proxied under yizhouyu.dev, and the self-hosted font's
// root-relative /_next/ URL inside the CSS resolves to the main site (GitHub Pages) and 404s.
const ARCHIVO_CSS = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&display=swap";

// YZY palindrome favicon, identical to the main site's.
const YZY_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231E45FF'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='square'%3E%3Cpath d='M4.5 8.5 8 15.5 11.5 8.5M8 15.5V23.5'/%3E%3Cpath d='M13.5 8.5h6l-6 15h6'/%3E%3Cpath d='M20.5 8.5 24 15.5 27.5 8.5M24 15.5V23.5'/%3E%3C/g%3E%3C/svg%3E";

// Theme: ?theme= (screenshots) > localStorage 'theme' (shared with yizhouyu.dev) > system.
// Runs before paint so there is no flash of the wrong theme.
const THEME_SCRIPT = `(function(){var t=null;try{t=new URLSearchParams(location.search).get('theme')}catch(e){}if(t!=='dark'&&t!=='light'){try{t=localStorage.getItem('theme')}catch(e){}}if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)})();`;

export const metadata: Metadata = {
  title: "Life in Weeks · YZY",
  description: "A visual map of my life, where each week I've been alive is a little box.",
  icons: {
    icon: YZY_FAVICON,
  },
  openGraph: {
    title: "Life in Weeks",
    description: "A visual map of my life, where each week I've been alive is a little box.",
    images: [
      {
        url: "/screencapture-localhost-3001-2025-06-15-20_26_45.png",
        width: 1200,
        height: 630,
        alt: "Life in Weeks - Visual timeline of Yizhou Yu's life",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life in Weeks",
    description: "A visual map of my life, where each week I've been alive is a little box.",
    images: ["/screencapture-localhost-3001-2025-06-15-20_26_45.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={ARCHIVO_CSS} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
