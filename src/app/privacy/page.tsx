import Link from "next/link";

export const metadata = { title: "Privacy" };

export default function Privacy() {
  return <>
    <div className="page-hero"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
      <div className="eyebrow">Privacy / Rynster</div>
      <h1>Privacy by design.<br />Your projects stay yours.</h1>
      <p>This notice explains how the Rynster website and Rynster Local handle information. Local product details below are based on the published npm release 0.1.1. Future hosted services may have separate terms.</p>
    </div></div>

    <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] page-section legal-copy">
      <section><h2>1. Scope</h2>
        <p>Rynster includes this public website and Rynster Local, a tool that connects a compatible AI client to projects on your computer through MCP. Rynster Local 0.1.1 runs on your computer; this release has no Rynster-hosted account or project service. This notice describes these current offerings, not a future hosted product.</p>
      </section>

      <section><h2>2. The public website</h2>
        <p>The website does not require an account to browse. We use Vercel Web Analytics to measure page views and visitors in the project dashboard; it uses a daily rotating visitor hash, does not use cookies for analytics, and does not track visitors across sites. The hosting provider may also process technical request information, such as IP address, browser details, and security logs, to deliver and protect the site. The provider’s own policies and settings govern its processing and retention.</p>
        <p>The home page heart reaction uses a first-party cookie containing a random browser identifier for up to one year. The site stores a one-way hash of that identifier in Upstash Redis to prevent repeat reactions from the same browser; only the aggregate reaction count is shown publicly. Clearing browser storage can allow another reaction. The contact endpoint uses a best-effort in-memory rate limit; the home page feedback endpoint uses a short-lived rate-limit key derived from a one-way HMAC of the request IP address. Hosting logs may be subject to separate retention.</p>
      </section>

      <section><h2>3. Contact messages</h2>
        <p>If contact delivery is configured, the contact form fields you submit—name if supplied, email address, subject, and message—are sent server-side through Resend to the project contact. Your email address is used as the reply-to address. The optional reply email and message submitted through the home page feedback form are also sent to the project contact through Resend. This website does not keep a contact-message database. Resend and the receiving email system may process or retain messages under their own terms and retention practices.</p>
        <p>Do not include passwords, access tokens, private keys, or private project files in a message. For a vulnerability report, follow the private instructions on the <Link href="/security">security page</Link>.</p>
      </section>

      <section><h2>4. Rynster Local and project information</h2>
        <p>Rynster Local runs on your computer. When you use its tools, it may read and search permitted project files, inspect project structure and Git changes, prepare edits, manage editing worktrees, or run configured project checks. What it can do depends on your permissions and the actions you approve.</p>
        <p>Local configuration can contain registered project names and paths, descriptions, command definitions, protected-file rules, and permission choices. The owner credential is stored locally. Treat it as a password; the <code>rynster token</code> command displays it explicitly.</p>
        <p>HTTP OAuth grants are stored locally by default at <code>~/.rynster/oauth.json</code>, or at a path selected with <code>--storage</code> or <code>RYNSTER_OAUTH_STORAGE_PATH</code>. Grant storage contains authorization and client metadata and protected credential material. You can list grants and revoke an exact grant with <code>rynster oauth grants</code> and <code>rynster oauth revoke</code>.</p>
      </section>

      <section><h2>5. Audit and diagnostic records</h2>
        <p>Rynster’s audit log is enabled by default and is written locally to <code>.agent/audit.log</code>, unless you change the configuration. It records operation events and status for local review. Routine records are designed to omit source contents, search strings, command arguments, URL queries, and tokens. Some event metadata can include project or session identifiers, file paths, operation types, timestamps, and check results.</p>
        <p>Configured project commands return bounded output to the connected AI client, and a script can print information it reads. Do not assume output produced by project code is free of sensitive information. Local configuration, grants, and audit files remain until you or the relevant software removes them.</p>
      </section>

      <section><h2>6. AI clients and other services</h2>
        <p>Rynster is not an AI model or provider. You choose the client and AI provider. Project information returned by Rynster tools may be sent to and processed by that client or provider under their terms and privacy settings. Review those practices before connecting a private project.</p>
        <p>For remote access, you provide your own HTTPS tunnel; Rynster does not include or operate one. The tunnel provider and AI client may process connection metadata and data carried through the connection under their own policies.</p>
      </section>

      <section><h2>7. Network access</h2>
        <p>Local stdio connections run between the client and Rynster on your computer. If you choose HTTP mode, Rynster runs an authenticated local server. A remote client can reach it only through network access you configure, such as your own tunnel. HTTP authentication is required; a tunnel does not replace Rynster’s authentication and authorization checks.</p>
        <p>Approved project commands run with your operating-system user’s file and network access. Rynster does not act as a hosted proxy for project data, and it does not sandbox those commands.</p>
      </section>

      <section><h2>8. Future services and notice changes</h2>
        <p>This notice does not describe a future Rynster Connect or other hosted service. Before such a service is offered, its actual data collection, processing, storage, retention, and account controls should be documented separately. This notice should be updated when the website or product behavior changes.</p>
      </section>

      <section><h2>9. Privacy questions</h2>
        <p>For a privacy question, contact <a href="mailto:baskar12ai@gmail.com">baskar12ai@gmail.com</a>.</p>
      </section>
    </div>
  </>;
}
