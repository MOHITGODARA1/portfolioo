import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

// ── INITIALIZE EMAILJS ──────────────────────────────────────────────
emailjs.init("jSxFrOlhAOiiDJbCA");

// ── GLOBAL STYLES injected into <head> ─────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --bg:#0A0A0F;
  --surface:#111118;
  --surface2:#18181F;
  --border:#252530;
  --ink:#F0EEF8;
  --ink2:#A09CB8;
  --ink3:#5A5670;
  --accent:#6C63FF;
  --accent2:#8B84FF;
  --accent-bg:rgba(108,99,255,0.1);
  --red:#FF5757;
  --ff-head:'Syne',sans-serif;
  --ff-body:'DM Sans',sans-serif;
  --ease:cubic-bezier(.16,1,.3,1);
  --r:12px;
  --r-lg:20px;
}

html { scroll-behavior:smooth; }
body {
  font-family:var(--ff-body);
  background:var(--bg);
  color:var(--ink);
  line-height:1.6;
  overflow-x:hidden;
}

/* SCROLLBAR */
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:var(--accent); border-radius:2px; }

/* PROGRESS BAR */
#progress-bar {
  position:fixed; top:0; left:0; height:2px;
  background:linear-gradient(90deg,var(--accent),var(--accent2));
  width:0%; z-index:9999; transition:width .1s linear;
}

/* CANVAS BG */
#bg-canvas {
  position:fixed; inset:0; z-index:0;
  pointer-events:none;
}

/* NOISE OVERLAY */
.noise-overlay {
  position:fixed; inset:0; z-index:1;
  pointer-events:none;
  opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px;
}

/* NAV */
nav {
  position:fixed; top:0; width:100%; z-index:100;
  padding:0 max(24px,5vw);
  background:rgba(10,10,15,0.8);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  border-bottom:1px solid var(--border);
  transition:background .3s;
}
.nav-inner {
  max-width:1200px; margin:0 auto;
  display:flex; align-items:center; justify-content:space-between;
  height:64px;
}
.nav-logo {
  display:flex; align-items:center; gap:10px;
  font-family:var(--ff-head); font-weight:700; font-size:16px;
  text-decoration:none; color:var(--ink);
}
.nav-logo-mark {
  width:34px; height:34px; border-radius:8px;
  background:var(--accent); color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:13px; font-weight:700;
}
.nav-links { display:flex; align-items:center; gap:36px; list-style:none; }
.nav-links a {
  font-size:13.5px; font-weight:500; color:var(--ink2);
  text-decoration:none; transition:color .2s;
}
.nav-links a:hover { color:var(--ink); }
.nav-right { display:flex; align-items:center; gap:12px; }
.btn-nav {
  padding:8px 18px; border-radius:8px;
  background:var(--accent); color:#fff;
  font-size:13.5px; font-weight:500; border:none;
  cursor:pointer; text-decoration:none;
  transition:background .2s, transform .15s;
}
.btn-nav:hover { background:var(--accent2); transform:translateY(-1px); }
.hamburger {
  display:none; flex-direction:column; gap:5px;
  cursor:pointer; padding:4px; background:none; border:none;
}
.hamburger span {
  display:block; width:22px; height:1.5px;
  background:var(--ink); transition:all .3s;
}

/* MOBILE MENU */
#mobile-menu {
  display:none; position:fixed; inset:0; top:64px;
  background:var(--bg); z-index:99; padding:32px 24px;
  flex-direction:column; gap:24px;
}
#mobile-menu.open { display:flex; }
#mobile-menu a {
  font-family:var(--ff-head); font-size:24px; font-weight:600;
  color:var(--ink); text-decoration:none; transition:color .2s;
}
#mobile-menu a:hover { color:var(--accent); }

/* SECTIONS */
section { padding:120px max(24px,5vw); position:relative; z-index:2; }
.container { max-width:1200px; margin:0 auto; }
.section-label {
  font-size:11px; font-weight:600; letter-spacing:.12em;
  color:var(--accent); text-transform:uppercase;
  margin-bottom:14px; display:block;
}
.section-heading {
  font-family:var(--ff-head);
  font-size:clamp(32px,4vw,52px);
  font-weight:700; letter-spacing:-.03em; line-height:1.1;
  color:var(--ink);
}

/* REVEAL */
.reveal {
  opacity:0; transform:translateY(32px);
  transition:opacity .7s var(--ease), transform .7s var(--ease);
}
.reveal.visible { opacity:1; transform:translateY(0); }
.reveal-delay-1 { transition-delay:.1s; }
.reveal-delay-2 { transition-delay:.2s; }
.reveal-delay-3 { transition-delay:.3s; }
.reveal-delay-4 { transition-delay:.4s; }

