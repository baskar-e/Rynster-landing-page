import Link from "next/link";

export const metadata = { title: "Documentation" };
const entries = [
  ["Installation", "Install Rynster and check the basic requirements.", "/docs/installation"],
  ["Quick start", "The first steps from installing to connecting a client.", "/docs/quickstart"],
  ["AI client setup", "Configure a compatible MCP client to use Rynster.", "/docs/ai-client-setup"],
  ["Security boundaries", "Understand local permissions and their limitations.", "/docs/security"],
  ["Troubleshooting", "A checklist for common connection and setup issues.", "/docs/troubleshooting"],
];
export default function Docs(){return <><div className="page-hero"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]"><div className="eyebrow">Rynster Local / Guides</div><h1>Get connected.<br />Stay in control.</h1><p>Start with the basics, then configure a compatible AI client for your local project.</p></div></div><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] page-section"><div className="section-kicker">START HERE</div><div className="doc-cards">{entries.map(([title,desc,href],i)=><article className="doc-card" key={href}><div className="section-kicker">GUIDE 0{i+1}</div><h3 className="pt-3">{title}</h3><p>{desc}</p><Link href={href}>Read guide →</Link></article>)}</div></div></>}
