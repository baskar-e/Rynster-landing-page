"use client";
import Link from "next/link";
import { useState } from "react";

const links=[["Features","/features"],["Documentation","/docs"],["Media","/media"],["Security","/security"],["Contact","/contact"]];
export default function MobileNavigation(){const [open,setOpen]=useState(false);return <div className="mobile-nav"><button className="mobile-menu-button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open?"Close navigation menu":"Open navigation menu"} onClick={()=>setOpen(!open)}><span/><span/><span/></button>{open&&<nav id="mobile-menu" aria-label="Mobile navigation">{links.map(([label,href])=><Link href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}</div>}
