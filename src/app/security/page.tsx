import Link from "next/link";

export const metadata = { title: "Security" };

export default function Security() {
  return <>
    <div className="page-hero"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
      <div className="eyebrow">Security / Rynster Local 0.1.1</div>
      <h1>Local control.<br />Clear boundaries.</h1>
      <p>Rynster Local runs on your computer and gives compatible AI clients permission-controlled access to registered projects. It is not a sandbox. Read the limits as well as the protections.</p>
    </div></div>

    <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] page-section legal-copy">
      <section><h2>1. Scope and threat model</h2>
        <p>This page describes the published npm package <code>rynster@0.1.1</code>. Rynster runs on your own computer; this release has no Rynster-hosted service. The security model trusts you, the operating-system user, and the project code you approve. It does not defend against a malicious process already running as you.</p>
      </section>

      <section><h2>2. Permissions and approvals</h2>
        <p>Actions can be configured as <code>allow</code>, <code>ask</code>, or <code>deny</code>. The example defaults allow project reads and searches; ask before writes, file creation, configured checks, and Git commits; and deny file deletion and Git pushes. Your configuration can change these choices.</p>
        <p>Approval-required actions need an available local terminal; headless runs deny them. Edit approvals are bound to the specific operation and expire after five minutes. Rynster rechecks authorization, permissions, file identity, and relevant revisions before writing. A changed file or operation requires a fresh approval.</p>
      </section>

      <section><h2>3. Project files and credentials</h2>
        <p>Project paths are checked against the registered project, including symlink escapes. Reads, searches, project trees, and Git tools apply protections to credential patterns, Rynster configuration, active OAuth and audit storage, and sensitive directories including <code>.agent</code>, <code>.rynster</code>, <code>.aws</code>, <code>.ssh</code>, <code>.codex</code>, and <code>.agents</code>. The <code>protectedFiles</code> setting lets you add local paths or patterns.</p>
        <p>Patch operations reject symlink paths and linked targets, check the file and parent-directory identities before and after approval, and write through an atomic replacement. These measures reduce path-substitution and stale-edit risks. They are not kernel-level compare-and-swap protection against an unrestricted local process racing the final write.</p>
      </section>

      <section><h2>4. Command execution</h2>
        <p>Clients can request only configured check categories: typecheck, lint, test, format, and build. The executable and arguments come from your local configuration; clients cannot supply arbitrary executable names or arguments. Shell operators and substitutions in legacy command strings are refused. Rynster launches resolved executables without a shell, with a filtered environment, bounded output, closed stdin, and timeouts.</p>
        <p><strong>Project scripts still run with your operating-system user’s filesystem and network access.</strong> npm can run lifecycle scripts, and reviewed scripts may perform actions beyond the project folder. A worktree, argument allowlist, approval prompt, or environment filter does not create an OS sandbox. Review project code before approving a command.</p>
        <p>On Windows, stopping a command may not stop every child process it started. The package does not claim identical process-cleanup behavior on every operating system.</p>
      </section>

      <section><h2>5. Local and remote connections</h2>
        <p>Local stdio is intended for a client running on the same computer. HTTP MCP connections require an owner bearer token or a valid OAuth grant. Grants authorize one project and are bound to its canonical root identity. Origin checks reject null or untrusted origins, CORS does not use a wildcard, and credentials in URL queries are not accepted.</p>
        <p>Rynster does not include a tunnel. If you choose remote access, you must configure and protect your own HTTPS tunnel. Authentication remains required; a tunnel encrypts transport but does not replace Rynster’s access checks. Exposing a local service beyond your computer adds risk.</p>
        <p>Inspect and revoke client grants with <code>rynster oauth grants</code> and <code>rynster oauth revoke &lt;grant-id&gt;</code>. These local commands do not revoke the separate owner credential.</p>
      </section>

      <section><h2>6. Local storage and logs</h2>
        <p>Configuration and OAuth grants are stored in private local files using locking and atomic-save protections. OAuth grants default to <code>~/.rynster/oauth.json</code>; you can select another path. On Windows, private credential storage uses protected ACLs and denies access if those permissions cannot be established.</p>
        <p>The audit log is enabled by default at <code>.agent/audit.log</code> and can be configured. Routine request and audit records omit source contents, search strings, command arguments, URL queries, and tokens. Event metadata may still include operation status, identifiers, file paths, timestamps, and command check results. Project scripts can print secrets they read, so their output should be handled carefully.</p>
      </section>

      <section><h2>7. Verification and known limitations</h2>
        <p>The package security policy reports automated security tests on Linux and Windows. macOS is not yet verified. Earlier development builds were tested live with Claude and ChatGPT, but the renamed npm package has not been re-tested live; some client lifecycle checks are still pending. Automated tests do not establish live-client compatibility.</p>
        <p>Rynster does not provide an authenticated headless approval channel or an OS-isolated command executor. Its security policy was reviewed on October 23, 2026. Security fixes are provided for the latest <code>0.1.x</code> release.</p>
      </section>

      <section><h2>8. Report a vulnerability</h2>
        <p>Email <a href="mailto:baskar12ai@gmail.com?subject=Rynster%20security%20report">Baskar Ellangudi at baskar12ai@gmail.com</a> with the subject <code>Rynster security report</code>. Include the Rynster and Node.js versions, operating system and architecture, affected command or MCP tool, reproduction steps, expected and observed behavior, and potential impact.</p>
        <p>Use temporary files and dummy credentials where practical. Redact logs and configuration. Do not email tokens, owner credentials, client secrets, private keys, or private project files. Reports are acknowledged within five business days. You do not need access to the private source repository to report an issue.</p>
      </section>

      <p>Questions unrelated to vulnerabilities? Use the <Link href="/contact">contact form</Link>. For local data handling, see the <Link href="/privacy">privacy notice</Link>.</p>
    </div>
  </>;
}
