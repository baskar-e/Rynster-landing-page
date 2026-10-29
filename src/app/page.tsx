import Link from "next/link";

const features = [
  ["⌕", "Explore your project", "Find files, understand structure, and inspect the work already in your repository."],
  ["⌘", "Keep changes reviewable", "See proposed edits and decide what should be written to your local project."],
  ["◈", "Set the boundaries", "Use project permissions and approval controls that fit the way you work."],
  ["↺", "Stay in your workflow", "Connect through MCP with a compatible AI client you already use."],
  ["⌥", "Know what changed", "Review Git changes and keep a clear view of your working tree."],
  ["⌁", "Keep work on your machine", "Rynster Local is designed to work with your local development projects."],
];

export default function Home() {
  return <>
    <section className="hero"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] hero-grid"><div>
      <div className="eyebrow">A local bridge for your AI workflow</div>
      <h1>Your AI.<br />Your code.<br /><em>Your call.</em></h1>
      <p className="hero-copy">Rynster connects compatible AI clients to your local development projects through MCP, with configurable permissions and review before sensitive changes.</p>
      <div className="hero-actions"><Link className="button button-dark" href="/docs/installation">Get started</Link><Link className="text-link" href="#how-it-works">See how it works <span>↓</span></Link></div>
      <div className="hero-footnote"><span className="dot">●</span> Local-first&nbsp; · &nbsp;Bring your own AI client</div>
    </div><div className="terminal-wrap" aria-label="Illustration of a Rynster local project session"><div className="terminal">
      <div className="terminal-top"><span className="terminal-dot"/><span className="terminal-dot"/><span className="terminal-dot"/><span className="terminal-title">rynster — local session</span></div>
      <div className="terminal-body"><div className="term-muted">$ rynster register my-app ~/code/my-app</div><div className="term-green">✓ Project registered</div><div className="term-indent term-muted">name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;my-app</div><div className="term-indent term-muted">directory&nbsp; ~/code/my-app</div><div className="terminal-rule"/><div><span className="term-muted">$ </span><span className="term-white">rynster start my-app --stdio</span></div><div className="term-green">● MCP server ready</div><div className="term-indent term-muted">waiting for your AI client...</div><div className="terminal-rule"/><div className="term-muted">Proposed change <span className="term-white">src/app.ts</span></div><div className="term-green">+ Add request validation</div><div className="term-muted">Review the diff before applying</div></div>
      <div className="terminal-footer"><span>PROJECT <b>my-app</b></span><span>SESSION <b>LOCAL</b></span></div>
    </div></div></div></section>
    <div className="trusted"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] trusted-inner"><span className="trusted-label">Made for developers who value</span><span className="trusted-item">LOCAL CONTROL</span><span className="trusted-item">CLEAR APPROVALS</span><span className="trusted-item">OPEN WORKFLOWS</span><span className="trusted-item">YOUR CHOICE OF AI</span></div></div>
    <section className="section" id="how-it-works"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]"><div className="section-head"><div><div className="section-kicker">A straightforward workflow</div><h2>From a local project<br />to a thoughtful change.</h2></div><p className="section-intro">Rynster sits between your AI client and your project, helping make the work visible and reviewable.</p></div>
      <div className="steps">{[["01","Connect a project","Choose the local project you want to work with and set its permissions."],["02","Pair your AI client","Connect a compatible MCP client using the setup steps in the documentation."],["03","Review the work","Inspect proposed changes and approve operations according to your settings."]].map(([n,title,body],i)=><article className="step" key={n}><div className="step-num">STEP {n}</div><div className="step-icon">{["⌂","↔","✓"][i]}</div><h3>{title}</h3><p>{body}</p></article>)}</div>
    </div></section>
    <section className="section section-white"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]"><div className="section-head"><div><div className="section-kicker">A capable local toolkit</div><h2>Useful context.<br />Changes you can review.</h2></div><p className="section-intro">Give your AI client a better view of the project, while keeping yourself in the loop.</p></div>
      <div className="feature-grid">{features.map(([icon,title,body])=><article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{body}</p></article>)}</div>
    </div></section>
    <section className="section"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]"><div className="split-panel"><div className="split-copy"><div className="section-kicker">Built with clear boundaries</div><h2>Local control is useful.<br />It is not a sandbox.</h2><p>Rynster provides local project controls and approval points. It does not isolate arbitrary project scripts or make every operation risk-free. Understand the boundaries before connecting a project.</p><Link className="text-link" href="/docs/security">Read the security guide <span>→</span></Link></div><div className="security-visual" aria-hidden="true"><div className="orbit"><div className="orbit-core">r.</div><span className="orbit-chip chip-one">YOUR PROJECT</span><span className="orbit-chip chip-two">AI CLIENT</span><span className="orbit-chip chip-three">YOUR RULES</span><span className="orbit-chip chip-four">REVIEW</span></div></div></div></div></section>
    <section className="cta-band"><div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] cta-inner"><div><h2>Ready to bring your AI into the project?</h2><p>Start with installation, then connect a compatible client.</p></div><Link className="button button-dark" href="/docs/installation">Read the quick start</Link></div></section>
  </>;
}
