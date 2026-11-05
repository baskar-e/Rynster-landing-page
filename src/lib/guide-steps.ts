export type GuideStep = {
  id: string;
  title: string;
  body: string;
  commands?: string[];
  tip?: string;
  image: { src: string; alt: string; width: number; height: number };
};

// Edit text, commands and tips here. The page component renders everything from this list.
export const guideSteps: GuideStep[] = [
  {
    id: "step-1",
    title: "Register your project",
    body: "Point Rynster at the folder you want Claude to work on, then list your projects to confirm it was added.",
    commands: ["rynster register <project-name> <project-path>", "rynster projects"],
    image: { src: "/guide/screens/01-register.webp", alt: "Terminal showing the rynster register command succeeding and rynster projects listing the registered project", width: 1723, height: 228 },
  },
  {
    id: "step-2",
    title: "Start a public tunnel",
    body: "Claude needs a public HTTPS address to reach Rynster on your machine. In a new terminal, tunnel to Rynster’s local port and copy the https URL it prints.",
    commands: ["cloudflared tunnel --url http://127.0.0.1:3333"],
    tip: "Any tunnel provider works. This example uses Cloudflare’s free quick tunnel, which has no uptime guarantee and gives you a new URL every run. The port must match the MCP Endpoint Rynster prints in the next step.",
    image: { src: "/guide/screens/02-tunnel.webp", alt: "Terminal showing cloudflared creating a quick tunnel and printing its public URL", width: 1650, height: 326 },
  },
  {
    id: "step-3",
    title: "Start Rynster with that URL",
    body: "Pass the tunnel URL as --public-url. Rynster prints your Connector URL and permissions: Read and Search are allowed, Write, Tests, Lint and Git Commit ask first, Delete and Git Push are denied.",
    commands: ["rynster start <project-name> --public-url https://<your-tunnel>.trycloudflare.com"],
    image: { src: "/guide/screens/03-start.webp", alt: "Rynster startup banner listing MCP endpoint, connector URL and the permission policy for each action", width: 1723, height: 681 },
  },
  {
    id: "step-4",
    title: "Open Add custom connector",
    body: "In Claude, click +, then Add connector, then Add custom connector.",
    image: { src: "/guide/screens/04-add-custom-connector.webp", alt: "Claude plus menu open with Add connector expanded and Add custom connector highlighted", width: 756, height: 413 },
  },
  {
    id: "step-5",
    title: "Name it and paste the URL",
    body: "Enter Rynster as the name and paste the Connector URL from the previous step, which ends in /mcp. Then click Continue.",
    image: { src: "/guide/screens/05-name-and-url.webp", alt: "Add custom connector dialog with the name Rynster and the connector URL filled in", width: 1430, height: 1100 },
  },
  {
    id: "step-6",
    title: "Keep the default sign-in",
    body: "Leave “Sign in now” and “Use Claude’s published identity” selected. Both are auto-detected. Scroll down and click Add.",
    image: { src: "/guide/screens/06-sign-in.webp", alt: "Custom connector form with Sign in now and Use Claude’s published identity selected", width: 920, height: 950 },
  },
  {
    id: "step-7",
    title: "Authorize the connection",
    body: "Run the command below in your terminal, paste the owner token into the Rynster authorization page, then click Approve & Connect Claude.",
    commands: ["rynster token"],
    tip: "Never share or screenshot your owner token.",
    image: { src: "/guide/screens/07-authorize.webp", alt: "Rynster authorization page asking for the owner token with Approve & Connect Claude and Deny buttons", width: 1444, height: 1089 },
  },
  {
    id: "step-8",
    title: "Ask Claude to read your project",
    body: "Ask Claude to read your project using Rynster. Claude asks before using each tool: choose Allow once, or Always allow to skip the prompt next time.",
    image: { src: "/guide/screens/08-tool-request.webp", alt: "Claude asking permission to use the Project list tool from Rynster with Deny, Always allow and Allow once buttons", width: 1590, height: 989 },
  },
  {
    id: "step-9",
    title: "Claude reads the project",
    body: "Read and Search are allowed by default, so Claude can explore your files straight away and summarize what it finds.",
    image: { src: "/guide/screens/09-claude-reads.webp", alt: "Claude’s summary of the project after reading it through Rynster", width: 786, height: 750 },
  },
  {
    id: "step-10",
    title: "Ask for a change",
    body: "Now ask Claude to create a file. Write/Create is set to ask, so Rynster will pause and wait for your approval.",
    image: { src: "/guide/screens/10-ask-for-change.webp", alt: "User message asking Claude to create a text file in the project root", width: 790, height: 85 },
  },
  {
    id: "step-11",
    title: "Approve it in your terminal",
    body: "In the terminal running Rynster, review the request. Type y to approve, n to reject, d for the full diff, or a to allow writes for this session.",
    tip: "Nothing is written until you approve here.",
    image: { src: "/guide/screens/11-local-approval.webp", alt: "Rynster terminal prompt asking to approve a project.create request with y, n, d and a options", width: 1800, height: 335 },
  },
  {
    id: "step-12",
    title: "Claude confirms the change",
    body: "Once you approve, the file is written and Claude reports back that claude-message.txt was created in the project root.",
    image: { src: "/guide/screens/12-claude-confirms.webp", alt: "Claude confirming that claude-message.txt was created in the project root", width: 790, height: 268 },
  },
  {
    id: "step-13",
    title: "Check the result",
    body: "The new file appears in your editor. The U badge means it is untracked in git. Delete it or add it to .gitignore if you do not want it committed.",
    image: { src: "/guide/screens/13-file-created.webp", alt: "Editor showing the new claude-message.txt file containing a greeting, marked U for untracked", width: 751, height: 430 },
  },
];
