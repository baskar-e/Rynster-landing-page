import Link from "next/link";
import { notFound } from "next/navigation";

type Section = { heading: string; body: string[]; code?: string };
type Guide = { title: string; intro: string; sections: Section[] };

const guides: Record<string, Guide> = {
  installation: {
    title: "Install Rynster",
    intro: "Install the current Rynster Local release from npm. This guide reflects rynster 0.1.1.",
    sections: [
      { heading: "Requirements", body: ["Rynster 0.1.1 requires Node.js 22.17 or newer in the 22.x line, or 24.2 or newer in the 24.x line, and npm 11 or newer."] },
      { heading: "Install the package", body: ["Install globally, then confirm the installed version:"] , code: "npm install -g rynster\nrynster --version" },
      { heading: "Next step", body: ["Register a project and connect a local MCP client. Keep owner credentials and OAuth storage on your machine."] },
    ],
  },
  quickstart: {
    title: "Quick start",
    intro: "Install Rynster, register a project, and start a local stdio connection for your MCP client.",
    sections: [
      { heading: "1. Install Rynster", body: ["Rynster 0.1.1 requires Node.js 22.17+ (22.x) or 24.2+ (24.x), and npm 11+."], code: "npm install -g rynster\nrynster --version" },
      { heading: "2. Register a project", body: ["Use a project name and the path to its directory. Register only projects you trust and intend to expose to your AI client."], code: "rynster register my-app ~/code/my-app\nrynster projects" },
      { heading: "3. Start a local MCP connection", body: ["For a client that can launch a local command, use stdio. No tunnel is needed."], code: "rynster start my-app --stdio" },
      { heading: "4. Review the first session", body: ["Read and search are allowed by default in the example policy. Writes, project checks, and Git commits ask for approval; deletes and pushes are denied. Review your actual configuration before connecting."] },
    ],
  },
  "ai-client-setup": {
    title: "Connect an AI client",
    intro: "Rynster 0.1.1 supports MCP protocol version 2026-07-28 over local stdio and authenticated HTTP. Check that your client supports this protocol version and connection mode.",
    sections: [
      { heading: "Local stdio", body: ["Use this when the client runs on the same computer and can launch a local command. Add a server entry to the client's MCP configuration; the configuration file location depends on the client."], code: '{\n  "mcpServers": {\n    "rynster": {\n      "command": "rynster",\n      "args": ["start", "my-app", "--stdio"]\n    }\n  }\n}' },
      { heading: "Remote HTTP", body: ["For a client that must connect over the internet, provide your own HTTPS tunnel to local port 3333. Rynster does not include a tunnel. Start the tunnel first, then start Rynster using the public HTTPS origin from your tunnel."], code: "cloudflared tunnel --url http://127.0.0.1:3333\n\nrynster start my-app --port 3333 --public-url https://your-tunnel-hostname" },
      { heading: "Add the remote endpoint", body: ["Configure your client to connect to the MCP endpoint. Keep Rynster and your tunnel running while the client needs access. HTTP authentication is required; a tunnel does not replace it."], code: "https://your-tunnel-hostname/mcp" },
      { heading: "Protect credentials", body: ["Keep the owner token and OAuth storage on your computer. Treat the output of `rynster token` as a password. Review and revoke client grants with `rynster oauth grants` and `rynster oauth revoke <grant-id>`."] },
    ],
  },
  security: {
    title: "Security boundaries",
    intro: "Rynster provides local project and approval controls, but it is not a sandbox. These notes reflect Rynster 0.1.1.",
    sections: [
      { heading: "Permissions", body: ["Actions can be configured as allow, ask, or deny. The example configuration allows reads and searches, asks before writes, creates, checks, and commits, and denies deletes and pushes. Your local configuration determines the effective policy."] },
      { heading: "Command execution", body: ["Clients can request only configured typecheck, lint, test, format, and build commands. Scripts execute with your operating-system user’s file and network access. Review code before approving a command; Rynster does not provide an OS-isolated executor."] },
      { heading: "Local and remote access", body: ["HTTP MCP requires an owner bearer token or valid OAuth grant. Use your own HTTPS tunnel for remote access and keep it protected. Rynster does not provide a hosted service or built-in tunnel."] },
      { heading: "Report a vulnerability", body: ["Email baskar12ai@gmail.com with the subject “Rynster security report”. Include version, platform, reproduction steps, and impact. Redact logs and never send credentials or private project files."] },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting",
    intro: "These checks reflect the published Rynster 0.1.1 package. Include version and client details when asking for help.",
    sections: [
      { heading: "The command is not found", body: ["Check that npm’s global bin directory is on your PATH, open a new terminal, and run `rynster --version`."] },
      { heading: "The client cannot connect over stdio", body: ["Confirm the registered project name and executable path. Restart the client after changing its MCP configuration. The local command format is `rynster start <project> --stdio`."] },
      { heading: "Remote connection stopped working", body: ["Your tunnel hostname may have changed. Restart the tunnel, then start Rynster with the new `--public-url` and reconnect the client. The endpoint is `/mcp`; HTTP authentication remains required."] },
      { heading: "Search or ripgrep is missing", body: ["Reinstall with optional dependencies included on the machine where you run Rynster. Do not copy `node_modules` between operating systems or CPU types."], code: "npm install -g rynster --include=optional" },
      { heading: "An action is denied or waiting", body: ["Check its permission in `agent.config.json`. An action set to ask requires a local terminal approval; headless runs deny approval-required operations."] },
    ],
  },
};

export function generateStaticParams() { return Object.keys(guides).map(slug => ({ slug })); }

export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides[slug];
  if (!guide) notFound();
  return <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] doc-layout">
    <aside className="doc-sidebar"><h4>Documentation</h4><Link href="/docs">Overview</Link>{Object.entries(guides).map(([key, value]) => <Link className={key === slug ? "active" : ""} key={key} href={`/docs/${key}`}>{value.title}</Link>)}</aside>
    <article className="doc-content"><div className="section-kicker">RYNSTER LOCAL / GUIDE</div><h1>{guide.title}</h1><p>{guide.intro}</p>
      {guide.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((text, index) => <p key={index}>{text}</p>)}{section.code && <pre className="code-block">{section.code}</pre>}</section>)}
      {slug === "security" && <div className="callout">See the full <Link href="/security">security policy</Link> and <Link href="/privacy">privacy notice</Link>.</div>}
    </article>
  </div>;
}