/* HERO */
#hero {
  min-height:100vh; display:flex; align-items:center;
  padding-top:120px;
}
.hero-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:80px; align-items:center;
}
.hero-badge {
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 14px; border-radius:100px;
  border:1px solid var(--border); background:var(--surface);
  font-size:12.5px; font-weight:500; color:var(--ink2); margin-bottom:28px;
}
.hero-badge-dot {
  width:7px; height:7px; border-radius:50%;
  background:#22C55E; animation:pulseDot 2s infinite;
}
@keyframes pulseDot {
  0%,100%{opacity:1;transform:scale(1)}
  50%{opacity:.6;transform:scale(.8)}
}
.hero-title {
  font-family:var(--ff-head);
  font-size:clamp(40px,5.5vw,80px);
  font-weight:800; letter-spacing:-.04em; line-height:1.0;
  color:var(--ink); margin-bottom:10px;
}
.hero-title .accent { color:var(--accent); }
.hero-role {
  font-family:var(--ff-head);
  font-size:clamp(18px,2.5vw,26px);
  font-weight:500; color:var(--ink3);
  margin-bottom:24px; letter-spacing:-.01em; min-height:36px;
}
#typed-cursor { display:inline-block; animation:blink .8s infinite; color:var(--accent); }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
.hero-desc { font-size:16px; color:var(--ink2); line-height:1.7; max-width:440px; margin-bottom:40px; }
.hero-ctas { display:flex; gap:12px; flex-wrap:wrap; }

.btn-primary {
  display:inline-flex; align-items:center; gap:8px;
  padding:13px 26px; border-radius:var(--r);
  background:var(--accent); color:#fff;
  font-size:14px; font-weight:500; border:none;
  cursor:pointer; text-decoration:none;
  transition:background .2s, transform .2s, box-shadow .2s;
}
.btn-primary:hover {
  background:var(--accent2); transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(108,99,255,.4);
}
.btn-secondary {
  display:inline-flex; align-items:center; gap:8px;
  padding:13px 26px; border-radius:var(--r);
  background:var(--surface); color:var(--ink);
  font-size:14px; font-weight:500;
  border:1px solid var(--border); cursor:pointer; text-decoration:none;
  transition:background .2s, transform .2s;
}
.btn-secondary:hover { background:var(--surface2); transform:translateY(-2px); }

/* AVATAR CARD */
.avatar-card {
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--r-lg); padding:40px;
  display:flex; flex-direction:column; align-items:center;
  gap:20px;
  box-shadow:0 0 60px rgba(108,99,255,.08);
}
.avatar-wrap {
  width:140px; height:140px; border-radius:50%;
  background:linear-gradient(135deg, var(--accent) 0%, #A855F7 100%);
  display:flex; align-items:center; justify-content:center;
  position:relative;
  box-shadow:0 0 40px rgba(108,99,255,.4);
  animation:floatAvatar 3s ease-in-out infinite;
}
@keyframes floatAvatar {
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-10px)}
}
.avatar-svg { width:80px; height:80px; }
.avatar-name {
  font-family:var(--ff-head); font-size:20px; font-weight:700;
  color:var(--ink); letter-spacing:-.02em;
}
.avatar-role { font-size:13px; color:var(--ink3); text-align:center; }
.avatar-status {
  display:flex; align-items:center; gap:8px;
  padding:8px 16px; border-radius:100px;
  background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2);
  font-size:12px; color:#22C55E; font-weight:500;
}
.hero-stats {
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:1px; background:var(--border);
  border-radius:var(--r); overflow:hidden; width:100%;
}
.hero-stat { background:var(--surface2); padding:16px; text-align:center; }
.hero-stat-val {
  font-family:var(--ff-head); font-size:22px;
  font-weight:700; color:var(--ink); letter-spacing:-.02em;
}
.hero-stat-label { font-size:11px; color:var(--ink3); margin-top:2px; }

