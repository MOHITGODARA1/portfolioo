import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

// Initialize EmailJS
emailjs.init("SLU7axNetQo_WJo-3");

/* ══════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════ */
const C = {
  bg:        "#080808",
  bg1:       "#0f0f0f",
  bg2:       "#161616",
  bg3:       "#1e1e1e",
  border:    "#2a2a2a",
  border2:   "#333",
  text:      "#ededeb",
  muted:     "#666",
  muted2:    "#888",
  accent:    "#c8a96e",
  accentDim: "#7a6030",
  blue:      "#4a9eff",
  green:     "#4ec9a0",
};
const F = {
  serif: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif",
  mono:  "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  sans:  "'Plus Jakarta Sans', 'Helvetica Neue', sans-serif",
};

/* ══════════════════════════════════════════════
   BLOG DATA  (full articles)
══════════════════════════════════════════════ */
const BLOGS = [
  {
    id: 1,
    tag: "Backend",
    tagColor: C.green,
    date: "Mar 12, 2026",
    readTime: "7 min",
    title: "Load Testing Node.js APIs with k6 — What I Learned",
    excerpt: "How I reduced API latency from ~460ms to ~350ms in UniLink by profiling bottlenecks, tuning MongoDB indexes, and stress-testing under 100 virtual users.",
    content: [
      { type: "h2", text: "The Problem" },
      { type: "p", text: "When UniLink went live, the first real stress test revealed something uncomfortable: our chat endpoint was averaging 460ms under load. For a real-time platform, that's a disaster. Here's how I diagnosed and fixed it." },
      { type: "h2", text: "Setting Up k6" },
      { type: "p", text: "k6 is a Go-based load testing tool that lets you write test scripts in JavaScript. This made it a natural fit for a Node.js stack — same mental model, zero context switching." },
      { type: "code", lang: "javascript", text: `import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,           // 100 virtual users
  duration: '30s',    // for 30 seconds
};

export default function () {
  const res = http.get('https://api.unilink.app/messages');
  check(res, {
    'status 200': (r) => r.status === 200,
    'latency < 400ms': (r) => r.timings.duration < 400,
  });
  sleep(0.5);
}` },
      { type: "h2", text: "Finding the Bottleneck" },
      { type: "p", text: "After running the test, the flamegraph pointed straight at a MongoDB query on the messages collection. We were doing a full collection scan because we lacked a compound index on {roomId, createdAt}. A single line of schema definition cut query time by 65%." },
      { type: "code", lang: "javascript", text: `// Before: no index, full collection scan
// After:
MessageSchema.index({ roomId: 1, createdAt: -1 });` },
      { type: "h2", text: "Results" },
      { type: "p", text: "After indexing + enabling connection pooling (maxPoolSize: 20) and switching from synchronous bcrypt to async, p95 latency dropped from 460ms to 340ms. Zero failures across 100 VUs for 30 seconds." },
      { type: "p", text: "The lesson: instrument before you optimise. k6's metrics dashboard told me exactly where to look — no guessing required." },
    ],
  },
  {
    id: 2,
    tag: "AI / LLM",
    tagColor: C.accent,
    date: "Feb 28, 2026",
    readTime: "9 min",
    title: "Building DocGen AI — Using AST + GPT to Auto-Document Code",
    excerpt: "How I combined Python AST parsing with the ChatGPT API to generate structured architecture docs for any GitHub repository — cutting manual effort by 70%.",
    content: [
      { type: "h2", text: "Why Auto-Documentation?" },
      { type: "p", text: "Every developer knows the pain: you clone a repo, stare at 40 files, and have zero idea where to start. DocGen AI solves this by generating architecture summaries and function-level docs automatically." },
      { type: "h2", text: "The Architecture" },
      { type: "p", text: "The pipeline has three stages: (1) clone + parse the repository with Python's AST module, (2) serialize the syntax tree into a structured JSON payload, (3) pass that payload to GPT-4 with a carefully crafted prompt." },
      { type: "code", lang: "python", text: `import ast
import json

def parse_file(filepath):
    with open(filepath, 'r') as f:
        source = f.read()

    tree = ast.parse(source)
    result = { 'functions': [], 'classes': [], 'imports': [] }

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            result['functions'].append({
                'name': node.name,
                'args': [a.arg for a in node.args.args],
                'lineno': node.lineno,
                'docstring': ast.get_docstring(node)
            })
        elif isinstance(node, ast.ClassDef):
            result['classes'].append({'name': node.name})

    return result` },
      { type: "h2", text: "The GPT Prompt Strategy" },
      { type: "p", text: "The key insight was treating GPT-4 as a senior architect, not a documentation generator. The prompt asks it to reason about module relationships and architectural decisions, not just describe what a function does." },
      { type: "p", text: "This produced documentation that actually answers 'why does this exist' rather than 'what does this do' — a meaningful distinction when onboarding to an unfamiliar codebase." },
    ],
  },
  {
    id: 3,
    tag: "DSA",
    tagColor: C.blue,
    date: "Jan 15, 2026",
    readTime: "5 min",
    title: "How Solving 250+ LeetCode Problems Changed How I Write Code",
    excerpt: "Reaching a 1657 rating wasn't about grinding — it was about pattern recognition. Here are the mental models I built and how they show up in production code.",
    content: [
      { type: "h2", text: "The Misunderstood Purpose of LeetCode" },
      { type: "p", text: "Most developers treat LeetCode as interview prep — a box to tick. I treated it as a mental workout. The goal wasn't to memorise solutions; it was to build instincts for recognising problem structure." },
      { type: "h2", text: "Pattern 1: Sliding Window" },
      { type: "p", text: "Once you understand sliding window, you stop writing O(n²) loops for subarray problems. More importantly, you start recognising it in the wild — like when optimising a rate limiter that tracks requests in a time window." },
      { type: "code", lang: "javascript", text: `// Rate limiter using sliding window
function isAllowed(requests, windowMs, limit, now) {
  // Remove requests outside the window
  while (requests.length && requests[0] < now - windowMs) {
    requests.shift();
  }
  return requests.length < limit;
}` },
      { type: "h2", text: "Pattern 2: Two Pointers" },
      { type: "p", text: "I now instinctively reach for two pointers whenever I'm working with sorted data or need to find pairs. This shows up when de-duplicating sorted arrays from MongoDB aggregations." },
      { type: "h2", text: "The Real Takeaway" },
      { type: "p", text: "After 250 problems, my code review comments changed. I started asking 'can this be O(n log n) instead of O(n²)?' — not because I was optimising prematurely, but because I could see the pattern. That instinct is worth more than any specific solution." },
    ],
  },
  {
    id: 4,
    tag: "Architecture",
    tagColor: "#ce9178",
    date: "Dec 4, 2025",
    readTime: "6 min",
    title: "Designing MongoDB Schemas for Real-Time Collaboration Apps",
    excerpt: "From UniLink's schema decisions — embedding vs referencing, efficient indexing, and why I chose MongoDB for this particular use case.",
    content: [
      { type: "h2", text: "The Core Question: Embed or Reference?" },
      { type: "p", text: "In a collaboration app like UniLink, the most common query is 'fetch all messages in a room, sorted by time'. This shaped every schema decision. If your query pattern is known and consistent, embedding often wins." },
      { type: "h2", text: "The Message Schema" },
      { type: "code", lang: "javascript", text: `const MessageSchema = new Schema({
  roomId:    { type: ObjectId, ref: 'Room', index: true },
  sender: {
    _id:     { type: ObjectId, ref: 'User' },
    name:    String,
    avatar:  String,   // denormalised for read speed
  },
  content:   { type: String, required: true },
  type:      { type: String, enum: ['text','image','file'] },
  createdAt: { type: Date,   default: Date.now },
  readBy:    [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true });

// Compound index — the most critical optimisation
MessageSchema.index({ roomId: 1, createdAt: -1 });` },
      { type: "h2", text: "Why Denormalise the Sender?" },
      { type: "p", text: "Embedding the sender's name and avatar directly into each message avoids a join on every message read. Yes, if a user changes their avatar, old messages show the old one — but in a chat context, that's acceptable. Performance > perfect consistency." },
      { type: "p", text: "The rule I follow: denormalise data that is read far more often than it is written, and where stale data is acceptable. For usernames and avatars in chat, this holds true." },
    ],
  },
];

