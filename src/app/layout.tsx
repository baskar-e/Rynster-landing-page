import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MobileNavigation from "@/components/mobile-navigation";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rynster.vercel.app"),
  title: { default: "Rynster — Your AI, your local projects", template: "%s — Rynster" },
  description: "Connect compatible AI clients to local development projects through MCP, with configurable permissions and review before sensitive changes.",
  openGraph: {
    title: "Rynster — Your AI, your local projects",
    description: "A local bridge between your AI assistant and the code you own.",
    images: [
      {
        url: "/logo.png",
        width: 1254,
        height: 1254,
        alt: "Rynster logo",
      },
      {
        url: "/og/rynster-social-card.svg",
        width: 1200,
        height: 630,
        alt: "Rynster — Your AI, your local projects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Rynster — Your AI, your local projects",
    description: "Your AI, your local projects.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const nav = [ ["Features", "/features"], ["Docs", "/docs"], ["Media", "/media"], ["Security", "/security"] ];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-h-screen flex flex-col font-sans">
    <div className="announcement"><span className="status-dot" /> Local-first by design <span className="announcement-divider">/</span> Bring your own AI client</div>
    <header className="site-header"><div className="header-inner mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
      <Link className="brand" href="/" aria-label="Rynster home">
        <Image
          src="/logo.png"
          alt="Rynster logo"
          width={30}
          height={30}
          className="brand-logo"
          priority
        />
        <span>rynster</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <MobileNavigation />
      <Link className="button button-small button-dark header-cta" href="/docs/installation">Get started</Link>
    </div></header>
    <main className="flex-1">{children}</main>
    <footer className="site-footer"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] footer-top">
      <div className="footer-brand">
        <Link className="brand" href="/" aria-label="Rynster home">
          <Image
            src="/logo.png"
            alt="Rynster logo"
            width={30}
            height={30}
            className="brand-logo"
          />
          <span>rynster</span>
        </Link>
        <p>Your AI, your local projects.<br />A little more control over what happens next.</p>
      </div>
      <div className="footer-links"><div><b>Explore</b><Link href="/features">Features</Link><Link href="/media">Media</Link><Link href="/docs">Documentation</Link></div><div><b>Project</b><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></div></div>
    </div><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] footer-bottom"><span>© {new Date().getFullYear()} Rynster</span><span>Built for the work that matters.</span></div></footer>
    <Analytics />
  </body></html>;
}