/* ABOUT */
#about { background:transparent; }
.about-grid { display:grid; grid-template-columns:1fr 1.4fr; gap:80px; align-items:center; }
.about-tag-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:24px; }
.about-tag {
  padding:6px 14px; border-radius:100px;
  background:var(--accent-bg); color:var(--accent2);
  font-size:12px; font-weight:500; border:1px solid rgba(108,99,255,.2);
}
.about-body { font-size:16px; color:var(--ink2); line-height:1.75; margin-bottom:20px; }
.about-avatar-wrap {
  width:100%; aspect-ratio:3/4;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--r-lg);
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:16px;
  position:relative; overflow:hidden;
}
.about-avatar-glow {
  position:absolute; width:200px; height:200px;
  background:radial-gradient(circle, rgba(108,99,255,.25) 0%, transparent 70%);
  border-radius:50%; animation:glowPulse 3s ease-in-out infinite;
}
@keyframes glowPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.3);opacity:1} }
.about-avatar-big {
  width:120px; height:120px; border-radius:50%;
  background:linear-gradient(135deg, var(--accent), #A855F7);
  display:flex; align-items:center; justify-content:center;
  z-index:1; box-shadow:0 0 40px rgba(108,99,255,.5);
}
.about-avatar-initials {
  font-family:var(--ff-head); font-size:40px; font-weight:800;
  color:#fff; letter-spacing:-.04em;
}
.code-lines {
  font-size:11px; color:var(--ink3); font-family:monospace;
  text-align:center; line-height:1.8; z-index:1;
}
.code-lines .c-green { color:#22C55E; }
.code-lines .c-accent { color:var(--accent2); }
.code-lines .c-yellow { color:#F59E0B; }

/* SKILLS */
#skills { background:transparent; }
.skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; margin-top:56px; }
.skill-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--r-lg); padding:28px;
  transition:transform .25s var(--ease), box-shadow .25s, border-color .25s;
  cursor:default;
}
.skill-card:hover {
  transform:translateY(-6px);
  box-shadow:0 16px 48px rgba(108,99,255,.12);
  border-color:rgba(108,99,255,.3);
}
.skill-icon {
  width:44px; height:44px; border-radius:10px;
  background:var(--accent-bg); display:flex; align-items:center;
  justify-content:center; font-size:20px; margin-bottom:16px;
}
.skill-name { font-family:var(--ff-head); font-size:15px; font-weight:600; color:var(--ink); margin-bottom:6px; }
.skill-desc { font-size:13px; color:var(--ink3); line-height:1.55; margin-bottom:16px; }
.skill-bar-track { height:3px; background:var(--border); border-radius:100px; overflow:hidden; }
.skill-bar-fill {
  height:100%;
  background:linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius:100px; width:0%;
  transition:width 1.2s var(--ease);
}

/* PROJECTS */
#projects { background:transparent; }
.projects-list { display:flex; flex-direction:column; gap:24px; margin-top:56px; }
.project-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--r-lg); padding:40px;
  display:grid; grid-template-columns:1fr auto;
  gap:40px; align-items:start;
  transition:transform .25s var(--ease), box-shadow .25s, border-color .25s;
  position:relative; overflow:hidden;
}
.project-card::before {
  content:''; position:absolute; top:0; left:0;
  width:2px; height:0; background:linear-gradient(to bottom, var(--accent), var(--accent2));
  transition:height .4s var(--ease);
}
.project-card:hover::before { height:100%; }
.project-card:hover {
  transform:translateY(-4px);
  box-shadow:0 20px 56px rgba(108,99,255,.1);
  border-color:rgba(108,99,255,.2);
}
.project-number { font-family:var(--ff-head); font-size:11px; font-weight:600; letter-spacing:.1em; color:var(--ink3); margin-bottom:10px; }
.project-title { font-family:var(--ff-head); font-size:22px; font-weight:700; color:var(--ink); margin-bottom:6px; letter-spacing:-.02em; }
.project-sub { font-size:12px; color:var(--accent2); font-weight:500; margin-bottom:12px; }
.project-desc { font-size:14.5px; color:var(--ink2); line-height:1.65; margin-bottom:20px; }
.project-stack { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
.tech-pill {
  padding:5px 12px; border-radius:6px;
  background:var(--surface2); color:var(--ink2);
  font-size:12px; font-weight:500; border:1px solid var(--border);
}
.project-improve {
  font-size:13px; color:var(--ink3); font-style:italic;
  padding:12px 16px; border-radius:8px;
  background:var(--surface2); border-left:2px solid var(--accent);
}
.project-links { display:flex; flex-direction:column; gap:10px; flex-shrink:0; }
.icon-btn {
  width:40px; height:40px; border-radius:8px;
  border:1px solid var(--border); background:var(--surface2);
  display:flex; align-items:center; justify-content:center;
  text-decoration:none; color:var(--ink2);
  transition:background .2s, color .2s, border-color .2s, transform .15s;
}
.icon-btn:hover {
  background:var(--accent); color:#fff;
  border-color:var(--accent); transform:scale(1.08);
}
.icon-btn svg { width:16px; height:16px; fill:currentColor; }

/* JOURNEY */
#journey { background:transparent; }
.timeline { position:relative; margin-top:56px; padding-left:32px; }
.timeline::before {
  content:''; position:absolute; left:7px; top:8px;
  width:1px; height:calc(100% - 16px);
  background:linear-gradient(to bottom, var(--accent), var(--border));
}
.timeline-item { position:relative; padding-bottom:48px; }
.timeline-item:last-child { padding-bottom:0; }
.timeline-dot {
  position:absolute; left:-28px; top:4px;
  width:14px; height:14px; border-radius:50%;
  border:2px solid var(--accent); background:var(--bg);
  transition:background .3s, box-shadow .3s;
}
.timeline-item:hover .timeline-dot {
  background:var(--accent);
  box-shadow:0 0 12px var(--accent);
}
.timeline-phase { font-size:11px; font-weight:600; letter-spacing:.1em; color:var(--accent); text-transform:uppercase; margin-bottom:6px; }
.timeline-title { font-family:var(--ff-head); font-size:20px; font-weight:700; color:var(--ink); letter-spacing:-.02em; margin-bottom:8px; }
.timeline-body { font-size:14.5px; color:var(--ink2); line-height:1.65; max-width:600px; }
.timeline-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--r); padding:24px;
  transition:transform .25s var(--ease), box-shadow .25s, border-color .25s;
}
.timeline-card:hover {
  transform:translateX(6px);
  box-shadow:0 8px 32px rgba(108,99,255,.08);
  border-color:rgba(108,99,255,.2);
}