/* ══════════════════════════════════════════════
   PREMIUM DEVELOPER AVATAR SVG
   Flat semi-3D — professional, clean, no cartoon
══════════════════════════════════════════════ */
function DeveloperAvatar() {
  return (
    <svg
      viewBox="0 0 480 560"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {/* Subtle ambient shadows */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35"/>
        </filter>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2"/>
        </filter>
        {/* Skin gradient — warm neutral */}
        <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8b898"/>
          <stop offset="100%" stopColor="#d49878"/>
        </linearGradient>
        {/* Hoodie gradient — deep slate */}
        <linearGradient id="hoodie" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#1e2535"/>
          <stop offset="100%" stopColor="#141b28"/>
        </linearGradient>
        {/* Laptop lid gradient */}
        <linearGradient id="laptopLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#232323"/>
          <stop offset="100%" stopColor="#181818"/>
        </linearGradient>
        {/* Screen glow */}
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a3a5c" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0"/>
        </radialGradient>
        {/* Hair */}
        <linearGradient id="hair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1410"/>
          <stop offset="100%" stopColor="#0d0c0a"/>
        </linearGradient>
        {/* Chair back */}
        <linearGradient id="chair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </linearGradient>
      </defs>

      {/* ── BACKGROUND TECH ELEMENTS ── */}
      {/* Subtle grid dots */}
      {Array.from({length: 8}).map((_, r) =>
        Array.from({length: 10}).map((_, c) => (
          <circle key={`${r}-${c}`} cx={20 + c * 50} cy={20 + r * 65} r="1.2"
            fill="#2a2a2a" opacity="0.6"/>
        ))
      )}
      {/* Corner bracket decorations */}
      <path d="M18 18 L18 34 M18 18 L34 18" stroke="#3a3a3a" strokeWidth="1.5" fill="none"/>
      <path d="M462 18 L462 34 M462 18 L446 18" stroke="#3a3a3a" strokeWidth="1.5" fill="none"/>
      <path d="M18 542 L18 526 M18 542 L34 542" stroke="#3a3a3a" strokeWidth="1.5" fill="none"/>
      <path d="M462 542 L462 526 M462 542 L446 542" stroke="#3a3a3a" strokeWidth="1.5" fill="none"/>

      {/* ── DESK SURFACE ── */}
      <ellipse cx="240" cy="500" rx="200" ry="22" fill="#111" opacity="0.6"/>
      <rect x="50" y="470" width="380" height="16" rx="3" fill="#141414"/>
      <rect x="50" y="470" width="380" height="4" rx="2" fill="#1e1e1e"/>

      {/* ── CHAIR BACK ── */}
      <rect x="170" y="330" width="18" height="160" rx="4" fill="url(#chair)"/>
      <rect x="292" y="330" width="18" height="160" rx="4" fill="url(#chair)"/>
      <rect x="160" y="280" width="160" height="90" rx="12" fill="url(#chair)" filter="url(#shadow)"/>
      <rect x="165" y="285" width="150" height="80" rx="10" fill="#252525"/>

      {/* ── LAPTOP ── */}
      {/* Laptop body / trackpad area */}
      <rect x="100" y="455" width="280" height="20" rx="4" fill="#1e1e1e" filter="url(#softShadow)"/>
      <rect x="102" y="457" width="276" height="16" rx="3" fill="#242424"/>
      {/* Trackpad */}
      <rect x="200" y="460" width="80" height="10" rx="3" fill="#1a1a1a"/>

      {/* Laptop screen hinge */}
      <rect x="108" y="452" width="264" height="6" rx="2" fill="#1a1a1a"/>

      {/* Laptop screen frame */}
      <rect x="94" y="296" width="292" height="164" rx="10" fill="url(#laptopLid)" filter="url(#shadow)"/>
      {/* Screen bezel */}
      <rect x="100" y="302" width="280" height="152" rx="7" fill="#0d0d0d"/>
      {/* Screen */}
      <rect x="106" y="308" width="268" height="140" rx="4" fill="#0a1520"/>
      {/* Screen ambient glow */}
      <rect x="106" y="308" width="268" height="140" rx="4" fill="url(#screenGlow)"/>

      {/* ── IDE CODE ON SCREEN ── */}
      {/* VSCode-style editor */}
      {/* Left sidebar */}
      <rect x="106" y="308" width="36" height="140" rx="4" fill="#0c1018"/>
      {/* Sidebar icons */}
      {[320, 336, 352, 368, 390].map((y, i) => (
        <rect key={y} x="116" y={y} width="16" height="16" rx="3"
          fill={i === 0 ? "#2a3a5a" : "#151820"} opacity="0.9"/>
      ))}
      {/* Editor lines - realistic code */}
      {/* Line numbers */}
      {[316, 325, 334, 343, 352, 361, 370, 379, 388, 397, 406, 415, 424, 433].map((y, i) => (
        <text key={y} x="149" y={y} fill="#3a4050" fontSize="5.5"
          fontFamily="monospace" textAnchor="end">{i + 1}</text>
      ))}
      {/* Code tokens — realistic coloring */}
      <rect x="153" y="311" width="28" height="4.5" rx="1" fill="#569cd6" opacity=".85"/> {/* keyword */}
      <rect x="183" y="311" width="38" height="4.5" rx="1" fill="#4ec9b0" opacity=".85"/> {/* function */}
      <rect x="223" y="311" width="8"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="233" y="311" width="22" height="4.5" rx="1" fill="#9cdcfe" opacity=".8"/>
      <rect x="257" y="311" width="8"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="267" y="311" width="40" height="4.5" rx="1" fill="#ce9178" opacity=".8"/>

      <rect x="157" y="320" width="22" height="4.5" rx="1" fill="#c586c0" opacity=".85"/>
      <rect x="181" y="320" width="30" height="4.5" rx="1" fill="#4fc1ff" opacity=".8"/>
      <rect x="213" y="320" width="6"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="221" y="320" width="50" height="4.5" rx="1" fill="#ce9178" opacity=".75"/>

      <rect x="161" y="329" width="18" height="4.5" rx="1" fill="#4fc1ff" opacity=".8"/>
      <rect x="181" y="329" width="4"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="187" y="329" width="55" height="4.5" rx="1" fill="#9cdcfe" opacity=".8"/>
      <rect x="244" y="329" width="4"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>

      <rect x="161" y="338" width="30" height="4.5" rx="1" fill="#4ec9b0" opacity=".8"/>
      <rect x="193" y="338" width="4"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="199" y="338" width="20" height="4.5" rx="1" fill="#569cd6" opacity=".8"/>
      <rect x="221" y="338" width="40" height="4.5" rx="1" fill="#ce9178" opacity=".7"/>

      <rect x="153" y="347" width="8"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>

      {/* Empty line */}
      <rect x="153" y="356" width="55" height="4.5" rx="1" fill="#569cd6" opacity=".8"/>
      <rect x="210" y="356" width="30" height="4.5" rx="1" fill="#d4d4d4" opacity=".6"/>

      <rect x="157" y="365" width="25" height="4.5" rx="1" fill="#c586c0" opacity=".85"/>
      <rect x="184" y="365" width="45" height="4.5" rx="1" fill="#4fc1ff" opacity=".8"/>

      <rect x="161" y="374" width="35" height="4.5" rx="1" fill="#9cdcfe" opacity=".8"/>
      <rect x="198" y="374" width="4"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>
      <rect x="204" y="374" width="60" height="4.5" rx="1" fill="#ce9178" opacity=".7"/>

      <rect x="153" y="383" width="8"  height="4.5" rx="1" fill="#d4d4d4" opacity=".7"/>

      {/* Cursor */}
      <rect x="153" y="392" width="2" height="7" rx="0.5" fill="#aeafad" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0;0.9" dur="1.1s" repeatCount="indefinite"/>
      </rect>

      {/* Status bar */}
      <rect x="106" y="442" width="268" height="6" rx="0" fill="#007acc" opacity="0.8"/>
      <rect x="112" y="443.5" width="30" height="3" rx="1" fill="rgba(255,255,255,.4)"/>
      <rect x="310" y="443.5" width="25" height="3" rx="1" fill="rgba(255,255,255,.3)"/>

      {/* Apple logo hint */}
      <ellipse cx="240" cy="280" rx="10" ry="11" fill="#1a1a1a"/>
      <ellipse cx="240" cy="278" rx="7" ry="8" fill="#232323"/>

      {/* ── BODY / HOODIE ── */}
      {/* Main torso */}
      <path d="M138 440 C130 410 120 390 115 370 L148 350 L168 390 L240 400 L312 390 L332 350 L365 370 C360 390 350 410 362 440 Z"
        fill="url(#hoodie)" filter="url(#shadow)"/>
      {/* Hoodie front panel */}
      <path d="M210 395 L240 405 L270 395 L275 440 L205 440 Z" fill="#192030" opacity="0.5"/>
      {/* Hoodie pocket */}
      <rect x="200" y="415" width="80" height="28" rx="4" fill="#162030" opacity="0.6"/>
      <line x1="240" y1="415" x2="240" y2="443" stroke="#1e2a3a" strokeWidth="1.5"/>
      {/* Hoodie drawstrings */}
      <path d="M228 400 C224 412 222 425 220 440" stroke="#1a2535" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M252 400 C256 412 258 425 260 440" stroke="#1a2535" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Hood back */}
      <path d="M170 290 Q185 270 240 265 Q295 270 310 290 Q300 310 240 315 Q180 310 170 290Z"
        fill="#1a2030" opacity="0.7"/>
      {/* Collar area */}
      <path d="M195 350 Q215 370 240 373 Q265 370 285 350 L280 340 Q260 355 240 358 Q220 355 200 340Z"
        fill="#162030"/>

      {/* ── ARMS ── */}
      {/* Left arm */}
      <path d="M138 440 C110 430 90 420 80 400 C72 382 75 365 85 355 L105 365 C96 372 95 383 100 395 C108 408 130 418 148 430Z"
        fill="url(#hoodie)"/>
      {/* Left hand on keyboard */}
      <ellipse cx="85" cy="462" rx="26" ry="14" fill="url(#skin)" transform="rotate(-8,85,462)" filter="url(#softShadow)"/>
      {/* Left fingers */}
      <rect x="64" y="453" width="10" height="16" rx="5" fill="url(#skin)" transform="rotate(-12,64,453)"/>
      <rect x="77" y="450" width="10" height="17" rx="5" fill="url(#skin)" transform="rotate(-6,77,450)"/>
      <rect x="90" y="449" width="10" height="17" rx="5" fill="url(#skin)" transform="rotate(0,90,449)"/>
      <rect x="103" y="451" width="9"  height="16" rx="4.5" fill="url(#skin)" transform="rotate(6,103,451)"/>

      {/* Right arm */}
      <path d="M362 440 C390 430 410 420 420 400 C428 382 425 365 415 355 L395 365 C404 372 405 383 400 395 C392 408 370 418 352 430Z"
        fill="url(#hoodie)"/>
      {/* Right hand on keyboard */}
      <ellipse cx="395" cy="462" rx="26" ry="14" fill="url(#skin)" transform="rotate(8,395,462)" filter="url(#softShadow)"/>
      {/* Right fingers */}
      <rect x="376" y="451" width="9"  height="16" rx="4.5" fill="url(#skin)" transform="rotate(-6,376,451)"/>
      <rect x="389" y="449" width="10" height="17" rx="5" fill="url(#skin)" transform="rotate(0,389,449)"/>
      <rect x="402" y="450" width="10" height="17" rx="5" fill="url(#skin)" transform="rotate(6,402,450)"/>
      <rect x="415" y="453" width="10" height="16" rx="5" fill="url(#skin)" transform="rotate(12,415,453)"/>

      {/* ── NECK ── */}
      <rect x="222" y="295" width="36" height="58" rx="10" fill="url(#skin)"/>
      {/* Neck shadow */}
      <path d="M222 335 Q240 342 258 335 L258 353 Q240 360 222 353Z" fill="#c07858" opacity="0.25"/>

      {/* ── HEAD ── */}
      {/* Head shape */}
      <ellipse cx="240" cy="210" rx="74" ry="84" fill="url(#skin)" filter="url(#shadow)"/>
      {/* Jaw taper */}
      <path d="M175 230 Q180 280 240 292 Q300 280 305 230" fill="url(#skin)"/>
      {/* Jaw shadow */}
      <path d="M190 265 Q215 278 240 280 Q265 278 290 265" fill="#c07858" opacity="0.12"/>

      {/* Ear left */}
      <ellipse cx="167" cy="215" rx="11" ry="15" fill="#d4906e"/>
      <ellipse cx="169" cy="215" rx="7" ry="10" fill="#c07858"/>
      {/* Ear inner */}
      <path d="M165 207 Q162 215 165 223" stroke="#b06848" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Ear right */}
      <ellipse cx="313" cy="215" rx="11" ry="15" fill="#d4906e"/>
      <ellipse cx="311" cy="215" rx="7" ry="10" fill="#c07858"/>
      <path d="M315 207 Q318 215 315 223" stroke="#b06848" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* ── HAIR ── */}
      {/* Main hair mass */}
      <path d="M170 195 Q172 130 240 120 Q308 130 310 195 Q300 155 240 148 Q180 155 170 195Z"
        fill="url(#hair)"/>
      {/* Hair top volume */}
      <path d="M176 175 Q182 118 240 112 Q298 118 304 175 Q290 138 240 133 Q190 138 176 175Z"
        fill="#131210"/>
      {/* Side hair left */}
      <path d="M170 190 L166 240 Q168 248 175 248 L178 210 Z" fill="url(#hair)"/>
      {/* Side hair right */}
      <path d="M310 190 L314 240 Q312 248 305 248 L302 210 Z" fill="url(#hair)"/>
      {/* Hair texture lines */}
      <path d="M195 130 Q220 118 240 115" stroke="#0d0c0a" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M260 118 Q280 122 298 135" stroke="#0d0c0a" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>

      {/* ── EYEBROWS ── */}
      {/* Left eyebrow — slight arch, confident */}
      <path d="M190 182 Q208 174 222 178" stroke="#1a1208" strokeWidth="4"
        strokeLinecap="round" fill="none"/>
      <path d="M190 182 Q208 174 222 178" stroke="#2a1e10" strokeWidth="2"
        strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Right eyebrow */}
      <path d="M258 178 Q272 174 290 182" stroke="#1a1208" strokeWidth="4"
        strokeLinecap="round" fill="none"/>
      <path d="M258 178 Q272 174 290 182" stroke="#2a1e10" strokeWidth="2"
        strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* ── EYES ── */}
      {/* Eye whites */}
      <ellipse cx="207" cy="205" rx="18" ry="13" fill="white"/>
      <ellipse cx="273" cy="205" rx="18" ry="13" fill="white"/>
      {/* Eye socket shadow */}
      <ellipse cx="207" cy="200" rx="18" ry="8" fill="#e0a880" opacity="0.2"/>
      <ellipse cx="273" cy="200" rx="18" ry="8" fill="#e0a880" opacity="0.2"/>
      {/* Iris */}
      <circle cx="208" cy="206" r="9" fill="#2a1e14"/>
      <circle cx="274" cy="206" r="9" fill="#2a1e14"/>
      {/* Iris color ring */}
      <circle cx="208" cy="206" r="7.5" fill="#3d2e1e"/>
      <circle cx="274" cy="206" r="7.5" fill="#3d2e1e"/>
      {/* Pupil */}
      <circle cx="209" cy="207" r="5" fill="#0a0806"/>
      <circle cx="275" cy="207" r="5" fill="#0a0806"/>
      {/* Eye shine — dual catch lights */}
      <circle cx="213" cy="203" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="211" cy="208" r="1.2" fill="white" opacity="0.4"/>
      <circle cx="279" cy="203" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="277" cy="208" r="1.2" fill="white" opacity="0.4"/>
      {/* Upper lash line */}
      <path d="M190 198 Q207 193 224 198" stroke="#1a1210" strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      <path d="M256 198 Q273 193 290 198" stroke="#1a1210" strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      {/* Lower lash */}
      <path d="M192 212 Q207 216 222 212" stroke="#b07858" strokeWidth="1"
        fill="none" opacity="0.35"/>
      <path d="M258 212 Q273 216 288 212" stroke="#b07858" strokeWidth="1"
        fill="none" opacity="0.35"/>

      {/* ── NOSE ── */}
      <path d="M234 218 Q230 236 226 242 Q233 246 240 247 Q247 246 254 242 Q250 236 246 218Z"
        fill="#c07858" opacity="0.28"/>
      {/* Nostril shadows */}
      <ellipse cx="229" cy="242" rx="6" ry="4" fill="#a86040" opacity="0.3" transform="rotate(-15,229,242)"/>
      <ellipse cx="251" cy="242" rx="6" ry="4" fill="#a86040" opacity="0.3" transform="rotate(15,251,242)"/>
      {/* Nose bridge highlight */}
      <path d="M238 208 Q239 222 238 234" stroke="#e0b890" strokeWidth="1"
        fill="none" opacity="0.3" strokeLinecap="round"/>

      {/* ── MOUTH ── */}
      {/* Lips — slight confident smile */}
      <path d="M214 262 Q227 272 240 273 Q253 272 266 262" stroke="#a86050" strokeWidth="3"
        strokeLinecap="round" fill="none"/>
      {/* Upper lip line */}
      <path d="M218 260 Q226 256 233 258 Q240 260 247 258 Q254 256 262 260"
        stroke="#904838" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Lip fill */}
      <path d="M218 262 Q240 272 262 262 Q255 270 240 271 Q225 270 218 262Z"
        fill="#c07060" opacity="0.2"/>
      {/* Smile dimples */}
      <circle cx="212" cy="263" r="2" fill="#b07060" opacity="0.2"/>
      <circle cx="268" cy="263" r="2" fill="#b07060" opacity="0.2"/>

      {/* ── GLASSES ── */}
      {/* Glass frames — thin, modern, rectangular */}
      <rect x="185" y="196" width="46" height="28" rx="8" fill="none"
        stroke="#252525" strokeWidth="2.8"/>
      <rect x="249" y="196" width="46" height="28" rx="8" fill="none"
        stroke="#252525" strokeWidth="2.8"/>
      {/* Bridge */}
      <path d="M231 209 Q240 211 249 209" stroke="#252525" strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      {/* Temple left */}
      <path d="M185 208 Q172 210 167 215" stroke="#252525" strokeWidth="2.2"
        strokeLinecap="round" fill="none"/>
      {/* Temple right */}
      <path d="M295 208 Q308 210 313 215" stroke="#252525" strokeWidth="2.2"
        strokeLinecap="round" fill="none"/>
      {/* Lens tint — very subtle blue */}
      <rect x="186" y="197" width="44" height="26" rx="7" fill="#4a9eff" opacity="0.04"/>
      <rect x="250" y="197" width="44" height="26" rx="7" fill="#4a9eff" opacity="0.04"/>
      {/* Lens reflection */}
      <path d="M190 200 L196 205" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.15"/>
      <path d="M254 200 L260 205" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.15"/>

      {/* ── HEADPHONES (around neck) ── */}
      <path d="M178 268 Q180 240 178 225" stroke="#2a2a2a" strokeWidth="6"
        strokeLinecap="round" fill="none"/>
      <path d="M302 268 Q300 240 302 225" stroke="#2a2a2a" strokeWidth="6"
        strokeLinecap="round" fill="none"/>
      <path d="M178 225 Q190 205 240 200 Q290 205 302 225" stroke="#2a2a2a"
        strokeWidth="5" fill="none"/>
      {/* Ear cups */}
      <rect x="168" y="255" width="20" height="28" rx="8" fill="#222"/>
      <rect x="170" y="257" width="16" height="24" rx="6" fill="#2a2a2a"/>
      <rect x="292" y="255" width="20" height="28" rx="8" fill="#222"/>
      <rect x="294" y="257" width="16" height="24" rx="6" fill="#2a2a2a"/>

      {/* ── COFFEE MUG ── */}
      <rect x="40" y="440" width="38" height="32" rx="5" fill="#1e1e1e"/>
      <rect x="42" y="442" width="34" height="28" rx="4" fill="#242424"/>
      {/* Mug handle */}
      <path d="M78 448 Q92 448 92 456 Q92 464 78 464"
        fill="none" stroke="#1e1e1e" strokeWidth="5" strokeLinecap="round"/>
      <path d="M78 449 Q89 449 89 456 Q89 463 78 463"
        fill="none" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round"/>
      {/* Coffee liquid */}
      <rect x="43" y="443" width="32" height="10" rx="3" fill="#1a1208"/>
      {/* Steam */}
      <path d="M52 438 C50 430 54 424 52 416" stroke="#3a3a3a" strokeWidth="1.8"
        strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="d" values="M52 438 C50 430 54 424 52 416;M52 438 C54 430 50 424 52 416;M52 438 C50 430 54 424 52 416" dur="2.2s" repeatCount="indefinite"/>
      </path>
      <path d="M60 436 C58 427 62 421 60 413" stroke="#3a3a3a" strokeWidth="1.8"
        strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.8s" repeatCount="indefinite"/>
      </path>
      {/* Mug label */}
      <rect x="48" y="453" width="22" height="12" rx="2" fill="#1a1a1a"/>
      <rect x="50" y="455" width="14" height="2" rx="1" fill="#3a6a9a" opacity="0.6"/>
      <rect x="50" y="459" width="10" height="2" rx="1" fill="#3a6a9a" opacity="0.4"/>

      {/* ── PHONE (on desk) ── */}
      <rect x="400" y="443" width="26" height="44" rx="5" fill="#1a1a1a"/>
      <rect x="402" y="445" width="22" height="40" rx="4" fill="#0d0d0d"/>
      <rect x="404" y="447" width="18" height="32" rx="2" fill="#0a1520"/>
      {/* Phone screen content - small app UI */}
      {[450, 456, 462, 468, 474].map(y => (
        <rect key={y} x="405" y={y} width={y === 450 ? 14 : 10} height="3" rx="1.5"
          fill={y === 450 ? "#4a9eff" : "#2a3040"} opacity="0.7"/>
      ))}
      {/* Phone notch */}
      <rect x="409" y="445" width="8" height="3" rx="1.5" fill="#080808"/>
      {/* Home indicator */}
      <rect x="410" y="482" width="6" height="2" rx="1" fill="#2a2a2a"/>

      {/* ── SUBTLE GLOW from screen on face ── */}
      <ellipse cx="240" cy="260" rx="110" ry="80" fill="#1a3a5c" opacity="0.04"/>

      {/* ── FLOOR SHADOW ── */}
      <ellipse cx="240" cy="530" rx="170" ry="18" fill="#000" opacity="0.35"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   PROJECT SCREENSHOT SVG
══════════════════════════════════════════════ */
function ProjectShot({ title, idx }) {
  const acs = [C.accent, C.green, C.blue];
  const ac = acs[idx % 3];
  return (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="560" height="300" fill="#0d1117"/>
      {/* Browser bar */}
      <rect width="560" height="28" fill="#161b22"/>
      <circle cx="14" cy="14" r="4.5" fill="#e05a5a"/>
      <circle cx="27" cy="14" r="4.5" fill="#e0aa5a"/>
      <circle cx="40" cy="14" r="4.5" fill="#5ae05a" opacity=".7"/>
      <rect x="60" y="7" width="400" height="14" rx="7" fill="#0d1117"/>
      <text x="260" y="18" textAnchor="middle" fill="#4a5568" fontSize="8" fontFamily="monospace">
        {title.toLowerCase().replace(/\s+/g, '-')}.vercel.app
      </text>
      {/* Sidebar */}
      <rect x="0" y="28" width="160" height="272" fill="#0a0f18"/>
      <rect x="0" y="28" width="160" height="272" fill={ac} opacity="0.03"/>
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <rect x="14" y={46 + i*32} width="14" height="14" rx="3"
            fill={i===0 ? ac : "#1e2433"} opacity={i===0 ? .7 : 1}/>
          <rect x="34" y={49 + i*32} width={i===0 ? 80 : 60+(i%3)*10} height="6"
            rx="3" fill={i===0 ? ac : "#1e2433"} opacity={i===0 ? .6 : 1}/>
        </g>
      ))}
      {/* Main content */}
      <rect x="160" y="28" width="400" height="272" fill="#0d1117"/>
      {/* Top bar */}
      <rect x="160" y="28" width="400" height="38" fill="#161b22"/>
      <rect x="174" y="38" width="80" height="8" rx="4" fill={ac} opacity=".6"/>
      <rect x="468" y="36" width="70" height="12" rx="6" fill={ac} opacity=".15"/>
      <rect x="474" y="39" width="58" height="6" rx="3" fill={ac} opacity=".4"/>
      {/* Cards row */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={174+i*126} y="84" width="114" height="68" rx="6" fill="#161b22"/>
          <rect x={182+i*126} y="92" width="50" height="7" rx="3.5" fill={ac} opacity=".5"/>
          <rect x={182+i*126} y="105" width="90" height="5" rx="2.5" fill="#1e2433"/>
          <rect x={182+i*126} y="115" width="70" height="5" rx="2.5" fill="#1e2433"/>
          <rect x={182+i*126} y="135" width="44" height="10" rx="5" fill={ac} opacity=".15"/>
          <rect x={184+i*126} y="137" width="40" height="6" rx="3" fill={ac} opacity=".35"/>
        </g>
      ))}
      {/* Table */}
      <rect x="174" y="172" width="366" height="1" fill="#1e2433"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="174" y={180+i*22} width="366" height="20" rx="2"
            fill={i%2===0 ? "#0f1318" : "#0d1117"}/>
          <rect x="182" y={185+i*22} width="60" height="6" rx="3" fill="#1e2433"/>
          <rect x="280" y={185+i*22} width="50" height="6" rx="3" fill="#1e2433"/>
          <rect x="460" y={185+i*22} width="50" height="6" rx="3" fill={ac} opacity=".25"/>
        </g>
      ))}
      {/* Faint title */}
      <text x="280" y="155" textAnchor="middle" fill={ac} fontSize="18"
        fontFamily="serif" opacity=".07" fontStyle="italic">{title}</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   CERT IMAGE SVG