/* METRICS */
#metrics { background:transparent; }
.metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; margin-top:56px; }
.metric-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--r-lg); padding:28px;
  transition:transform .25s var(--ease), box-shadow .25s;
}
.metric-card:hover { transform:translateY(-6px); box-shadow:0 16px 48px rgba(108,99,255,.12); }
.metric-icon { width:44px; height:44px; border-radius:10px; background:var(--accent-bg); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:20px; }
.metric-val { font-family:var(--ff-head); font-size:36px; font-weight:800; color:var(--ink); letter-spacing:-.03em; line-height:1; margin-bottom:6px; }
.metric-label { font-size:13px; color:var(--ink3); margin-bottom:20px; }
.metric-bar-track { height:3px; background:var(--border); border-radius:100px; overflow:hidden; }
.metric-bar-fill {
  height:100%;
  background:linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius:100px; width:0%;
  transition:width 1.2s var(--ease);
}

/* CONTACT */
#contact { background:transparent; }
.contact-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:80px; align-items:start; }
.contact-socials { display:flex; flex-direction:column; gap:12px; margin-top:32px; }
.social-link {
  display:flex; align-items:center; gap:14px;
  padding:16px 20px; border-radius:var(--r);
  border:1px solid var(--border); background:var(--surface);
  text-decoration:none; color:var(--ink);
  transition:transform .2s var(--ease), box-shadow .2s, border-color .2s;
}
.social-link:hover { transform:translateX(6px); box-shadow:0 4px 20px rgba(108,99,255,.1); border-color:rgba(108,99,255,.3); }
.social-icon { width:36px; height:36px; border-radius:8px; background:var(--accent-bg); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.social-name { font-size:14px; font-weight:500; }
.social-handle { font-size:12px; color:var(--ink3); }
.contact-form-wrap {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--r-lg); padding:36px;
}
.form-group { margin-bottom:20px; }
.form-label { display:block; font-size:11px; font-weight:600; letter-spacing:.08em; color:var(--ink3); text-transform:uppercase; margin-bottom:8px; }
.form-input, .form-textarea {
  width:100%; padding:13px 16px;
  border-radius:var(--r); border:1px solid var(--border);
  background:var(--surface2); color:var(--ink);
  font-family:var(--ff-body); font-size:14px;
  outline:none; transition:border-color .2s, box-shadow .2s;
}
.form-input:focus, .form-textarea:focus {
  border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(108,99,255,.15);
}
.form-textarea { resize:vertical; min-height:140px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.btn-submit {
  width:100%; padding:14px; border-radius:var(--r);
  background:var(--accent); color:#fff; border:none;
  font-family:var(--ff-body); font-size:14px; font-weight:500;
  cursor:pointer; transition:background .2s, transform .2s, box-shadow .2s;
}
.btn-submit:hover { background:var(--accent2); transform:translateY(-2px); box-shadow:0 8px 24px rgba(108,99,255,.4); }
.form-status { margin-top:14px; font-size:14px; text-align:center; }
.form-status.success { color:#22C55E; }
.form-status.error { color:var(--red); }

/* FOOTER */
footer {
  padding:40px max(24px,5vw);
  border-top:1px solid var(--border);
  display:flex; justify-content:space-between; align-items:center;
  flex-wrap:wrap; gap:16px; position:relative; z-index:2;
}
.footer-copy { font-size:13px; color:var(--ink3); }
.footer-back { font-size:13px; font-weight:500; color:var(--ink2); text-decoration:none; transition:color .2s; cursor:pointer; }
.footer-back:hover { color:var(--accent); }

/* LOADER */
.loader-wrap {
  position:fixed; inset:0; background:var(--bg);
  display:flex; align-items:center; justify-content:center;
  z-index:9998; transition:opacity .6s var(--ease), visibility .6s;
}
.loader-wrap.hidden { opacity:0; visibility:hidden; pointer-events:none; }
.loader-inner { display:flex; flex-direction:column; align-items:center; gap:24px; }
.loader-name {
  font-family:var(--ff-head); font-size:clamp(28px,5vw,48px);
  font-weight:700; letter-spacing:-.02em; color:var(--ink);
  overflow:hidden; display:flex; gap:8px;
}
.loader-name span { display:inline-block; animation:slideUpIn .6s var(--ease) forwards; opacity:0; }
.loader-name span:nth-child(2) { animation-delay:.08s; }
@keyframes slideUpIn { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
.loader-bar-wrap { width:200px; height:1px; background:var(--border); overflow:hidden; }
.loader-bar { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent2)); animation:loadBarAnim 1.6s var(--ease) forwards; }
@keyframes loadBarAnim { from{width:0} to{width:100%} }

/* RESPONSIVE */
@media (max-width:900px) {
  .hero-grid, .about-grid, .contact-grid { grid-template-columns:1fr; gap:40px; }
  .avatar-card { display:none; }
  .project-card { grid-template-columns:1fr; }
  .project-links { flex-direction:row; }
  .nav-links { display:none; }
  .btn-nav { display:none; }
  .hamburger { display:flex; }
  .form-row { grid-template-columns:1fr; }
}
@media (max-width:500px) {
  section { padding:80px 20px; }
  .metrics-grid, .skills-grid { grid-template-columns:1fr 1fr; }
}
`;

// ── ANIMATED BACKGROUND CANVAS ──────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const particles = [];
    const PARTICLE_COUNT = 80;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.005;

      // Subtle moving gradient orbs
      const orbs = [
        { x: w * (.2 + Math.sin(t) * .1), y: h * (.3 + Math.cos(t * .7) * .1), r: Math.min(w,h)*.35, c: "rgba(108,99,255," },
        { x: w * (.8 + Math.cos(t * .5) * .1), y: h * (.6 + Math.sin(t * .8) * .1), r: Math.min(w,h)*.3, c: "rgba(168,85,247," },
        { x: w * (.5 + Math.sin(t * .3) * .15), y: h * (.1 + Math.cos(t) * .08), r: Math.min(w,h)*.25, c: "rgba(34,197,94," },
      ];
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.c + "0.04)");
        g.addColorStop(1, o.c + "0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      // Particles
      particles.forEach(p => { p.update(); p.draw(); });

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,99,255,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Grid dots
      const gSize = 60;
      for (let gx = 0; gx < w; gx += gSize) {
        for (let gy = 0; gy < h; gy += gSize) {
          const dist = Math.sqrt((gx - w/2)**2 + (gy - h/2)**2);
          const alpha = Math.max(0, 0.04 - dist / (w * 4));
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(108,99,255,${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}

// ── TYPED ANIMATION HOOK ────────────────────────────────────────────
function useTyped(roles) {
  const [text, setText] = useState("");
  const riRef = useRef(0);
  const ciRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    let timeout;
    function tick() {
      const current = roles[riRef.current];
      if (!deletingRef.current) {
        ciRef.current++;
        setText(current.slice(0, ciRef.current));
        if (ciRef.current === current.length) {
          deletingRef.current = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
      } else {
        ciRef.current--;
        setText(current.slice(0, ciRef.current));
        if (ciRef.current === 0) {
          deletingRef.current = false;
          riRef.current = (riRef.current + 1) % roles.length;
        }
      }
      timeout = setTimeout(tick, deletingRef.current ? 50 : 90);
    }
    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, []);

  return text;
}

// ── SCROLL REVEAL HOOK ──────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // animate bars
            e.target.querySelectorAll("[data-width]").forEach((bar) => {
              bar.style.width = bar.dataset.width + "%";
            });
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── PROGRESS BAR ────────────────────────────────────────────────────
function useProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      if (bar) bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// ── SVG AVATAR ──────────────────────────────────────────────────────
function AvatarSVG({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="28" r="16" fill="rgba(255,255,255,0.9)" />
      {/* Eyes */}
      <circle cx="34" cy="26" r="2.5" fill="#6C63FF" />
      <circle cx="46" cy="26" r="2.5" fill="#6C63FF" />
      {/* Smile */}
      <path d="M34 32 Q40 38 46 32" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Code bracket left */}
      <path d="M24 18 L18 24 L24 30" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Code bracket right */}
      <path d="M56 18 L62 24 L56 30" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Body / laptop */}
      <rect x="20" y="50" width="40" height="24" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="22" y="52" width="36" height="18" rx="2" fill="rgba(108,99,255,0.4)" />
      {/* Screen lines */}
      <line x1="26" y1="56" x2="36" y2="56" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="59" x2="42" y2="59" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="62" x2="34" y2="62" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Collar / shoulders */}
      <path d="M30 44 Q40 50 50 44" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── GITHUB ICON ──────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── DATA ─────────────────────────────────────────────────────────────
const SKILLS = [
  { icon: "⚙️", name: "C++ / DSA", desc: "Data Structures, Algorithms, competitive programming & system-level logic.", pct: 85 },
  { icon: "⚛️", name: "React.js", desc: "Component architecture, hooks, state management & modern frontend patterns.", pct: 80 },
  { icon: "🟨", name: "JavaScript", desc: "ES6+, async/await, closures, event loop & modern JS ecosystem.", pct: 82 },
  { icon: "🟢", name: "Node.js / Express", desc: "RESTful APIs, middleware, authentication & scalable server architecture.", pct: 78 },
  { icon: "🍃", name: "MongoDB", desc: "Schema design, aggregation pipelines, indexing & Mongoose ODM.", pct: 75 },
  { icon: "🤖", name: "Generative AI", desc: "LLM integration, prompt engineering, OpenAI API & AI-powered app development.", pct: 65 },
  { icon: "🐍", name: "Python / ML", desc: "Machine learning fundamentals, data analysis & AI model integration.", pct: 60 },
  { icon: "🔧", name: "System Design", desc: "Scalable architecture, database design, caching & distributed systems.", pct: 70 },
];

const PROJECTS = [
  {
    num: "EXPERIMENT #001", title: "Apni Dukan", sub: "B2B E-Commerce Platform",
    desc: "Small shopkeepers need a simple platform to order products in bulk without complex supply chains. Built with bulk ordering, cart logic, and real-world order workflows.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Twilio"],
    improve: "Plan to add supplier dashboards, order analytics, credit-based purchasing & AI-assisted recommendations.",
    github: "https://github.com/MOHITGODARA1/ApniDukan", live: "#",
  },
  {
    num: "COMMUNITY PLATFORM", title: "UniLink", sub: "University Networking Platform",
    desc: "A university-focused platform where students connect with peers, share posts, discover opportunities, and build academic or project-based connections.",
    stack: ["React", "Node.js", "REST APIs", "MongoDB", "Tailwind CSS"],
    improve: "Plan to add university verification, real-time chat, group communities & AI-powered recommendations.",
    github: "https://github.com/MOHITGODARA1/UniLink", live: "https://unilink-1.onrender.com",
  },
  {
    num: "AI PLATFORM", title: "DocGen AI", sub: "GitHub Repository Analyzer",
    desc: "AI-powered platform where users paste a GitHub repo link and get structured analysis — structure, key folders, technologies, and project overview.",
    stack: ["React", "Node.js", "GitHub API", "OpenAI API", "Express", "Tailwind CSS"],
    improve: "Plan to add deeper code analysis, auto-generated docs, architecture diagrams & multi-repo comparison.",
    github: "https://github.com/MOHITGODARA1/DocGen-AI", live: "#",
  },
  {
    num: "AI FOR SUSTAINABILITY", title: "AgroTech AI", sub: "Smart Crop Recommendation System",
    desc: "AI-driven platform where farmers input soil parameters to receive intelligent crop recommendations combining ML models with practical agricultural constraints.",
    stack: ["React", "Node.js", "Python", "Machine Learning", "OpenAI API", "Express"],
    improve: "Plan to integrate weather APIs, regional crop databases, yield prediction & multilingual support.",
    github: "https://github.com/MOHITGODARA1/agri-tech", live: "#",
  },
];

const JOURNEY = [
  {
    phase: "Chapter 01 — Foundation", title: "Building the Base",
    body: "Mastering Data Structures & Algorithms using C++ and Java. Building strong problem-solving fundamentals through consistent LeetCode practice and competitive programming. Understanding time complexity, space optimization, and algorithmic thinking.",
  },
  {
    phase: "Chapter 02 — Full Stack", title: "Expanding Horizons",
    body: "Designing scalable backend systems, RESTful APIs, and database schemas with clean architecture principles. Building full-stack applications with React, Node.js, Express, and MongoDB that solve real problems for real users.",
  },
  {
    phase: "Chapter 03 — Gen AI", title: "From Models to Meaning",
    body: "Learning Generative AI fundamentals — LLM concepts, prompt engineering, embeddings, and practical API integration. Focused on building real-world features like AI-powered analysis, intelligent assistants, and automation tools.",
  },
  {
    phase: "Chapter 04 — System Thinking", title: "Thinking in Constraints",
    body: "Solving critical problems on LeetCode while developing a strong system-level mindset. Understanding trade-offs in distributed systems, database design, caching strategies, and high-availability architecture.",
  },
];

const METRICS = [
  { icon: "🎯", val: "250+", label: "LeetCode problems solved across Easy, Medium & Hard", pct: 78 },
  { icon: "🏆", val: "1,650", label: "Contest rating — Top 15% globally", pct: 65 },
  { icon: "✅", val: "4", label: "Certifications from Meta, freeCodeCamp & Coursera", pct: 80 },
  { icon: "📁", val: "12+", label: "Projects built — personal & collaborative", pct: 70 },
];

// ── MAIN APP ─────────────────────────────────────────────────────────
function App() {
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", number: "", message: "" });
  const [formStatus, setFormStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const typedText = useTyped(["Software Development Engineer", "Full Stack Developer", "DSA Enthusiast", "Gen AI Explorer", "Problem Solver"]);

  useProgressBar();
  useReveal();

  // Inject CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = "data:,";
    document.head.appendChild(link);
    return () => { document.head.removeChild(style); };
  }, []);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1900);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus("");
    try {
      await emailjs.send("service_eo6kkri", "template_y1amy1i", {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        message: formData.message,
        time: new Date().toLocaleString(),
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", number: "", message: "" });
    } catch (err) {
      console.error("EMAILJS ERROR:", err);
      setFormStatus("error");
    } finally {
      setSubmitting(false);
    }
  }, [formData]);

  return (
    <>
      {/* PROGRESS BAR */}
      <div id="progress-bar" />

      {/* ANIMATED BG */}
      <AnimatedBackground />
      <div className="noise-overlay" />

      {/* LOADER */}
      <div className={`loader-wrap${loaded ? " hidden" : ""}`}>
        <div className="loader-inner">
          <div className="loader-name">
            <span>Mohit</span>
            <span>Godara</span>
          </div>
          <div className="loader-bar-wrap"><div className="loader-bar" /></div>
        </div>
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <div className="nav-logo-mark">&gt;_</div>
            Mohit Godara
          </a>
          <ul className="nav-links">
            {["about","skills","projects","journey","contact"].map(s => (
              <li key={s}><a href={`#${s}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</a></li>
            ))}
          </ul>
          <div className="nav-right">
            <a href="#contact" className="btn-nav">Hire Me</a>
            <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div id="mobile-menu" className={mobileOpen ? "open" : ""}>
        {["about","skills","projects","journey","metrics","contact"].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMobileOpen(false)}>
            {s.charAt(0).toUpperCase()+s.slice(1)}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left */}
            <div>
              <div className="hero-badge reveal">
                <span className="hero-badge-dot" />
                Available for opportunities
              </div>
              <h1 className="hero-title reveal reveal-delay-1">
                Mohit<br /><span className="accent">Godara</span>
              </h1>
              <div className="hero-role reveal reveal-delay-2">
                <span>{typedText}</span>
                <span id="typed-cursor">|</span>
              </div>
              <p className="hero-desc reveal reveal-delay-3">
                Building scalable backend systems, solving critical DSA problems, and exploring the frontier of Generative AI — one commit at a time.
              </p>
              <div className="hero-ctas reveal reveal-delay-4">
                <a href="#projects" className="btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
                  View Projects
                </a>
                <a href="#contact" className="btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Contact Me
                </a>
              </div>
            </div>

            {/* Right: Avatar Card */}
            <div className="avatar-card reveal reveal-delay-2">
              <div className="avatar-wrap">
                <AvatarSVG size={80} />
              </div>
              <div className="avatar-name">Mohit Godara</div>
              <div className="avatar-role">Full Stack Dev · DSA · Gen AI</div>
              <div className="avatar-status">
                <span style={{width:8,height:8,borderRadius:"50%",background:"#22C55E",display:"inline-block"}}/>
                Open to opportunities
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><div className="hero-stat-val">250+</div><div className="hero-stat-label">LC Solved</div></div>
                <div className="hero-stat"><div className="hero-stat-val">12+</div><div className="hero-stat-label">Projects</div></div>
                <div className="hero-stat"><div className="hero-stat-val">4</div><div className="hero-stat-label">Certs</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            {/* Avatar column */}
            <div className="reveal">
              <div className="about-avatar-wrap">
                <div className="about-avatar-glow" />
                <div className="about-avatar-big">
                  <div className="about-avatar-initials">MG</div>
                </div>
                <div className="code-lines">
                  <div><span className="c-green">const</span> <span className="c-accent">dev</span> = {"{"}</div>
                  <div>&nbsp;&nbsp;name: <span className="c-yellow">"Mohit Godara"</span>,</div>
                  <div>&nbsp;&nbsp;stack: <span className="c-yellow">["JS","C++","AI"]</span>,</div>
                  <div>&nbsp;&nbsp;status: <span className="c-green">"building"</span></div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div className="about-tag-row">
                <span className="about-tag">C++ / DSA</span>
                <span className="about-tag">Full Stack</span>
                <span className="about-tag">Gen AI</span>
                <span className="about-tag">System Design</span>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="section-label reveal">About Me</span>
              <h2 className="section-heading reveal reveal-delay-1" style={{marginBottom:28}}>
                Engineer by curiosity,<br />builder by choice
              </h2>
              <p className="about-body reveal reveal-delay-2">
                I'm Mohit Godara — a Software Development Engineer passionate about building systems that scale. My foundation is rooted in Data Structures & Algorithms using C++ and Java, which gives me the mental framework to tackle complex problems with precision.
              </p>
              <p className="about-body reveal reveal-delay-3">
                From full-stack applications like Apni Dukan and UniLink to AI-powered tools like DocGen AI and AgroTech AI — I enjoy turning ideas into production-ready software. Currently exploring the intersection of backend engineering and Generative AI.
              </p>
              <div className="reveal reveal-delay-4" style={{marginTop:32,display:"flex",gap:12,flexWrap:"wrap"}}>
                <a href="https://github.com/MOHITGODARA1" target="_blank" rel="noreferrer" className="btn-secondary" style={{fontSize:13,padding:"10px 20px"}}>
                  GitHub Profile ↗
                </a>
                <a href="#projects" className="btn-primary" style={{fontSize:13,padding:"10px 20px"}}>
                  See My Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills">
        <div className="container">
          <span className="section-label reveal">Technical Skills</span>
          <h2 className="section-heading reveal reveal-delay-1">Tools of the trade</h2>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <div key={s.name} className={`skill-card reveal reveal-delay-${(i%4)+1}`}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-desc">{s.desc}</div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" data-width={s.pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="container">
          <span className="section-label reveal">Projects Lab</span>
          <h2 className="section-heading reveal reveal-delay-1">Experiments & Builds</h2>
          <p className="reveal reveal-delay-2" style={{color:"var(--ink2)",marginTop:12,maxWidth:520,fontSize:15}}>
            Hands-on experiments where I test ideas, learn through failure, and refine my engineering thinking.
          </p>
          <div className="projects-list">
            {PROJECTS.map((p, i) => (
              <div key={p.title} className={`project-card reveal reveal-delay-${(i%3)+1}`}>
                <div>
                  <div className="project-number">{p.num}</div>
                  <div className="project-title">{p.title}</div>
                  <div className="project-sub">{p.sub}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-stack">
                    {p.stack.map(t => <span key={t} className="tech-pill">{t}</span>)}
                  </div>
                  <div className="project-improve">↗ {p.improve}</div>
                </div>
                <div className="project-links">
                  <a href={p.github} target="_blank" rel="noreferrer" className="icon-btn" title="GitHub"><GitHubIcon /></a>
                  <a href={p.live} target="_blank" rel="noreferrer" className="icon-btn" title="Live Demo"><ExternalIcon /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ── */}
      <section id="journey">
        <div className="container">
          <span className="section-label reveal">Learning Journey</span>
          <h2 className="section-heading reveal reveal-delay-1">How I Think</h2>
          <p className="reveal reveal-delay-2" style={{color:"var(--ink2)",marginTop:12,fontSize:15,maxWidth:500}}>
            A structured progression from fundamentals to frontier technologies.
          </p>
          <div className="timeline">
            {JOURNEY.map((j, i) => (
              <div key={j.title} className="timeline-item">
                <div className="timeline-dot" />
                <div className={`timeline-card reveal reveal-delay-${i+1}`}>
                  <div className="timeline-phase">{j.phase}</div>
                  <div className="timeline-title">{j.title}</div>
                  <div className="timeline-body">{j.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section id="metrics">
        <div className="container">
          <span className="section-label reveal">Validated Progress</span>
          <h2 className="section-heading reveal reveal-delay-1">Metrics Dashboard</h2>
          <p className="reveal reveal-delay-2" style={{color:"var(--ink2)",marginTop:12,fontSize:15,maxWidth:500}}>
            A measurable snapshot of my learning consistency and execution.
          </p>
          <div className="metrics-grid">
            {METRICS.map((m, i) => (
              <div key={m.val} className={`metric-card reveal reveal-delay-${i+1}`}>
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" data-width={m.pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="container">
          <div className="contact-grid">
            <div>
              <span className="section-label reveal">Contact</span>
              <h2 className="section-heading reveal reveal-delay-1" style={{marginBottom:16}}>Let's Talk</h2>
              <p className="reveal reveal-delay-2" style={{color:"var(--ink2)",fontSize:15,lineHeight:1.7,maxWidth:380,marginBottom:8}}>
                Have a project, opportunity, or question? I'd love to hear from you.
              </p>
              <div className="contact-socials">
                <a href="mailto:mohitgodara@email.com" className="social-link reveal reveal-delay-1">
                  <div className="social-icon">✉️</div>
                  <div><div className="social-name">Email</div><div className="social-handle">mohitgodara@email.com</div></div>
                </a>
                <a href="https://github.com/MOHITGODARA1" target="_blank" rel="noreferrer" className="social-link reveal reveal-delay-2">
                  <div className="social-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  </div>
                  <div><div className="social-name">GitHub</div><div className="social-handle">@MOHITGODARA1</div></div>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link reveal reveal-delay-3">
                  <div className="social-icon"><LinkedInIcon /></div>
                  <div><div className="social-name">LinkedIn</div><div className="social-handle">Mohit Godara</div></div>
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="reveal reveal-delay-2">
              <div className="contact-form-wrap">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Mohit Godara" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" type="tel" name="number" value={formData.number} onChange={handleChange} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell me about your project or opportunity..." />
                  </div>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                  {formStatus === "success" && <p className="form-status success">✅ Message sent successfully!</p>}
                  {formStatus === "error"   && <p className="form-status error">❌ Failed to send. Please try again.</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">© 2026 Mohit Godara. Built with precision.</div>
        <span className="footer-back" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
          Back to top ↑
        </span>
      </footer>
    </>
  );
}

export default App;