══════════════════════════════════════════════ */
function CertImg({ title, issuer, idx }) {
  const acs  = [C.green, C.accent, C.blue, "#ce9178"];
  const ac   = acs[idx % 4];
  return (
    <svg viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="380" height="260" fill="#0c0c0c"/>
      <rect x="10" y="10" width="360" height="240" fill="none" stroke={ac} strokeWidth="1" opacity=".3"/>
      <rect x="16" y="16" width="348" height="228" fill="none" stroke={ac} strokeWidth=".4" opacity=".15"/>
      {/* Ornament corners */}
      {[[16,16],[364,16],[16,244],[364,244]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i*90})`}>
          <path d="M0 0 L12 0 M0 0 L0 12" stroke={ac} strokeWidth="1.5" fill="none" opacity=".5"/>
        </g>
      ))}
      {/* Badge */}
      <circle cx="190" cy="72" r="30" fill="none" stroke={ac} strokeWidth="1" opacity=".3"/>
      <circle cx="190" cy="72" r="22" fill={ac} opacity=".08"/>
      <text x="190" y="78" textAnchor="middle" fill={ac} fontSize="18" fontWeight="700" opacity=".75">
        {issuer.charAt(0)}
      </text>
      {/* Issuer name */}
      <text x="190" y="118" textAnchor="middle" fill={ac} fontSize="10"
        fontFamily="monospace" letterSpacing="3" opacity=".6">
        {issuer.toUpperCase()}
      </text>
      {/* Title */}
      <text x="190" y="145" textAnchor="middle" fill="#ededeb" fontSize="11.5"
        fontFamily="Georgia, serif" opacity=".8">Certificate of Completion</text>
      {/* Course name (truncated) */}
      <text x="190" y="168" textAnchor="middle" fill={ac} fontSize="9"
        fontFamily="monospace" opacity=".6">
        {title.length > 44 ? title.slice(0, 44) + "…" : title}
      </text>
      {/* Divider */}
      <line x1="60" y1="192" x2="320" y2="192" stroke={ac} strokeWidth=".5" opacity=".2"/>
      {/* Seal */}
      <circle cx="190" cy="220" r="14" fill="none" stroke={ac} strokeWidth=".8" opacity=".3"/>
      <circle cx="190" cy="220" r="9" fill={ac} opacity=".08"/>
      <text x="190" y="224" textAnchor="middle" fill={ac} fontSize="9" opacity=".5">✓ VERIFIED</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   PORTFOLIO DATA
══════════════════════════════════════════════ */
const DATA = {
  name: "Mohit Godara",
  role: "Software Engineer",
  email: "mohitgodara816@gmail.com",
  phone: "+91-9057164791",
  github: "https://github.com/MOHITGODARA1",
  linkedin: "https://www.linkedin.com/in/mohit-godara816/",
  location: "Phagwara, Punjab, India",
  stats: [
    { num: "250+", label: "DSA Solved" },
    { num: "1657", label: "LeetCode" },
    { num: "4+", label: "Projects" },
    { num: "Top 13.6%", label: "Global" },
  ],
  about: [
    <span key="a">I'm a <strong>Computer Science undergraduate</strong> at Lovely Professional University building systems where performance meets design. My stack is MERN — but my real focus is on writing code that scales.</span>,
    <span key="b">From <strong>MongoDB schema design</strong> to load-testing APIs with k6 under 100 virtual users — I approach engineering problems with measurement first, intuition second.</span>,
    <span key="c">Outside of work, I solve LeetCode problems to sharpen algorithmic thinking — not as interview prep, but because pattern recognition makes production code better.</span>,
  ],
  skills: [
    { cat: "Languages",             items: ["C++","JavaScript","Python","PHP"],                           featured: ["C++","JavaScript"] },
    { cat: "Frameworks",            items: ["Node.js","React.js","Express.js","Socket.IO"],               featured: ["Node.js","React.js"] },
    { cat: "Data & Infra",          items: ["MongoDB","SQL","AWS","Docker","k6"],                         featured: ["MongoDB"] },
    { cat: "Tools",                 items: ["Git","Postman","Cloudinary","Twilio"],                       featured: [] },
    { cat: "CS Fundamentals",       items: ["DSA","OOPs","OS","Computer Networks","DBMS"],                featured: [] },
    { cat: "Soft Skills",           items: ["Problem Solving","Communication","Collaboration"],           featured: [] },
    { cat: "Frontend & UI",         items: ["HTML","CSS","Tailwind CSS","Responsive Design","Framer Motion"], featured: ["Tailwind CSS"] },
  { cat: "Backend & APIs",        items: ["REST APIs","Authentication (JWT)","WebSockets","API Design"],   featured: ["REST APIs","JWT"] },
  ],
  projects: [
    { num:"01", title:"DocGen AI",  date:"Feb 2026",
      bullets:["AI-powered GitHub repo analyzer using AST parsing + LLM integration","Engineered static analysis to map codebases into modules and relationships","Integrated ChatGPT API to reduce manual documentation effort by ~70%"],
      tech:["React","Node.js","Express","MongoDB","Python","ChatGPT API"],
      github:"https://github.com/MOHITGODARA1", demo:"https://docgen-ai-b085.onrender.com" },
    { num:"02", title:"UniLink",    date:"Dec 2025",
      bullets:["Real-time university collaboration with authentication, chat, post-sharing","k6 load tested (100 VUs): throughput ~120 req/s, latency 460ms → 350ms","Deployed on Railway — 0% failure rate under production stress"],
      tech:["React","Node.js","Express","MongoDB","Socket.IO","Cloudinary"],
      github:"https://github.com/MOHITGODARA1", demo:"https://unilink-1.onrender.com" },
    { num:"03", title:"ApniDukan", date:"Jul 2025",
      bullets:["Wholesale e-commerce platform for bulk retail-to-supplier transactions","Designed MongoDB schemas for products, carts, orders, inventory","REST APIs + Twilio (OTP) + Cloudinary (media)"],
      tech:["React","Node.js","Express","MongoDB","Twilio","Cloudinary"],
      github:"https://github.com/MOHITGODARA1", demo:null },
  ],
  experience: [
    { role:"MERN Stack Training", org:"Allsoft Solutions", date:"Jun – Jul 2025",
      bullets:["6-week MERN intensive: REST APIs, Git workflows, Express middleware","JWT-based authentication with bcrypt password hashing","Build-and-deploy cycle for full-stack applications"],
      badges:["MERN Stack","REST APIs","JWT"] },
  ],
  education: [
    { degree:"B.Tech — CS & Engineering", org:"Lovely Professional University", date:"Aug 2023 — Present", meta:"CGPA: 7.62" },
    { degree:"Intermediate (Class XII)",  org:"Matrix School, Sikar, Rajasthan",  date:"Apr 2022 – Mar 2023", meta:"72.5%" },
    { degree:"Matriculation (Class X)",   org:"P.B Sr. Sec. School, Surjgarh",   date:"Apr 2020 – Mar 2021", meta:"90%" },
  ],
  achievements: [
    { icon:"◆", text:"Solved 250+ DSA problems on LeetCode — rated <strong>1657</strong>, placing in the global top 13%", sub:"Since Jan 2025" },
    { icon:"◆", text:"Achieved <strong>6th rank</strong> out of 100 participants — Code-A-Haunt Hackathon", sub:"Nov 2024" },
    { icon:"◆", text:"Sustained <strong>0% failure rate</strong> under 100 VU load — production UniLink APIs", sub:"Dec 2025" },
  ],
  certs: [
    { name:"ChatGPT-4 Prompt Engineering: Generative AI & LLM", issuer:"Infosys",          date:"Aug 2025", link:"#" },
    { name:"Project Completion — MERN Stack",                    issuer:"Allsoft",          date:"Jul 2025", link:"#" },
    { name:"The Complete Java Certification Course",             issuer:"IamNeo",           date:"May 2025", link:"#" },
    { name:"Bits and Bytes of Computer Networking",             issuer:"Google",           date:"Sep 2024", link:"#" },
  ],
};

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; font-size:16px; }
    body {
      background:${C.bg}; color:${C.text};
      font-family:${F.sans}; overflow-x:hidden;
      cursor:none; -webkit-font-smoothing:antialiased;
      line-height:1.6;
    }
    ::selection { background:${C.accent}; color:${C.bg}; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-track { background:${C.bg}; }
    ::-webkit-scrollbar-thumb { background:${C.accentDim}; }
    a { text-decoration:none; }
    strong { font-weight:600; color:${C.text}; }

    /* ── Scroll reveals ── */
    .rv { opacity:0; transform:translateY(32px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .rv.in { opacity:1; transform:translateY(0); }
    .rv-l { opacity:0; transform:translateX(-24px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .rv-l.in { opacity:1; transform:translateX(0); }
    .rv-s { opacity:0; transform:scale(.96); transition:opacity .6s ease, transform .6s ease; }
    .rv-s.in { opacity:1; transform:scale(1); }
    .d1{transition-delay:.06s} .d2{transition-delay:.12s} .d3{transition-delay:.18s}
    .d4{transition-delay:.24s} .d5{transition-delay:.30s} .d6{transition-delay:.36s}

    /* ── Keyframes ── */
    @keyframes fillBar  { to { width:100%; } }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes scrollDrop {
      0%   { transform:scaleY(0); transform-origin:top;    opacity:1; }
      50%  { transform:scaleY(1); transform-origin:top;    opacity:1; }
      100% { transform:scaleY(1); transform-origin:bottom; opacity:0; }
    }
    @keyframes blogOpen {
      from { opacity:0; transform:scale(.97) translateY(12px); }
      to   { opacity:1; transform:scale(1)   translateY(0);    }
    }
    @keyframes blogClose {
      from { opacity:1; transform:scale(1)   translateY(0);    }
      to   { opacity:0; transform:scale(.97) translateY(12px); }
    }

    /* ── Nav links ── */
    .nl { color:${C.muted}; font-family:${F.mono}; font-size:10.5px; letter-spacing:.1em;
          text-transform:uppercase; text-decoration:none; position:relative; transition:color .2s; }
    .nl::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px;
                 background:${C.accent}; transition:width .22s; }
    .nl:hover,.nl.active { color:${C.text}; }
    .nl:hover::after,.nl.active::after { width:100%; }

    /* ── Buttons ── */
    .bp { display:inline-flex; align-items:center; gap:8px; padding:13px 28px;
          background:${C.accent}; color:${C.bg}; font-family:${F.mono}; font-size:11px;
          letter-spacing:.1em; text-transform:uppercase; border:none; cursor:none;
          transition:background .2s, transform .18s; font-weight:500; }
    .bp:hover { background:${C.text}; transform:translateY(-2px); }
    .bg { display:inline-flex; align-items:center; gap:8px; padding:13px 28px;
          border:1px solid ${C.border2}; color:${C.muted}; font-family:${F.mono}; font-size:11px;
          letter-spacing:.1em; text-transform:uppercase; background:none; cursor:none;
          transition:border-color .2s, color .2s, transform .18s; }
    .bg:hover { border-color:${C.text}; color:${C.text}; transform:translateY(-2px); }

    /* ── Skill tags ── */
    .st { font-family:${F.mono}; font-size:11.5px; padding:6px 13px;
          border:1px solid ${C.border}; color:${C.muted}; transition:border-color .2s,color .2s; cursor:default; }
    .st:hover { border-color:${C.accentDim}; color:${C.text}; }
    .st.ft { border-color:${C.accentDim}; color:${C.accent}; }

    /* ── Project cards ── */
    .pc { background:${C.bg1}; position:relative; overflow:hidden;
          transition:background .28s; display:flex; flex-direction:column; }
    .pc::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
                  background:${C.accent}; transform:scaleX(0); transform-origin:left; transition:transform .4s; }
    .pc:hover { background:${C.bg2}; }
    .pc:hover::before { transform:scaleX(1); }

    /* ── Cert image cards ── */
    .ci { position:relative; overflow:hidden; border:1px solid ${C.border};
          cursor:pointer; transition:border-color .25s, transform .25s; display:block; }
    .ci:hover { border-color:${C.accentDim}; transform:scale(1.025); }
    .ci .cio { position:absolute; inset:0; background:rgba(8,8,8,.78);
               opacity:0; display:flex; align-items:center; justify-content:center;
               transition:opacity .25s; }
    .ci:hover .cio { opacity:1; }

    /* ── Blog cards ── */
    .bc { background:${C.bg1}; border:1px solid ${C.border}; padding:32px;
          display:flex; flex-direction:column; gap:16px; cursor:none;
          transition:background .25s, border-color .25s, transform .25s;
          position:relative; overflow:hidden; }
    .bc::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px;
                  background:${C.accent}; transform:scaleY(0); transform-origin:bottom; transition:transform .32s; }
    .bc:hover { background:${C.bg2}; border-color:${C.accentDim}; transform:translateY(-3px); }
    .bc:hover::before { transform:scaleY(1); }

    /* ── Blog full-screen overlay ── */
    .blog-overlay {
      position:fixed; inset:0; background:${C.bg}; z-index:900;
      overflow-y:auto; display:flex; flex-direction:column;
    }
    .blog-overlay.enter { animation:blogOpen .4s cubic-bezier(.16,1,.3,1) both; }
    .blog-overlay.exit  { animation:blogClose .3s ease both; }
    .blog-code {
      background:${C.bg2}; border:1px solid ${C.border}; border-left:3px solid ${C.accent};
      padding:24px 28px; border-radius:4px; overflow-x:auto;
      font-family:${F.mono}; font-size:13px; line-height:1.8; color:#9cdcfe;
    }
    .blog-code .kw  { color:#569cd6; }
    .blog-code .fn  { color:#4ec9b0; }
    .blog-code .str { color:#ce9178; }
    .blog-code .cm  { color:#5a6470; font-style:italic; }

    /* ── Forms ── */
    .fi { background:transparent; border:none; border-bottom:1px solid ${C.border};
          padding:12px 0; color:${C.text}; font-family:${F.sans}; font-size:14px;
          outline:none; transition:border-color .2s; resize:none; width:100%; }
    .fi:focus { border-bottom-color:${C.accent}; }
    .fi::placeholder { color:${C.muted}; }

    /* ── Rows ── */
    .dr { display:flex; align-items:flex-start; justify-content:space-between;
          padding:16px 0; border-bottom:1px solid ${C.border}; gap:20px; }
    .dr:first-child { border-top:1px solid ${C.border}; }
    .cr { display:flex; align-items:center; justify-content:space-between;
          padding:16px 0; border-bottom:1px solid ${C.border}; gap:16px;
          transition:padding-left .2s; }
    .cr:first-child { border-top:1px solid ${C.border}; }
    .cr:hover { padding-left:8px; }
    .ct { display:flex; align-items:center; justify-content:space-between;
          padding:16px 0; border-bottom:1px solid ${C.border}; }
    .ct:first-child { border-top:1px solid ${C.border}; }

    /* ── Achievement items ── */
    .ai { background:${C.bg1}; padding:32px; display:flex; flex-direction:column; gap:12px; transition:background .2s; }
    .ai:hover { background:${C.bg2}; }
    .sk { background:${C.bg1}; padding:28px; transition:background .2s; }
    .sk:hover { background:${C.bg2}; }

    /* ── Responsive ── */
    @media(max-width:960px) {
      .hm  { display:none!important; }
      .sm  { display:flex!important; }
      .tc  { grid-template-columns:1fr!important; }
      .tci { grid-template-columns:1fr!important; }
    }
    @media(min-width:961px) { .sm { display:none!important; } }
    @media(max-width:640px) {
      .cig { grid-template-columns:1fr 1fr!important; }
      .blg { grid-template-columns:1fr!important; }
      .ag  { grid-template-columns:1fr!important; }
    }
  `}</style>
);

/* ══════════════════════════════════════════════
   ANTI-GRAVITY CANVAS
══════════════════════════════════════════════ */
function Particles() {
  const ref   = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const pts   = useRef([]);
  const raf   = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    pts.current = Array.from({ length: 75 }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      return { x, y, hx: x, hy: y, vx: 0, vy: 0,
        size: Math.random() * 1.5 + .4,
        a: Math.random() * .28 + .06 };
    });

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouse.current;

      pts.current.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 150 && d > 0) {
          const s = (150 - d) / 150;
          p.vx += (dx / d) * s * 5;
          p.vy += (dy / d) * s * 5;
        }
        p.vx += (p.hx - p.x) * .03;
        p.vy += (p.hy - p.y) * .03;
        p.vx *= .84; p.vy *= .84;
        p.x  += p.vx; p.y  += p.vy;
      });

      for (let i = 0; i < pts.current.length; i++) {
        for (let j = i + 1; j < pts.current.length; j++) {
          const dx = pts.current[i].x - pts.current[j].x;
          const dy = pts.current[i].y - pts.current[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 105) {
            ctx.beginPath();
            ctx.moveTo(pts.current[i].x, pts.current[i].y);
            ctx.lineTo(pts.current[j].x, pts.current[j].y);
            ctx.strokeStyle = `rgba(200,169,110,${(1 - d / 105) * .05})`;
            ctx.lineWidth   = .5;
            ctx.stroke();
          }
        }
      }
      pts.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${p.a})`;
        ctx.fill();
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const mv = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const ml = () => { mouse.current.x = -9999; mouse.current.y = -9999; };
    window.addEventListener("mousemove",  mv);
    window.addEventListener("mouseleave", ml);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseleave",ml);
    };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:.75 }}/>;
}

/* ══════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════ */
function Cursor() {
  const d = useRef(null), r = useRef(null), p = useRef({ mx:0,my:0,rx:0,ry:0 });
  useEffect(() => {
    const mv = e => { p.current.mx = e.clientX; p.current.my = e.clientY; };
    document.addEventListener("mousemove", mv);
    let raf;
    const tick = () => {
      const { mx,my,rx,ry } = p.current;
      if (d.current) { d.current.style.left=mx+"px"; d.current.style.top=my+"px"; }
      p.current.rx += (mx-rx)*.15; p.current.ry += (my-ry)*.15;
      if (r.current) { r.current.style.left=p.current.rx+"px"; r.current.style.top=p.current.ry+"px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const on  = () => r.current && (r.current.style.cssText += ";width:50px;height:50px;border-color:rgba(200,169,110,.65)");
    const off = () => r.current && (r.current.style.cssText += ";width:34px;height:34px;border-color:rgba(255,255,255,.32)");
    const t = setTimeout(() => {
      document.querySelectorAll("a,button,.bc,.pc,.ci,.ai,.sk").forEach(el => {
        el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off);
      });
    }, 600);
    return () => { document.removeEventListener("mousemove",mv); cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",mixBlendMode:"difference"}}>
      <div ref={d} style={{width:7,height:7,background:"#fff",borderRadius:"50%",position:"absolute",transform:"translate(-50%,-50%)"}}/>
      <div ref={r} style={{width:34,height:34,border:"1px solid rgba(255,255,255,.32)",borderRadius:"50%",position:"absolute",transform:"translate(-50%,-50%)",transition:"width .2s,height .2s,border-color .2s"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════ */
function Loader({ onDone }) {
  const [gone, setGone] = useState(false);
  useEffect(() => { const t = setTimeout(() => { setGone(true); onDone(); }, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:28,opacity:gone?0:1,visibility:gone?"hidden":"visible",transition:"opacity .7s ease,visibility .7s ease",pointerEvents:gone?"none":"auto"}}>
      <div style={{fontFamily:F.serif,fontSize:"clamp(26px,5vw,46px)",color:C.text,letterSpacing:".04em",fontWeight:400}}>Mohit Godara</div>
      <div style={{width:220,height:1,background:C.border,overflow:"hidden"}}>
        <div style={{height:"100%",width:0,background:C.accent,animation:"fillBar 1.7s ease forwards"}}/>
      </div>
      <div style={{fontFamily:F.mono,fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:C.muted}}>Loading Portfolio</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════ */
function useScrollPct() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => { const mx = document.documentElement.scrollHeight - window.innerHeight; setP(mx > 0 ? (window.scrollY / mx) * 100 : 0); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}
function useActiveSection() {
  const [a, setA] = useState("");
  useEffect(() => {
    const ids = ["about","skills","projects","experience","achievements","blog","contact"];
    const fn  = () => { let c = ""; ids.forEach(id => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 220) c = id; }); setA(c); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return a;
}
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv,.rv-l,.rv-s");
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════ */
const S   = { padding: "120px 40px", maxWidth: 1200, margin: "0 auto" };
const Div = () => <div style={{ width:"100%", height:1, background:C.border, maxWidth:1200, margin:"0 auto" }}/>;

function SH({ label, title }) {
  return (
    <>
      <div className="rv" style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:C.accent, marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
        {label} <span style={{ flex:1, maxWidth:56, height:1, background:C.accentDim }}/>
      </div>
      <h2 className="rv d1" style={{ fontFamily:F.serif, fontSize:"clamp(34px,5vw,58px)", color:C.text, lineHeight:1.08, letterSpacing:"-.02em", marginBottom:56, fontWeight:400 }}
        dangerouslySetInnerHTML={{ __html: title }}/>
    </>
  );
}

function Mono({ children, style = {} }) {
  return <span style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:C.muted, ...style }}>{children}</span>;
}

const GithubIco = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
const ExtIco    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar({ active, mob, setMob }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const fn = () => setSc(window.scrollY > 60); window.addEventListener("scroll", fn, { passive:true }); return () => window.removeEventListener("scroll", fn); }, []);
  const links = [
    {h:"#about",id:"about",l:"About"},{h:"#skills",id:"skills",l:"Skills"},
    {h:"#projects",id:"projects",l:"Projects"},{h:"#experience",id:"experience",l:"Experience"},
    {h:"#blog",id:"blog",l:"Blog"},{h:"#contact",id:"contact",l:"Contact"},
  ];
  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:200, padding:"18px 40px",display:"flex",alignItems:"center",justifyContent:"space-between", background:sc?"rgba(8,8,8,.92)":"transparent", backdropFilter:sc?"blur(16px)":"none", borderBottom:sc?`1px solid ${C.border}`:"1px solid transparent", transition:"background .3s,border-color .3s" }}>
        <a href="#hero" style={{ fontFamily:F.serif, fontSize:20, color:C.text, letterSpacing:".04em", fontWeight:400 }}>MG.</a>
        <ul style={{ display:"flex", gap:32, listStyle:"none" }} className="hm">
          {links.map(l => <li key={l.id}><a href={l.h} className={`nl${active===l.id?" active":""}`}>{l.l}</a></li>)}
        </ul>
        <button className="sm" onClick={() => setMob(true)} style={{ background:"none",border:"none",cursor:"none",flexDirection:"column",gap:5 }}>
          <span style={{ width:22,height:1,background:C.text,display:"block" }}/>
          <span style={{ width:16,height:1,background:C.text,display:"block" }}/>
        </button>
      </nav>
      {mob && (
        <div style={{ position:"fixed",inset:0,background:C.bg,zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,animation:"fadeIn .25s ease" }}>
          <button onClick={() => setMob(false)} style={{ position:"absolute",top:20,right:24,background:"none",border:"none",cursor:"none",color:C.muted,fontSize:22 }}>✕</button>
          {links.map(l => <a key={l.id} href={l.h} onClick={() => setMob(false)} style={{ fontFamily:F.serif,fontSize:34,color:C.text,fontWeight:400 }}>{l.l}</a>)}
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 40px 80px", position:"relative", overflow:"hidden" }}>
      {/* BG text */}
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)", fontFamily:F.serif, fontSize:"clamp(90px,16vw,220px)", color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,.022)", pointerEvents:"none", whiteSpace:"nowrap", letterSpacing:"-.02em", userSelect:"none" }}>MOHIT</div>

      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:70, alignItems:"flex-end" }} className="tc">
          {/* Left */}
          <div style={{ animation:"fadeUp .9s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ fontFamily:F.mono, fontSize:10.5, letterSpacing:".18em", textTransform:"uppercase", color:C.accent, marginBottom:28, display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ width:36, height:1, background:C.accent, display:"inline-block" }}/>
              Software Engineer
            </div>
            <h1 style={{ fontFamily:F.serif, fontSize:"clamp(50px,9vw,116px)", lineHeight:.93, letterSpacing:"-.025em", color:C.text, marginBottom:36, fontWeight:500 }}>
              Mohit<br/><em style={{ fontStyle:"italic", color:C.accent }}>Godara</em>
            </h1>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
              <p style={{ maxWidth:460, color:C.muted, fontSize:15, lineHeight:1.78 }}>
                <strong>Full-stack developer</strong> building performant web systems.
                Specialised in <strong>MERN stack</strong> — sharp focus on API design,
                real-time communication, and systems that scale under load.
              </p>
              <div style={{ display:"flex", gap:14, flexShrink:0 }}>
                <a href="#projects" className="bp">View Work</a>
                <a href="#contact"  className="bg">Hire Me</a>
              </div>
            </div>
            <div style={{ display:"flex", gap:44, marginTop:60, paddingTop:40, borderTop:`1px solid ${C.border}`, flexWrap:"wrap" }}>
              {DATA.stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily:F.serif, fontSize:34, color:C.text, lineHeight:1, marginBottom:4 }}>{s.num}</div>
                  <Mono>{s.label}</Mono>
                </div>
              ))}
            </div>
          </div>
          {/* Avatar */}
          <div className="hm" style={{ flexShrink:0, position:"relative", animation:"float 6s ease-in-out infinite, fadeIn 1s ease .4s both" }}>
            <div style={{ width:"100%", aspectRatio:"480/560", position:"relative" }}>
              <DeveloperAvatar/>
            </div>
            {/* Glow under avatar */}
            <div style={{ position:"absolute", bottom:-10, left:"50%", transform:"translateX(-50%)", width:200, height:24, background:C.accent, filter:"blur(32px)", opacity:.08, borderRadius:"50%" }}/>
            {/* Status badge */}
            <div style={{ position:"absolute", bottom:60, right:-14, background:C.bg2, border:`1px solid ${C.border}`, padding:"10px 18px" }}>
              <Mono style={{ color:C.accent, display:"block", marginBottom:3 }}>Available</Mono>
              <span style={{ fontSize:11, color:C.text }}>for opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hm" style={{ position:"absolute", right:40, bottom:80, display:"flex", flexDirection:"column", alignItems:"center", gap:8, writingMode:"vertical-rl" }}>
        <div style={{ width:1, height:64, background:`linear-gradient(to bottom,${C.muted},transparent)`, animation:"scrollDrop 2.2s ease infinite" }}/>
        <Mono>Scroll</Mono>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" style={S}>
      <SH label="About" title='Who I <em style="font-style:italic;color:#c8a96e">am</em>'/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }} className="tc">
        <div className="rv d2">
          {DATA.about.map((p, i) => <p key={i} style={{ color:C.muted, fontSize:15, lineHeight:1.85, marginBottom:i<DATA.about.length-1?20:0 }}>{p}</p>)}
          <div style={{ display:"flex", gap:14, marginTop:36, flexWrap:"wrap" }}>
            <a href={DATA.github}   target="_blank" rel="noreferrer" className="bg">GitHub ↗</a>
            <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="bg">LinkedIn ↗</a>
          </div>
        </div>
        <div className="rv d3">
          {[
            {k:"Email",    v:<a href={`mailto:${DATA.email}`} style={{color:C.accent}}>{DATA.email}</a>},
            {k:"Phone",    v:DATA.phone},
            {k:"Location", v:DATA.location},
            {k:"Degree",   v:"B.Tech — CS & Eng."},
            {k:"CGPA",     v:"7.62 / 10"},
            {k:"Status",   v:<span style={{color:C.accent}}>Open to opportunities</span>},
          ].map(({k,v}) => (
            <div key={k} className="dr">
              <Mono>{k}</Mono>
              <span style={{ fontSize:13.5, color:C.text, textAlign:"right" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SKILLS
══════════════════════════════════════════════ */
function Skills() {
  return (
    <section id="skills" style={S}>
      <SH label="Skills" title='Technical <em style="font-style:italic;color:#c8a96e">Arsenal</em>'/>
      <div className="rv d2" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))", gap:1, background:C.border, border:`1px solid ${C.border}` }}>
        {DATA.skills.map(({ cat, items, featured }) => (
          <div key={cat} className="sk">
            <Mono style={{ color:C.accent, display:"block", marginBottom:18 }}>{cat}</Mono>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {items.map(item => <span key={item} className={`st${featured.includes(item)?" ft":""}`}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════ */
function Projects() {
  return (
    <section id="projects" style={S}>
      <SH label="Work" title='Selected <em style="font-style:italic;color:#c8a96e">Projects</em>'/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:1, background:C.border, border:`1px solid ${C.border}` }}>
        {DATA.projects.map((p, i) => (
          <div key={p.title} className={`pc rv d${i+1}`}>
            {/* Screenshot */}
            <div style={{ height:180, overflow:"hidden", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <ProjectShot title={p.title} idx={i}/>
            </div>
            <div style={{ padding:36, display:"flex", flexDirection:"column", flex:1 }}>
              <Mono style={{ marginBottom:14 }}>{p.num} / {p.date.split(" ").pop()}</Mono>
              <Mono style={{ color:C.accent, display:"block", marginBottom:12 }}>{p.date}</Mono>
              <div style={{ fontFamily:F.serif, fontSize:24, color:C.text, marginBottom:18, lineHeight:1.18, fontWeight:500 }}>{p.title}</div>
              <ul style={{ listStyle:"none", padding:0, marginBottom:24, flex:1 }}>
                {p.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize:13.5, color:C.muted, lineHeight:1.78, marginBottom:7, paddingLeft:18, position:"relative" }}>
                    <span style={{ position:"absolute", left:0, color:C.accentDim, fontSize:11 }}>—</span>{b}
                  </li>
                ))}
              </ul>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
                {p.tech.map(t => <span key={t} style={{ fontFamily:F.mono, fontSize:10, padding:"4px 10px", background:C.bg2, border:`1px solid ${C.border}`, color:C.muted, letterSpacing:".07em" }}>{t}</span>)}
              </div>
              <div style={{ display:"flex", gap:18 }}>
                <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, display:"flex", alignItems:"center", gap:6 }}><GithubIco/> GitHub</a>
                {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, display:"flex", alignItems:"center", gap:6 }}><ExtIco/> Live Demo</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   EXPERIENCE + EDUCATION
══════════════════════════════════════════════ */
function TLItem({ item, delay, isLast }) {
  return (
    <div className={`rv d${delay} tci`} style={{ display:"grid", gridTemplateColumns:"170px 1px 1fr", gap:"0 40px", paddingBottom:isLast?0:52 }}>
      <Mono style={{ textAlign:"right", paddingTop:4, lineHeight:1.6, display:"block" }}>{item.date}</Mono>
      <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
        <div style={{ width:9, height:9, borderRadius:"50%", background:C.accent, border:`2px solid ${C.bg}`, boxShadow:`0 0 0 1px ${C.accentDim}`, marginTop:2, flexShrink:0 }}/>
        {!isLast && <div style={{ position:"absolute", top:12, bottom:-52, left:"50%", transform:"translateX(-50%)", width:1, background:C.border }}/>}
      </div>
      <div>
        <div style={{ fontSize:16.5, fontWeight:500, color:C.text, marginBottom:5, lineHeight:1.35 }}>{item.role || item.degree}</div>
        <Mono style={{ color:C.accent, display:"block", marginBottom:14, lineHeight:1.6 }}>{item.org}</Mono>
        {item.bullets && (
          <ul style={{ listStyle:"none", padding:0, fontSize:13, color:C.muted, lineHeight:1.8 }}>
            {item.bullets.map((b, i) => (
              <li key={i} style={{ paddingLeft:18, position:"relative", marginBottom:6 }}>
                <span style={{ position:"absolute", left:0, color:C.accentDim, fontSize:11 }}>→</span>{b}
              </li>
            ))}
          </ul>
        )}
        {item.meta && <div style={{ fontSize:13, color:C.muted }}>{item.meta}</div>}
        {item.badges && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:14 }}>
            {item.badges.map(b => <span key={b} style={{ fontFamily:F.mono, fontSize:10, padding:"3px 8px", border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
function Experience() {
  const items = [...DATA.experience, ...DATA.education];
  return (
    <section id="experience" style={S}>
      <SH label="Journey" title='Experience &amp; <em style="font-style:italic;color:#c8a96e">Education</em>'/>
      <div>{items.map((it, i) => <TLItem key={i} item={it} delay={Math.min(i+1,5)} isLast={i===items.length-1}/>)}</div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ACHIEVEMENTS + CERTS
══════════════════════════════════════════════ */
function Achievements() {
  return (
    <section id="achievements" style={S}>
      <SH label="Recognition" title='Achievements &amp; <em style="font-style:italic;color:#c8a96e">Certs</em>'/>
      {/* Achievement grid */}
      <div className="rv d2 ag" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:C.border, border:`1px solid ${C.border}`, marginBottom:60 }}>
        {DATA.achievements.map((a, i) => (
          <div key={i} className="ai">
            <div style={{ fontSize:22, color:C.accent, fontFamily:F.mono }}>{a.icon}</div>
            <div style={{ fontSize:14, color:C.text, lineHeight:1.65 }} dangerouslySetInnerHTML={{ __html:a.text }}/>
            <Mono>{a.sub}</Mono>
          </div>
        ))}
      </div>
      {/* Cert image grid */}
      <Mono style={{ display:"block", marginBottom:20, color:C.muted }} className="rv d3">Certificates</Mono>
      <div className="rv d3 cig" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:40 }}>
        {DATA.certs.map((c, i) => (
          <a key={i} href={c.link} target="_blank" rel="noreferrer" className="ci" style={{ aspectRatio:"380/260" }}>
            <CertImg title={c.name} issuer={c.issuer} idx={i}/>
            <div className="cio">
              <Mono style={{ color:C.accent }}>View Cert ↗</Mono>
            </div>
          </a>
        ))}
      </div>
      {/* Cert list */}
      <div className="rv d4">
        {DATA.certs.map((c, i) => (
          <div key={i} className="cr">
            <span style={{ fontSize:14, color:C.text, flex:1 }}>{c.name}</span>
            <Mono style={{ color:C.accent, flexShrink:0 }}>{c.issuer}</Mono>
            <Mono style={{ flexShrink:0 }}>{c.date}</Mono>
            <a href={c.link} target="_blank" rel="noreferrer" style={{ fontFamily:F.mono, fontSize:10, color:C.muted, border:`1px solid ${C.border}`, padding:"4px 10px", transition:"border-color .2s,color .2s" }}>View ↗</a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   BLOG — FULL SCREEN READER
══════════════════════════════════════════════ */
function BlogReader({ blog, onClose }) {
  const [pct, setPct] = useState(0);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    setPct(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0);
  }, []);

  const tagColor = { "Backend":C.green, "AI / LLM":C.accent, "DSA":C.blue, "Architecture":"#ce9178" };
  const tc = tagColor[blog.tag] || C.accent;

  const renderContent = (block, idx) => {
    switch (block.type) {
      case "h2":
        return <h2 key={idx} style={{ fontFamily:F.serif, fontSize:"clamp(22px,3.5vw,32px)", color:C.text, marginTop:52, marginBottom:20, lineHeight:1.2, fontWeight:500, letterSpacing:"-.01em" }}>{block.text}</h2>;
      case "p":
        return <p key={idx} style={{ fontSize:"clamp(15px,1.5vw,17px)", color:C.muted, lineHeight:1.9, marginBottom:24 }}>{block.text}</p>;
      case "code":
        return (
          <div key={idx} style={{ margin:"32px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", background:C.bg3, borderBottom:`1px solid ${C.border}` }}>
              <Mono style={{ color:tc }}>{block.lang}</Mono>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                {["#e05a5a","#e0aa5a","#5ae05a"].map(col => <div key={col} style={{ width:10, height:10, borderRadius:"50%", background:col, opacity:.7 }}/>)}
              </div>
            </div>
            <pre className="blog-code" style={{ margin:0, borderTop:"none", borderRadius:"0 0 4px 4px" }}>
              <code>{block.text}</code>
            </pre>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div
      className={`blog-overlay ${closing ? "exit" : "enter"}`}
      ref={scrollRef}
      onScroll={onScroll}
    >
      {/* Reading progress bar */}
      <div style={{ position:"sticky", top:0, left:0, right:0, height:2, background:C.border, zIndex:10, flexShrink:0 }}>
        <div style={{ height:"100%", background:tc, width:`${pct}%`, transition:"width .1s linear" }}/>
      </div>

      {/* Sticky header */}
      <div style={{ position:"sticky", top:2, left:0, right:0, background:"rgba(8,8,8,.95)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10, flexShrink:0 }}>
        <button onClick={handleClose} style={{ background:"none", border:"none", cursor:"none", display:"flex", alignItems:"center", gap:10, color:C.muted, transition:"color .2s", fontFamily:F.mono, fontSize:11, letterSpacing:".1em", textTransform:"uppercase" }}
          onMouseEnter={e => e.currentTarget.style.color=C.text}
          onMouseLeave={e => e.currentTarget.style.color=C.muted}>
          ← Back
        </button>
        <div style={{ fontFamily:F.mono, fontSize:11, color:C.muted, letterSpacing:".08em", maxWidth:"50%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{blog.title}</div>
        <Mono style={{ color:C.muted }}>{blog.readTime}</Mono>
      </div>

      {/* Content */}
      <div style={{ maxWidth:740, margin:"0 auto", padding:"64px 40px 120px", flex:1, animation:"fadeUp .5s ease both" }}>
        {/* Tag + meta */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
          <span style={{ fontFamily:F.mono, fontSize:10, padding:"5px 12px", border:`1px solid ${tc}`, color:tc, letterSpacing:".1em" }}>{blog.tag}</span>
          <Mono>{blog.date}</Mono>
          <span style={{ width:4, height:4, borderRadius:"50%", background:C.border }}/>
          <Mono>{blog.readTime}</Mono>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily:F.serif, fontSize:"clamp(28px,5vw,48px)", color:C.text, lineHeight:1.12, letterSpacing:"-.02em", marginBottom:32, fontWeight:500 }}>{blog.title}</h1>

        {/* Author */}
        <div style={{ display:"flex", alignItems:"center", gap:14, paddingBottom:36, borderBottom:`1px solid ${C.border}`, marginBottom:40 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.bg2},${C.bg3})`, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.serif, fontSize:16, color:C.accent }}>M</div>
          <div>
            <div style={{ fontSize:14, color:C.text, fontWeight:500 }}>Mohit Godara</div>
            <Mono>Software Engineer · LPU</Mono>
          </div>
        </div>

        {/* Lead excerpt */}
        <p style={{ fontSize:"clamp(16px,1.8vw,18px)", color:C.text, lineHeight:1.8, marginBottom:36, fontStyle:"italic", borderLeft:`2px solid ${tc}`, paddingLeft:20 }}>{blog.excerpt}</p>

        {/* Body */}
        {blog.content.map((block, i) => renderContent(block, i))}

        {/* Footer */}
        <div style={{ marginTop:64, paddingTop:40, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, color:C.text, marginBottom:4 }}>Mohit Godara</div>
            <Mono>mohitgodara816@gmail.com</Mono>
          </div>
          <button onClick={handleClose} className="bg" style={{ cursor:"none" }}>← All Posts</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BLOG SECTION
══════════════════════════════════════════════ */
function Blog() {
  const [open, setOpen] = useState(null);
  const tagColor = { "Backend":C.green, "AI / LLM":C.accent, "DSA":C.blue, "Architecture":"#ce9178" };

  return (
    <>
      <section id="blog" style={S}>
        <SH label="Writing" title='Latest <em style="font-style:italic;color:#c8a96e">Thoughts</em>'/>
        <div className="blg" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
          {BLOGS.map((b, i) => (
            <div key={b.id} className={`bc rv d${(i%2)+1}`} onClick={() => setOpen(b)} role="button" tabIndex={0}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:F.mono, fontSize:10, padding:"4px 10px", border:`1px solid ${tagColor[b.tag]||C.border}`, color:tagColor[b.tag]||C.muted, letterSpacing:".08em" }}>{b.tag}</span>
                <Mono>{b.date}</Mono>
              </div>
              <div style={{ fontFamily:F.serif, fontSize:21, color:C.text, lineHeight:1.28, letterSpacing:"-.01em", fontWeight:500 }}>{b.title}</div>
              <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, flex:1 }}>{b.excerpt}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <Mono>{b.readTime}</Mono>
                <Mono style={{ color:C.accent }}>Read Article →</Mono>
              </div>
            </div>
          ))}
        </div>
      </section>

      {open && <BlogReader blog={open} onClose={() => setOpen(null)}/>}
    </>
  );
}

/* ══════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════ */
function Contact() {
  const [st, setSt] = useState("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const sub = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }
    
    setSt("sending");
    try {
      const currentTime = new Date().toLocaleString();
      
      // Send email to portfolio owner
      await emailjs.send(
        "service_ffzvvpa",
        "template_5x1ln1e",
        {
          from_name: name,
          from_email: email,
          message: message,
          time: currentTime,
        }
      );
      
      // Send auto-reply to user
      await emailjs.send(
        "service_ffzvvpa",
        "template_4d73qhr",
        {
          email: email,
          from_name: name,
          message: message,
        }
      );
      
      setSt("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSt("idle"), 3000);
    } catch (error) {
      console.error("Email send failed:", error);
      alert("Failed to send message. Please try again.");
      setSt("idle");
    }
  };
  
  const contactTitle = `Let's <em style="font-style:italic;color:#c8a96e">Connect</em>`;
  return (
    <section id="contact" style={S}>
      <SH label="Contact" title={contactTitle}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }} className="tc">
        <div className="rv d2">
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.8, marginBottom:40 }}>Open to internships, full-time roles, and interesting projects. Prefer work around backend systems, real-time applications, or anything that involves genuinely hard engineering problems.</p>
          <div>
            {[{l:"Email",v:DATA.email,h:`mailto:${DATA.email}`},{l:"Phone",v:DATA.phone,h:`tel:${DATA.phone}`},{l:"GitHub",v:"MOHITGODARA1",h:DATA.github},{l:"LinkedIn",v:"mohit-godara816",h:DATA.linkedin}].map(({l,v,h}) => (
              <div key={l} className="ct">
                <Mono>{l}</Mono>
                <a href={h} target="_blank" rel="noreferrer" style={{ fontSize:13.5, color:C.text, transition:"color .2s" }} onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.text}>{v}</a>
              </div>
            ))}
          </div>
        </div>
        <div className="rv d3" style={{ display:"flex", flexDirection:"column", gap:22 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:C.muted }}>Name</label>
            <input type="text" placeholder="Your name" className="fi" value={name} onChange={(e) => setName(e.target.value)} disabled={st !== "idle"}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:C.muted }}>Email</label>
            <input type="email" placeholder="your@email.com" className="fi" value={email} onChange={(e) => setEmail(e.target.value)} disabled={st !== "idle"}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ fontFamily:F.mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:C.muted }}>Message</label>
            <textarea className="fi" placeholder="What are you working on?" style={{ minHeight:96 }} value={message} onChange={(e) => setMessage(e.target.value)} disabled={st !== "idle"}/>
          </div>
          <button className="bp" style={{ alignSelf:"flex-start", background:st==="sent"?C.text:C.accent, opacity:st==="sending"?.6:1 }} onClick={sub} disabled={st!=="idle"}>
            {st==="idle"&&"Send Message →"}{st==="sending"&&"Sending…"}{st==="sent"&&"Sent ✓"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop:`1px solid ${C.border}`, padding:"40px", display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:1200, margin:"0 auto", flexWrap:"wrap", gap:20 }}>
      <Mono>© 2026 Mohit Godara. Built with precision.</Mono>
      <div style={{ display:"flex", gap:28 }}>
        {[{l:"GitHub",h:DATA.github},{l:"LinkedIn",h:DATA.linkedin},{l:"Email",h:`mailto:${DATA.email}`}].map(({l,h}) => (
          <a key={l} href={h} target="_blank" rel="noreferrer" style={{ fontFamily:F.mono, fontSize:11, color:C.muted, letterSpacing:".08em", transition:"color .2s" }} onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</a>
        ))}
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════ */
function App() {
  const [loaded,  setLoaded]  = useState(false);
  const [mob,     setMob]     = useState(false);
  const progress = useScrollPct();
  const active   = useActiveSection();
  useReveal();

  return (
    <>
      <GS/>
      <Particles/>
      {/* Top progress bar */}
      <div style={{ position:"fixed", top:0, left:0, height:2, background:C.accent, zIndex:1000, width:`${progress}%`, transition:"width .1s linear" }}/>
      <Cursor/>
      <Loader onDone={() => setLoaded(true)}/>
      <Navbar active={active} mob={mob} setMob={setMob}/>

      <main style={{ opacity:loaded?1:0, transition:"opacity .5s ease .2s", position:"relative", zIndex:1 }}>
        <Hero/>
        <Div/><About/>
        <Div/><Skills/>
        <Div/><Projects/>
        <Div/><Experience/>
        <Div/><Achievements/>
        <Div/><Blog/>
        <Div/><Contact/>
        <Footer/>
      </main>
    </>
  );
}

export default App;