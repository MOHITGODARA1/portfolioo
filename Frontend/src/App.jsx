import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

emailjs.init("jSxFrOlhAOiiDJbCA");

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&family=Unbounded:wght@400;700;900&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --bg:#030508;
  --bg2:#080C12;
  --surface:#0D1117;
  --surface2:#111820;
  --surface3:#161E28;
  --border:#1C2535;
  --border2:#243040;
  --ink:#E8F0FF;
  --ink2:#8899BB;
  --ink3:#445566;
  --green:#00FF88;
  --green2:#00CC6A;
  --green-dim:rgba(0,255,136,0.08);
  --blue:#4DA6FF;
  --purple:#8B6FFF;
  --orange:#FF8C42;
  --red:#FF4D6D;
  --ff-head:'Unbounded',sans-serif;
  --ff-body:'Space Grotesk',sans-serif;
  --ff-mono:'JetBrains Mono',monospace;
  --ease:cubic-bezier(.16,1,.3,1);
  --r:8px; --r-lg:16px;
}

html { scroll-behavior:smooth; }
body { font-family:var(--ff-body); background:var(--bg); color:var(--ink); line-height:1.6; overflow-x:hidden; }

body::before {
  content:''; position:fixed; inset:0; z-index:1000; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px);
}

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:var(--green); border-radius:2px; }

#progress-bar { position:fixed; top:0; left:0; height:1px; background:linear-gradient(90deg,var(--green),var(--blue)); width:0%; z-index:9999; }
#bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }

nav {
  position:fixed; top:0; width:100%; z-index:100;
  padding:0 max(24px,5vw);
  background:rgba(3,5,8,0.9); backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.nav-inner { max-width:1300px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:60px; }
.nav-logo { display:flex; align-items:center; gap:8px; font-family:var(--ff-mono); font-weight:500; font-size:13px; text-decoration:none; color:var(--green); letter-spacing:.06em; }
.nav-logo-bracket { color:var(--ink3); }
.nav-links { display:flex; align-items:center; gap:24px; list-style:none; }
.nav-links a { font-family:var(--ff-mono); font-size:11px; color:var(--ink3); text-decoration:none; letter-spacing:.05em; transition:color .2s; position:relative; }
.nav-links a::before { content:'//'; position:absolute; left:-18px; color:var(--green); opacity:0; transition:opacity .2s; font-size:10px; }
.nav-links a:hover { color:var(--ink); }
.nav-links a:hover::before { opacity:1; }
.btn-nav { padding:7px 16px; border-radius:4px; border:1px solid var(--green); color:var(--green); font-family:var(--ff-mono); font-size:11px; cursor:pointer; text-decoration:none; background:transparent; transition:all .2s; }
.btn-nav:hover { background:var(--green); color:var(--bg); }
.hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; background:none; border:none; }
.hamburger span { display:block; width:20px; height:1px; background:var(--ink); }

#mobile-menu { display:none; position:fixed; inset:0; top:60px; background:var(--bg); z-index:99; padding:32px 24px; flex-direction:column; gap:20px; }
#mobile-menu.open { display:flex; }
#mobile-menu a { font-family:var(--ff-mono); font-size:18px; color:var(--ink2); text-decoration:none; }
#mobile-menu a:hover { color:var(--green); }

section { padding:110px max(24px,5vw); position:relative; z-index:2; }
.container { max-width:1300px; margin:0 auto; }

.section-eyebrow { font-family:var(--ff-mono); font-size:11px; color:var(--green); letter-spacing:.15em; text-transform:uppercase; display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.section-eyebrow::before { content:''; display:block; width:32px; height:1px; background:var(--green); }
.section-eyebrow::after  { content:''; display:block; width:16px; height:1px; background:var(--border2); }
.section-heading { font-family:var(--ff-head); font-size:clamp(26px,3.5vw,46px); font-weight:900; letter-spacing:-.04em; line-height:1; color:var(--ink); }
.section-heading .hl { color:var(--green); }

/* REVEAL ANIMATIONS */
.reveal       { opacity:0; transform:translateY(28px);  transition:opacity .65s var(--ease), transform .65s var(--ease); }
.reveal.visible{ opacity:1; transform:translateY(0); }
.reveal-left  { opacity:0; transform:translateX(-32px); transition:opacity .65s var(--ease), transform .65s var(--ease); }
.reveal-left.visible  { opacity:1; transform:translateX(0); }
.reveal-right { opacity:0; transform:translateX(32px);  transition:opacity .65s var(--ease), transform .65s var(--ease); }
.reveal-right.visible { opacity:1; transform:translateX(0); }
.reveal-scale { opacity:0; transform:scale(.9); transition:opacity .6s var(--ease), transform .6s var(--ease); }
.reveal-scale.visible { opacity:1; transform:scale(1); }
.reveal-delay-1{transition-delay:.08s;} .reveal-delay-2{transition-delay:.16s;}
.reveal-delay-3{transition-delay:.24s;} .reveal-delay-4{transition-delay:.32s;} .reveal-delay-5{transition-delay:.40s;}

@keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse-glow  { 0%,100%{box-shadow:0 0 20px rgba(0,255,136,.15)} 50%{box-shadow:0 0 40px rgba(0,255,136,.35)} }
@keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes slideUpIn   { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes loadBarAnim { from{width:0} to{width:100%} }
@keyframes shimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

@keyframes slideInFromRight {
  from { opacity:0; transform:translateX(60px) scale(0.97); }
  to   { opacity:1; transform:translateX(0)    scale(1); }
}
@keyframes slideInFromLeft {
  from { opacity:0; transform:translateX(-60px) scale(0.97); }
  to   { opacity:1; transform:translateX(0)     scale(1); }
}
@keyframes slideOutToLeft {
  from { opacity:1; transform:translateX(0)    scale(1); }
  to   { opacity:0; transform:translateX(-60px) scale(0.97); }
}
@keyframes slideOutToRight {
  from { opacity:1; transform:translateX(0)   scale(1); }
  to   { opacity:0; transform:translateX(60px) scale(0.97); }
}

/* HERO */
#hero { min-height:100vh; display:flex; align-items:center; padding-top:100px; }
.hero-layout { display:grid; grid-template-columns:1fr 420px; gap:80px; align-items:center; }
.hero-prompt { font-family:var(--ff-mono); font-size:12px; color:var(--ink3); margin-bottom:20px; display:flex; align-items:center; gap:6px; }
.hero-prompt .dollar { color:var(--green); }
.hero-title { font-family:var(--ff-head); font-size:clamp(44px,6vw,88px); font-weight:900; letter-spacing:-.05em; line-height:.95; color:var(--ink); margin-bottom:12px; }
.hero-title .name-green { color:var(--green); }
.hero-role { font-family:var(--ff-mono); font-size:clamp(12px,1.4vw,15px); color:var(--ink3); margin-bottom:28px; min-height:22px; display:flex; align-items:center; gap:6px; }
.hero-role .typed { color:var(--blue); }
.typed-cursor { color:var(--green); animation:blink .8s infinite; }
.hero-desc { font-size:15px; color:var(--ink2); line-height:1.75; max-width:500px; margin-bottom:40px; }
.hero-ctas { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:48px; }

.btn-primary {
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 22px; border-radius:4px; background:var(--green); color:var(--bg);
  font-family:var(--ff-mono); font-size:12px; font-weight:700;
  border:none; cursor:pointer; text-decoration:none; transition:all .25s; letter-spacing:.03em;
  position:relative; overflow:hidden;
}
.btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); transform:translateX(-100%); transition:transform .4s; }
.btn-primary:hover::after { transform:translateX(100%); }
.btn-primary:hover { background:var(--green2); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,255,136,.3); }

.btn-secondary { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:4px; background:transparent; color:var(--ink2); font-family:var(--ff-mono); font-size:12px; border:1px solid var(--border2); cursor:pointer; text-decoration:none; transition:all .2s; }
.btn-secondary:hover { border-color:var(--ink3); color:var(--ink); transform:translateY(-2px); }

.btn-download {
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 22px; border-radius:4px; background:transparent; color:var(--green);
  font-family:var(--ff-mono); font-size:12px; border:1px solid rgba(0,255,136,.4);
  cursor:pointer; text-decoration:none; transition:all .2s; letter-spacing:.03em;
}
.btn-download:hover { background:var(--green-dim); transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,255,136,.15); }
.btn-download svg { transition:transform .2s; }
.btn-download:hover svg { transform:translateY(2px); }

.hero-meta { display:flex; gap:32px; align-items:center; }
.hero-meta-item { display:flex; flex-direction:column; gap:2px; }
.hero-meta-val { font-family:var(--ff-head); font-size:22px; font-weight:900; color:var(--green); letter-spacing:-.03em; }
.hero-meta-label { font-family:var(--ff-mono); font-size:10px; color:var(--ink3); letter-spacing:.08em; }
.hero-meta-sep { width:1px; height:32px; background:var(--border2); }

/* TERMINAL */
.terminal-card { background:var(--surface); border:1px solid var(--border2); border-radius:var(--r-lg); overflow:hidden; box-shadow:0 0 80px rgba(0,255,136,.06), 0 32px 80px rgba(0,0,0,.5); animation:float 4s ease-in-out infinite; }
.terminal-bar { background:var(--surface2); padding:10px 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid var(--border); }
.t-dot{width:10px;height:10px;border-radius:50%;} .t-dot-r{background:#FF5F57;} .t-dot-y{background:#FEBC2E;} .t-dot-g{background:#28C840;}
.terminal-title { font-family:var(--ff-mono); font-size:11px; color:var(--ink3); margin:0 auto; }
.terminal-body { padding:24px; font-family:var(--ff-mono); font-size:12.5px; line-height:1.9; }
.t-line{display:flex;gap:8px;} .t-prompt{color:var(--green);flex-shrink:0;} .t-cmd{color:var(--ink);}
.t-out{color:var(--ink3);} .t-out .t-green{color:var(--green);} .t-out .t-blue{color:var(--blue);} .t-out .t-orange{color:var(--orange);} .t-out .t-purple{color:var(--purple);}
.t-gap{height:8px;} .t-cursor{display:inline-block;width:8px;height:14px;background:var(--green);animation:blink .8s infinite;vertical-align:middle;}

/* ABOUT */
#about{background:transparent;}
.about-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:center;}
.about-code-block{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-lg);overflow:hidden;}
.code-block-header{background:var(--surface2);padding:10px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);}
.code-file{font-family:var(--ff-mono);font-size:11px;color:var(--ink3);margin-left:auto;}
.code-content{padding:24px;font-family:var(--ff-mono);font-size:12px;line-height:2;}
.ln{color:var(--border2);display:inline-block;width:20px;text-align:right;margin-right:16px;font-size:11px;user-select:none;}
.kw{color:var(--purple);} .str{color:var(--orange);} .fn{color:var(--blue);} .cm{color:var(--ink3);} .ob{color:var(--ink);} .num{color:var(--green);}
.about-body{font-size:15px;color:var(--ink2);line-height:1.8;margin-bottom:18px;}
.about-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px;}
.about-tag{padding:5px 12px;border-radius:4px;background:transparent;color:var(--green);font-family:var(--ff-mono);font-size:11px;border:1px solid rgba(0,255,136,.25);letter-spacing:.04em;transition:background .2s;}
.about-tag:hover{background:var(--green-dim);}

/* SKILLS */
#skills{background:transparent;}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1px;background:var(--border);border-radius:var(--r-lg);overflow:hidden;margin-top:56px;}
.skill-card{background:var(--surface);padding:24px 22px;transition:background .2s;position:relative;overflow:hidden;}
.skill-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:0;transition:opacity .3s;}
.skill-card:hover{background:var(--surface2);}
.skill-card:hover::before{opacity:1;}
.skill-lang{font-family:var(--ff-mono);font-size:9.5px;color:var(--ink3);letter-spacing:.12em;margin-bottom:10px;}
.skill-name{font-family:var(--ff-head);font-size:13px;font-weight:700;color:var(--ink);margin-bottom:6px;letter-spacing:-.02em;}
.skill-desc{font-size:12px;color:var(--ink3);line-height:1.6;margin-bottom:14px;}
.skill-bar-track{height:2px;background:var(--border);border-radius:100px;overflow:hidden;}
.skill-bar-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--blue));border-radius:100px;width:0%;transition:width 1.4s var(--ease);}
.skill-pct{font-family:var(--ff-mono);font-size:10px;color:var(--ink3);margin-top:5px;}

/* ========= HORIZONTAL CAROUSEL SECTION ========= */
.carousel-section {
  padding: 110px max(24px,5vw);
  position: relative;
  z-index: 2;
}

/* Header row: eyebrow + heading + nav controls inline */
.carousel-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 20px;
}
.carousel-header-left {}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.carousel-counter-inline {
  font-family: var(--ff-mono);
  font-size: 12px;
  color: var(--ink3);
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.carousel-counter-inline .cur { color: var(--green); font-size: 22px; font-family: var(--ff-head); font-weight: 900; }

.carousel-nav-btns {
  display: flex;
  gap: 8px;
}
.carousel-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid var(--border2);
  background: var(--surface);
  color: var(--ink2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  transition: all .2s var(--ease);
  user-select: none;
}
.carousel-btn:hover:not(:disabled) {
  background: var(--green);
  color: var(--bg);
  border-color: var(--green);
  box-shadow: 0 6px 18px rgba(0,255,136,.3);
}
.carousel-btn:disabled { opacity:.28; cursor:not-allowed; }

/* Progress bar */
.carousel-progress-track {
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 40px;
}
.carousel-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--blue));
  border-radius: 2px;
  transition: width .5s var(--ease);
}

/* Dot indicators */
.carousel-dots {
  display: flex;
  gap: 10px;
  margin-top: 28px;
  justify-content: center;
}
.carousel-dot-pip {
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: var(--border2);
  cursor: pointer;
  transition: all .3s var(--ease);
}
.carousel-dot-pip.active {
  background: var(--green);
  width: 48px;
  box-shadow: 0 0 8px rgba(0,255,136,.5);
}

/* Scroll hint */
.carousel-scroll-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--ink3);
  margin-top: 20px;
  justify-content: center;
}
.scroll-hint-arrow {
  display: flex;
  gap: 3px;
}
.scroll-hint-arrow span {
  display: block;
  width: 6px;
  height: 6px;
  border-right: 1.5px solid var(--green);
  border-bottom: 1.5px solid var(--green);
  transform: rotate(-45deg);
  animation: arrowPulse 1.2s ease-in-out infinite;
}
.scroll-hint-arrow span:nth-child(2) { animation-delay: .15s; opacity:.7; }
.scroll-hint-arrow span:nth-child(3) { animation-delay: .30s; opacity:.4; }
@keyframes arrowPulse { 0%,100%{opacity:1} 50%{opacity:.2} }

/* Card viewport */
.carousel-viewport {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  min-height: 480px;
}

.carousel-card-slot {
  position: absolute;
  inset: 0;
}
.carousel-card-slot.entering-right { animation: slideInFromRight .5s var(--ease) forwards; }
.carousel-card-slot.entering-left  { animation: slideInFromLeft  .5s var(--ease) forwards; }
.carousel-card-slot.leaving-left   { animation: slideOutToLeft   .4s var(--ease) forwards; pointer-events:none; }
.carousel-card-slot.leaving-right  { animation: slideOutToRight  .4s var(--ease) forwards; pointer-events:none; }

/* ─── SPLIT PROJECT CARD ─── */
.proj-split-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  min-height: 480px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--r-lg);
  overflow: hidden;
  transition: box-shadow .3s;
}
.proj-split-card:hover {
  box-shadow: 0 0 0 1px rgba(0,255,136,.1), 0 32px 80px rgba(0,0,0,.5);
}

/* Left: visual panel */
.proj-visual {
  position: relative;
  background: var(--surface2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--border);
}
.proj-visual-top {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
}
.proj-visual-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 40% 40%, rgba(0,255,136,.07) 0%, transparent 65%),
              radial-gradient(ellipse at 80% 80%, rgba(77,166,255,.05) 0%, transparent 60%);
}
.proj-icon-wrap {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.proj-icon-circle {
  width: 90px;
  height: 90px;
  border-radius: 22px;
  background: var(--surface3);
  border: 1px solid var(--border2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 0 40px rgba(0,255,136,.08);
  transition: transform .3s var(--ease), box-shadow .3s;
}
.proj-split-card:hover .proj-icon-circle {
  transform: scale(1.06);
  box-shadow: 0 0 60px rgba(0,255,136,.18);
}
.proj-type-tag {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--green);
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 1px solid rgba(0,255,136,.2);
  border-radius: 3px;
  background: rgba(0,255,136,.04);
}
.proj-code-bg {
  position: absolute;
  inset: 0;
  font-family: var(--ff-mono);
  font-size: 9.5px;
  line-height: 1.9;
  color: rgba(255,255,255,.028);
  padding: 16px;
  user-select: none;
  white-space: pre;
  overflow: hidden;
  z-index: 0;
}
.proj-visual-bottom {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  background: rgba(0,0,0,.2);
}
.proj-num-label {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--ink3);
  letter-spacing: .1em;
  margin-bottom: 10px;
}
.proj-stat-row {
  display: flex;
  gap: 16px;
}
.proj-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.proj-stat-val {
  font-family: var(--ff-head);
  font-size: 15px;
  font-weight: 700;
  color: var(--green);
  letter-spacing: -.02em;
}
.proj-stat-key {
  font-family: var(--ff-mono);
  font-size: 9px;
  color: var(--ink3);
  letter-spacing: .08em;
}

/* Right: description panel */
.proj-desc-panel {
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.proj-desc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}
.proj-title-wrap {}
.proj-main-title {
  font-family: var(--ff-head);
  font-size: 22px;
  font-weight: 900;
  color: var(--ink);
  letter-spacing: -.04em;
  line-height: 1.1;
  margin-bottom: 6px;
}
.proj-sub-title {
  font-family: var(--ff-mono);
  font-size: 11px;
  color: var(--green);
  letter-spacing: .04em;
}
.proj-action-links {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}
.icon-btn{width:34px;height:34px;border-radius:7px;border:1px solid var(--border2);background:transparent;display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--ink3);transition:all .2s;flex-shrink:0;}
.icon-btn:hover{background:var(--green);color:var(--bg);border-color:var(--green);transform:scale(1.08);}
.icon-btn svg{width:14px;height:14px;}

.proj-divider {
  height: 1px;
  background: var(--border);
  margin: 18px 0;
}
.proj-full-desc {
  font-size: 14px;
  color: var(--ink2);
  line-height: 1.8;
  margin-bottom: 20px;
  flex: 1;
}
.proj-section-label {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--ink3);
  letter-spacing: .12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.proj-tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 20px;
}
.tech-pill{padding:4px 10px;border-radius:4px;background:var(--surface3);color:var(--ink3);font-family:var(--ff-mono);font-size:10px;border:1px solid var(--border);transition:border-color .2s,color .2s;}
.tech-pill:hover{border-color:rgba(0,255,136,.3);color:var(--ink2);}

.proj-roadmap {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--bg2);
  border-left: 2px solid var(--green);
}
.proj-roadmap-head {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--green);
  letter-spacing: .1em;
  margin-bottom: 5px;
}
.proj-roadmap-text {
  font-family: var(--ff-mono);
  font-size: 11px;
  color: var(--ink3);
  line-height: 1.65;
}

/* ─── CERT SPLIT CARD ─── */
.cert-split-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  min-height: 420px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.cert-split-card:hover {
  box-shadow: 0 0 0 1px rgba(0,255,136,.1), 0 32px 80px rgba(0,0,0,.5);
}
.cert-visual {
  background: var(--surface2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  position: relative;
  overflow: hidden;
}
.cert-visual-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(77,166,255,.07) 0%, transparent 65%);
}
.cert-badge-big {
  position: relative;
  z-index: 1;
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background: var(--surface3);
  border: 1px solid var(--border2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  margin-bottom: 20px;
  box-shadow: 0 0 50px rgba(77,166,255,.1);
  transition: transform .3s var(--ease);
}
.cert-split-card:hover .cert-badge-big { transform: scale(1.05) rotate(-2deg); }
.cert-issuer-big {
  position: relative;
  z-index: 1;
  font-family: var(--ff-head);
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.02em;
  margin-bottom: 8px;
  text-align: center;
}
.cert-verified-big {
  position: relative;
  z-index: 1;
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(0,255,136,.08);
  border: 1px solid rgba(0,255,136,.25);
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--green);
  letter-spacing: .08em;
}
.cert-desc-panel {
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cert-index {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--ink3);
  letter-spacing: .1em;
  margin-bottom: 14px;
}
.cert-main-title {
  font-family: var(--ff-head);
  font-size: 19px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.04em;
  line-height: 1.25;
  margin-bottom: 10px;
}
.cert-issuer-label {
  font-family: var(--ff-mono);
  font-size: 11px;
  color: var(--blue);
  margin-bottom: 20px;
}
.cert-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 20px;
}
.cert-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--ff-mono);
  font-size: 11px;
  color: var(--ink3);
  margin-bottom: 24px;
}
.cert-date-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  flex-shrink: 0;
}
.cert-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(0,255,136,.3);
  color: var(--green);
  font-family: var(--ff-mono);
  font-size: 11px;
  text-decoration: none;
  transition: all .2s;
  width: fit-content;
}
.cert-cta-link:hover {
  background: var(--green-dim);
  border-color: var(--green);
  gap: 12px;
}

/* Image overrides when real img is provided */
.proj-visual-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  z-index: 1;
  transition: transform .5s var(--ease);
}
.proj-split-card:hover .proj-visual-img { transform: scale(1.03); }

.proj-img-overlay-dark {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(3,5,8,0.15) 0%,
    rgba(3,5,8,0.05) 50%,
    rgba(3,5,8,0.75) 100%
  );
}

/* Cert image fills the left panel */
.cert-visual-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  transition: transform .5s var(--ease);
  border-radius: 0;
}
.cert-split-card:hover .cert-visual-img { transform: scale(1.03); }
.cert-img-overlay-dark {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(135deg, rgba(3,5,8,0.45) 0%, rgba(3,5,8,0.2) 100%);
}
.cert-visual-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
@media (max-width:960px) {
  .carousel-header { flex-direction:column; align-items:flex-start; }
  .proj-split-card, .cert-split-card { grid-template-columns:1fr; min-height:auto; }
  .proj-visual { min-height: 200px; border-right:none; border-bottom:1px solid var(--border); }
  .proj-desc-panel { padding:24px 20px; }
  .cert-visual { padding:28px 20px; border-right:none; border-bottom:1px solid var(--border); }
  .cert-desc-panel { padding:24px 20px; }
  .carousel-viewport { min-height: auto; }
  .carousel-card-slot { position: relative; inset: auto; }
}

/* ACHIEVEMENTS */
#achievements{background:transparent;}
.achievements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:56px;}
.achievement-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px;transition:transform .25s var(--ease),box-shadow .25s,border-color .25s;position:relative;overflow:hidden;}
.achievement-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:0;transition:opacity .3s;}
.achievement-card:hover{transform:translateY(-4px);border-color:var(--border2);box-shadow:0 16px 48px rgba(0,0,0,.4);}
.achievement-card:hover::after{opacity:1;}
.achievement-rank{font-family:var(--ff-head);font-size:36px;font-weight:900;color:var(--green);letter-spacing:-.04em;line-height:1;margin-bottom:12px;}
.achievement-title{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:6px;}
.achievement-desc{font-size:13px;color:var(--ink3);line-height:1.6;}
.achievement-date{font-family:var(--ff-mono);font-size:10px;color:var(--ink3);margin-top:12px;letter-spacing:.06em;}
.achievement-badge{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;background:var(--green-dim);border:1px solid rgba(0,255,136,.2);display:flex;align-items:center;justify-content:center;font-size:16px;}



/* ZIGZAG TIMELINE */
#journey{background:transparent;}
.timeline-zigzag{position:relative;margin-top:60px;display:flex;flex-direction:column;align-items:center;}
.timeline-zigzag::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--green),rgba(0,255,136,.08));transform:translateX(-50%);}
.tz-item{width:100%;display:grid;grid-template-columns:1fr 56px 1fr;align-items:center;margin-bottom:40px;}
.tz-item:last-child{margin-bottom:0;}
.tz-card-left{grid-column:1;text-align:right;padding-right:32px;}
.tz-card-right{grid-column:3;text-align:left;padding-left:32px;}
.tz-empty{visibility:hidden;}
.tz-dot-wrap{grid-column:2;display:flex;justify-content:center;align-items:center;z-index:2;}
.tz-dot{width:14px;height:14px;border-radius:50%;border:2px solid var(--green);background:var(--bg);transition:background .3s,box-shadow .3s;flex-shrink:0;}
.tz-item:hover .tz-dot{background:var(--green);box-shadow:0 0 16px rgba(0,255,136,.7);}
.tz-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px 24px;transition:transform .25s var(--ease),border-color .25s,box-shadow .25s;}
.tz-card-left .tz-card:hover{transform:translateX(-4px);border-color:var(--border2);box-shadow:0 8px 32px rgba(0,0,0,.4);}
.tz-card-right .tz-card:hover{transform:translateX(4px);border-color:var(--border2);box-shadow:0 8px 32px rgba(0,0,0,.4);}
.tz-phase{font-family:var(--ff-mono);font-size:10px;color:var(--green);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;}
.tz-title{font-family:var(--ff-head);font-size:16px;font-weight:700;color:var(--ink);letter-spacing:-.03em;margin-bottom:8px;}
.tz-body{font-size:13px;color:var(--ink2);line-height:1.7;}

/* METRICS */
#metrics{background:transparent;}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--border);border-radius:var(--r-lg);overflow:hidden;margin-top:56px;}
.metric-card{background:var(--surface);padding:28px;transition:background .2s;}
.metric-card:hover{background:var(--surface2);}
.metric-icon{font-size:18px;margin-bottom:16px;}
.metric-val{font-family:var(--ff-head);font-size:38px;font-weight:900;color:var(--green);letter-spacing:-.04em;line-height:1;margin-bottom:6px;}
.metric-label{font-size:12.5px;color:var(--ink3);line-height:1.5;margin-bottom:16px;}
.metric-bar-track{height:1px;background:var(--border);}
.metric-bar-fill{height:100%;background:var(--green);width:0%;transition:width 1.4s var(--ease);}

/* CONTACT */
#contact{background:transparent;}
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:start;}
.contact-socials{display:flex;flex-direction:column;gap:10px;margin-top:32px;}
.social-link{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);text-decoration:none;color:var(--ink);transition:transform .2s var(--ease),border-color .2s;font-family:var(--ff-mono);}
.social-link:hover{transform:translateX(4px);border-color:var(--border2);}
.social-icon{width:32px;height:32px;border-radius:6px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid var(--border2);}
.social-name{font-size:12px;font-weight:500;color:var(--ink);}
.social-handle{font-size:11px;color:var(--ink3);margin-top:1px;}
.contact-form-wrap{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-lg);}
.form-header{padding:14px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;font-family:var(--ff-mono);font-size:11px;color:var(--ink3);}
.form-header-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse-glow 2s infinite;}
.form-body{padding:28px;}
.form-group{margin-bottom:18px;}
.form-label{display:block;font-family:var(--ff-mono);font-size:10px;font-weight:500;letter-spacing:.1em;color:var(--ink3);text-transform:uppercase;margin-bottom:8px;}
.form-input,.form-textarea{width:100%;padding:11px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--bg2);color:var(--ink);font-family:var(--ff-mono);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s;}
.form-input:focus,.form-textarea:focus{border-color:var(--green);box-shadow:0 0 0 2px rgba(0,255,136,.1);}
.form-textarea{resize:vertical;min-height:120px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.btn-submit{width:100%;padding:12px;border-radius:var(--r);background:var(--green);color:var(--bg);border:none;font-family:var(--ff-mono);font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
.btn-submit:hover{background:var(--green2);box-shadow:0 8px 24px rgba(0,255,136,.25);}
.btn-submit:disabled{opacity:.5;cursor:not-allowed;}
.form-status{margin-top:12px;font-family:var(--ff-mono);font-size:11px;text-align:center;}
.form-status.success{color:var(--green);} .form-status.error{color:var(--red);}

footer{padding:32px max(24px,5vw);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;position:relative;z-index:2;}
.footer-copy{font-family:var(--ff-mono);font-size:11px;color:var(--ink3);}
.footer-back{font-family:var(--ff-mono);font-size:11px;color:var(--ink3);cursor:pointer;transition:color .2s;}
.footer-back:hover{color:var(--green);}

.loader-wrap{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:9998;transition:opacity .5s var(--ease),visibility .5s;}
.loader-wrap.hidden{opacity:0;visibility:hidden;pointer-events:none;}
.loader-inner{display:flex;flex-direction:column;align-items:flex-start;gap:14px;}
.loader-line{font-family:var(--ff-mono);font-size:clamp(11px,1.4vw,13px);color:var(--green);letter-spacing:.05em;opacity:0;animation:slideUpIn .4s var(--ease) forwards;}
.loader-line:nth-child(2){color:var(--ink2);animation-delay:.15s;}
.loader-line:nth-child(3){color:var(--ink3);animation-delay:.30s;}
.loader-line:nth-child(4){color:var(--green);animation-delay:.45s;}
.loader-bar-wrap{width:240px;height:1px;background:var(--border);overflow:hidden;margin-top:8px;}
.loader-bar{height:100%;background:var(--green);animation:loadBarAnim 1.8s var(--ease) forwards;animation-delay:.6s;}

@media (max-width:960px) {
  .hero-layout,.about-grid,.contact-grid{grid-template-columns:1fr;gap:40px;}
  .hero-layout .terminal-card{display:none;}
  .nav-links,.btn-nav{display:none;}
  .hamburger{display:flex;}
  .form-row{grid-template-columns:1fr;}
  .timeline-zigzag::before{left:16px;transform:none;}
  .tz-item{grid-template-columns:32px 1fr;}
  .tz-card-left{grid-column:2;text-align:left;padding-right:0;padding-left:16px;}
  .tz-card-right{grid-column:2;text-align:left;padding-left:16px;}
  .tz-dot-wrap{grid-column:1;justify-content:flex-start;padding-left:9px;}
  .tz-empty{display:none;}
}
@media (max-width:560px) {
  section{padding:80px 18px;}
  .metrics-grid,.skills-grid{grid-template-columns:1fr 1fr;}
}
`;

// ─── Animated Background ───────────────────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId, w, h;
    const particles = [];

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x=Math.random()*w; this.y=Math.random()*h;
        this.r=Math.random()*1.2+.2;
        this.vx=(Math.random()-.5)*.22; this.vy=(Math.random()-.5)*.22;
        this.alpha=Math.random()*.35+.05;
        this.color=Math.random()>.7?"0,255,136":"77,166,255";
      }
      update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>w||this.y<0||this.y>h)this.reset();}
      draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill();}
    }

    resize(); window.addEventListener("resize",resize);
    for(let i=0;i<60;i++) particles.push(new Particle());

    let t=0;
    function draw() {
      ctx.clearRect(0,0,w,h); t+=.003;
      const gs=80;
      for(let gx=0;gx<w;gx+=gs) for(let gy=0;gy<h;gy+=gs){ctx.beginPath();ctx.arc(gx,gy,.6,0,Math.PI*2);ctx.fillStyle="rgba(28,37,53,0.7)";ctx.fill();}
      [{x:.15+Math.sin(t)*.08,y:.25+Math.cos(t*.6)*.08,c:"0,255,136"},{x:.85+Math.cos(t*.5)*.07,y:.7+Math.sin(t*.8)*.07,c:"77,166,255"},{x:.5+Math.sin(t*.4)*.1,y:.05,c:"139,111,255"}].forEach(o=>{
        const ox=o.x*w,oy=o.y*h,r=Math.min(w,h)*.4;
        const g=ctx.createRadialGradient(ox,oy,0,ox,oy,r);
        g.addColorStop(0,`rgba(${o.c},0.035)`);g.addColorStop(1,`rgba(${o.c},0)`);
        ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      });
      particles.forEach(p=>{p.update();p.draw();});
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<80){ctx.beginPath();ctx.strokeStyle=`rgba(0,255,136,${.04*(1-d/80)})`;ctx.lineWidth=.5;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}
      }
      animId=requestAnimationFrame(draw);
    }
    draw();
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} id="bg-canvas"/>;
}

// ─── Typed text hook ───────────────────────────────────────────────────────
function useTyped(roles) {
  const [text,setText]=useState("");
  const ri=useRef(0),ci=useRef(0),del=useRef(false);
  useEffect(()=>{
    let t;
    function tick(){
      const cur=roles[ri.current];
      if(!del.current){ci.current++;setText(cur.slice(0,ci.current));if(ci.current===cur.length){del.current=true;t=setTimeout(tick,1800);return;}}
      else{ci.current--;setText(cur.slice(0,ci.current));if(ci.current===0){del.current=false;ri.current=(ri.current+1)%roles.length;}}
      t=setTimeout(tick,del.current?45:85);
    }
    t=setTimeout(tick,500);return()=>clearTimeout(t);
  },[]);
  return text;
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────
function useReveal() {
  useEffect(()=>{
    const els=document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale");
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add("visible");
          e.target.querySelectorAll("[data-width]").forEach(b=>b.style.width=b.dataset.width+"%");
          obs.unobserve(e.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -40px 0px"});
    els.forEach(el=>obs.observe(el));return()=>obs.disconnect();
  });
}

function useProgressBar(){
  useEffect(()=>{
    const bar=document.getElementById("progress-bar");
    const fn=()=>{const el=document.documentElement;if(bar)bar.style.width=(el.scrollTop/(el.scrollHeight-el.clientHeight))*100+"%";};
    window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);
  },[]);
}

// ─── Horizontal Carousel with scroll hijack ───────────────────────────────
function HorizontalCarousel({ items, renderCard, sectionId, eyebrow, heading, headingHighlight, subtext }) {
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState("idle");
  const sectionRef = useRef(null);
  const cooldownRef = useRef(false);
  const currentRef = useRef(0);
  const total = items.length;

  useEffect(() => { currentRef.current = current; }, [current]);

  const canGoNext = current < total - 1;
  const canGoPrev = current > 0;

  const navigate = useCallback((dir) => {
    if (cooldownRef.current) return;
    const next = currentRef.current + dir;
    if (next < 0 || next >= total) return;

    cooldownRef.current = true;
    setAnimState(dir > 0 ? "leaving-left" : "leaving-right");

    setTimeout(() => {
      setCurrent(next);
      currentRef.current = next;
      setAnimState(dir > 0 ? "entering-right" : "entering-left");
      setTimeout(() => {
        setAnimState("idle");
        cooldownRef.current = false;
      }, 520);
    }, 360);
  }, [total]);

  const viewportRef = useRef(null);

  // Scroll hijack — only fires when the card viewport is FULLY visible
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 960;

    const handleWheel = (e) => {
      if (isMobile()) return;

      // Use the card viewport element, not the whole section
      const card = viewportRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight;
      const navH = 70; // nav bar height

      // The card must be COMPLETELY visible — top below nav, bottom above fold
      const cardFullyVisible = rect.top >= navH && rect.bottom <= vh;

      if (!cardFullyVisible) return;

      const delta = e.deltaY || e.deltaX;

      if (delta > 0 && currentRef.current < total - 1) {
        e.preventDefault();
        navigate(1);
      } else if (delta < 0 && currentRef.current > 0) {
        e.preventDefault();
        navigate(-1);
      }
      // At boundary → normal page scroll continues
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [navigate, total]);

  // Touch swipe — horizontal
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) navigate(dx > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const progressPct = ((current) / (total - 1)) * 100;

  return (
    <section
      id={sectionId}
      className="carousel-section"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container">
        {/* Header row */}
        <div className="carousel-header">
          <div className="carousel-header-left">
            <span className="section-eyebrow reveal">{eyebrow}</span>
            <h2 className="section-heading reveal reveal-delay-1">
              {heading} <span className="hl">{headingHighlight}</span>
            </h2>
            {subtext && (
              <p className="reveal reveal-delay-2" style={{color:"var(--ink3)",marginTop:10,fontSize:13,fontFamily:"var(--ff-mono)"}}>
                {subtext}
              </p>
            )}
          </div>

          <div className="carousel-controls">
            <div className="carousel-counter-inline">
              <span className="cur">{String(current + 1).padStart(2,"0")}</span>
              <span style={{color:"var(--border2)",margin:"0 3px",fontSize:16}}>/</span>
              <span>{String(total).padStart(2,"0")}</span>
            </div>
            <div className="carousel-nav-btns">
              <button className="carousel-btn" onClick={() => navigate(-1)} disabled={!canGoPrev} title="Previous">←</button>
              <button className="carousel-btn" onClick={() => navigate(1)}  disabled={!canGoNext}  title="Next">→</button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="carousel-progress-track">
          <div className="carousel-progress-fill" style={{width: `${progressPct}%`}}/>
        </div>

        {/* Viewport */}
        <div className="carousel-viewport" ref={viewportRef}>
          <div className={`carousel-card-slot${animState !== "idle" ? ` ${animState}` : ""}`}>
            {renderCard(items[current], current)}
          </div>
        </div>

        {/* Dot pills + scroll hint */}
        <div className="carousel-dots">
          {items.map((_, i) => (
            <div
              key={i}
              className={`carousel-dot-pip${i === current ? " active" : ""}`}
              onClick={() => { if (!cooldownRef.current) navigate(i > current ? 1 : -1); }}
            />
          ))}
        </div>

        <div className="carousel-scroll-hint">
          <div className="scroll-hint-arrow">
            <span/><span/><span/>
          </div>
          <span>scroll down to navigate · swipe on mobile</span>
          <div className="scroll-hint-arrow" style={{transform:"scaleX(-1)"}}>
            <span/><span/><span/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────
const GitHubIcon=()=><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const ExternalIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const DownloadIcon=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// ─── Data ─────────────────────────────────────────────────────────────────
const SKILLS=[
  {lang:"LANG",      icon:"⚙️", name:"C++ / DSA",            desc:"Data Structures, Algorithms, competitive programming & system-level logic.",pct:85},
  {lang:"FRAMEWORK", icon:"⚛️", name:"React.js",             desc:"Component architecture, hooks, state management & modern frontend patterns.",pct:80},
  {lang:"LANG",      icon:"🟨", name:"JavaScript",           desc:"ES6+, async/await, closures, event loop & modern JS ecosystem.",pct:82},
  {lang:"RUNTIME",   icon:"🟢", name:"Node.js / Express",    desc:"RESTful APIs, middleware, JWT auth & scalable server architecture.",pct:78},
  {lang:"DATABASE",  icon:"🍃", name:"MongoDB",              desc:"Schema design, aggregation pipelines, indexing & Mongoose ODM.",pct:75},
  {lang:"PLATFORM",  icon:"🤖", name:"Generative AI",        desc:"LLM integration, prompt engineering, ChatGPT API & AI-powered apps.",pct:65},
  {lang:"LANG",      icon:"🐍", name:"Python / ML",          desc:"Machine learning fundamentals, data analysis & AI model integration.",pct:60},
  {lang:"CONCEPT",   icon:"🔧", name:"System Design",        desc:"Scalable architecture, DB design, caching & distributed systems.",pct:70},
  {lang:"TOOL",      icon:"🐳", name:"Docker / AWS",         desc:"Containerization, cloud deployment, CI/CD basics & DevOps fundamentals.",pct:55},
  {lang:"PROTOCOL",  icon:"🔌", name:"Socket.io / WebSockets",desc:"Real-time bidirectional communication, live chat & event-driven apps.",pct:72},
];

const PROJECTS=[
  // ▼ To add a project image: set img to a URL or relative path e.g. img:"/images/apni-dukan.png"
  // If img is null/undefined, the icon emoji + code bg is shown as fallback
  {num:"01",icon:"🏪",img:"../Apnidukan.png",title:"Apni Dukan",sub:"B2B Wholesale E-Commerce Platform",desc:"Scalable wholesale e-commerce platform adopted by 50+ retailers. Features bulk ordering, MongoDB multi-document transactions for atomic order placement, and full inventory management.",stack:["React","Node.js","Express","MongoDB","Twilio","Cloudinary","REST APIs"],improve:"Plan to add supplier dashboards, order analytics, credit-based purchasing & AI-assisted recommendations.",github:"https://github.com/MOHITGODARA1/Apni-DUkan-new",live:"https://apni-dukan-admin-omega.vercel.app/"},
  {num:"02",icon:"🎓",img:"../Unilink.png",title:"UniLink",sub:"University Networking Platform",desc:"University platform engaging 1000+ students for project sharing and cross-department collaboration. JWT + bcrypt auth, real-time Socket.io chat.",stack:["React","Node.js","Express","MongoDB","Socket.io","Twilio","Cloudinary"],improve:"Plan to add university verification, group communities & AI-powered recommendations.",github:"https://github.com/MOHITGODARA1/UniLink",live:"https://unilink-1.onrender.com"},
  {num:"03",icon:"🤖",img:"../Docgen.png",title:"DocGen AI",sub:"GitHub Repository Analyzer",desc:"AI-powered platform that ingests GitHub repos and generates structured analysis — dependencies, execution flow, architecture insights, and AI-generated documentation via ChatGPT pipelines.",stack:["React","Node.js","Express","MongoDB","Python","ChatGPT API","REST APIs"],improve:"Plan to add architecture diagrams, multi-repo comparison & auto-generated README.",github:"https://github.com/MOHITGODARA1/Docgen-AI",live:"https://docgen-ai-b085.onrender.com"},
  {num:"04",icon:"🌾",img:null,title:"AgroTech AI",sub:"Smart Crop Recommendation System",desc:"AI-driven platform where farmers input soil parameters to receive intelligent crop recommendations combining ML models with practical agricultural constraints.",stack:["React","Node.js","Python","Machine Learning","OpenAI API","Express"],improve:"Plan to integrate weather APIs, yield prediction & multilingual support.",github:"https://github.com/MOHITGODARA1/agri-tech",live:"#"},
];

const ACHIEVEMENTS=[
  {rank:"200+",title:"LeetCode Problems Solved",desc:"Across Easy, Medium & Hard — consistent practice since Jan 2025.",date:"Since Jan' 25",badge:"💡"},
  {rank:"1,657",title:"LeetCode Contest Rating",desc:"Top 21% globally — consistent competitive programming performance.",date:"Feb' 26",badge:"🏆"},
  {rank:"6th",title:"Code-A-Haunt Hackathon",desc:"Ranked 6th out of 100 participants in a competitive hackathon.",date:"Nov' 24",badge:"🥇"},
  {rank:"7.62",title:"CGPA at LPU",desc:"B.Tech CSE at Lovely Professional University, Phagwara, Punjab.",date:"Since Aug' 23",badge:"🎓"},
];

const CERTS=[
  // ▼ To add a cert image: set img to a URL e.g. img:"/certs/infosys.png"
  // If img is null, the large emoji icon is shown as fallback
  {icon:"🤖",img:"../infosys.png",issuer:"Infosys",title:"ChatGPT-4 Prompt Engineering: Generative AI & LLM",date:"Aug' 25",link:"#"},
  {icon:"🏢",img:"../allsoft.png",issuer:"Allsoft Solutions",title:"Project Completion — MERN Stack Training",date:"Jul' 25",link:"#"},
  {icon:"☕",img:"../java.png",issuer:"IamNeo",title:"The Complete Java Certification Course",date:"May' 25",link:"#"},
  {icon:"⚙️",img:"../cpp.png",issuer:"IamNeo",title:"The Complete C++ Certification Course",date:"Dec' 24",link:"#"},
  {icon:"🌐",img:"../google.png",issuer:"Google",title:"The Bits and Bytes of Computer Networking",date:"Sep' 24",link:"#"},
];

const JOURNEY=[
  {phase:"Chapter 01 — Foundation",title:"Building the Base",body:"Mastering Data Structures & Algorithms using C++ and Java. Strong problem-solving fundamentals through consistent LeetCode practice and competitive programming."},
  {phase:"Chapter 02 — Full Stack",title:"Expanding Horizons",body:"Designing scalable backend systems, RESTful APIs, and database schemas. Building full-stack applications with React, Node.js, Express, and MongoDB."},
  {phase:"Chapter 03 — Gen AI",title:"From Models to Meaning",body:"Learning Generative AI fundamentals — LLMs, prompt engineering, embeddings, and practical ChatGPT API integration for real-world features."},
  {phase:"Chapter 04 — System Thinking",title:"Thinking in Constraints",body:"Solving critical LeetCode problems while developing a system-level mindset. Understanding trade-offs in distributed systems, DB design, and caching."},
];

const METRICS=[
  {icon:"🎯",val:"200+",label:"LeetCode problems solved",pct:78},
  {icon:"🏆",val:"1,657",label:"Contest rating — Top 21% globally",pct:65},
  {icon:"✅",val:"5",label:"Certifications completed",pct:85},
  {icon:"📁",val:"4+",label:"Production projects shipped",pct:70},
];

// ─── Card renderers ────────────────────────────────────────────────────────
// Project stats per card
const PROJ_STATS = {
  "01": [{val:"50+",key:"RETAILERS"},{val:"MERN",key:"STACK"},{val:"REST",key:"API"}],
  "02": [{val:"1K+",key:"USERS"},{val:"RT CHAT",key:"SOCKET"},{val:"JWT",key:"AUTH"}],
  "03": [{val:"AI",key:"POWERED"},{val:"GPT-4",key:"ENGINE"},{val:"PYTHON",key:"BACKEND"}],
  "04": [{val:"ML",key:"MODEL"},{val:"CROP AI",key:"ENGINE"},{val:"PYTHON",key:"BACKEND"}],
};

function renderProjectCard(p) {
  const codeSample = `// ${p.title} — core logic\nasync function init() {\n  const db = await connect(MONGO_URI);\n  const app = express();\n  app.use(cors(), json());\n  app.use("/api", router);\n  app.listen(PORT);\n}\ninit().catch(console.error);`;
  const stats = PROJ_STATS[p.num] || [];
  const hasImg = Boolean(p.img);

  return (
    <div className="proj-split-card">
      {/* LEFT — Visual panel */}
      <div className="proj-visual">
        {hasImg ? (
          <>
            <img src={p.img} alt={p.title} className="proj-visual-img"/>
            <div className="proj-img-overlay-dark"/>
            {/* Stats bar still shown over image */}
            <div className="proj-visual-bottom" style={{position:"relative",zIndex:3}}>
              <div className="proj-num-label">PROJECT_{p.num}</div>
              <div className="proj-stat-row">
                {stats.map(s => (
                  <div key={s.key} className="proj-stat">
                    <div className="proj-stat-val">{s.val}</div>
                    <div className="proj-stat-key">{s.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="proj-code-bg">{codeSample}</div>
            <div className="proj-visual-top">
              <div className="proj-visual-gradient"/>
              <div className="proj-icon-wrap">
                <div className="proj-icon-circle">{p.icon}</div>
                <div className="proj-type-tag">{p.sub.split(" ").slice(-2).join(" ")}</div>
              </div>
            </div>
            <div className="proj-visual-bottom">
              <div className="proj-num-label">PROJECT_{p.num}</div>
              <div className="proj-stat-row">
                {stats.map(s => (
                  <div key={s.key} className="proj-stat">
                    <div className="proj-stat-val">{s.val}</div>
                    <div className="proj-stat-key">{s.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT — Description panel */}
      <div className="proj-desc-panel">
        <div className="proj-desc-header">
          <div className="proj-title-wrap">
            <div className="proj-main-title">{p.title}</div>
            <div className="proj-sub-title">{p.sub}</div>
          </div>
          <div className="proj-action-links">
            <a href={p.github} target="_blank" rel="noreferrer" className="icon-btn" title="GitHub"><GitHubIcon/></a>
            <a href={p.live}   target="_blank" rel="noreferrer" className="icon-btn" title="Live Demo"><ExternalIcon/></a>
          </div>
        </div>

        <div className="proj-divider"/>

        <p className="proj-full-desc">{p.desc}</p>

        <div className="proj-section-label">// tech_stack</div>
        <div className="proj-tech-grid">
          {p.stack.map(t => <span key={t} className="tech-pill">{t}</span>)}
        </div>

        <div className="proj-roadmap">
          <div className="proj-roadmap-head">↗ ROADMAP</div>
          <div className="proj-roadmap-text">{p.improve}</div>
        </div>
      </div>
    </div>
  );
}

function renderCertCard(c, idx) {
  const hasImg = Boolean(c.img);

  return (
    <div className="cert-split-card">
      {/* LEFT — Visual */}
      <div className="cert-visual" style={{overflow:"hidden"}}>
        {hasImg ? (
          <>
            <img src={c.img} alt={c.issuer} className="cert-visual-img"/>
            <div className="cert-img-overlay-dark"/>
            <div className="cert-visual-content">
              <div className="cert-verified-big">✓ VERIFIED</div>
            </div>
          </>
        ) : (
          <>
            <div className="cert-visual-glow"/>
            <div className="cert-badge-big">{c.icon}</div>
            <div className="cert-issuer-big">{c.issuer}</div>
            <div className="cert-verified-big">✓ VERIFIED</div>
          </>
        )}
      </div>

      {/* RIGHT — Info */}
      <div className="cert-desc-panel">
        <div className="cert-index">CERT_{String(idx + 1).padStart(2,"0")}</div>
        <div className="cert-main-title">{c.title}</div>
        <div className="cert-issuer-label">Issued by {c.issuer}</div>
        <div className="cert-divider"/>
        <div className="cert-date-row">
          <div className="cert-date-dot"/>
          Completed&nbsp;<strong style={{color:"var(--ink)"}}>{c.date}</strong>
        </div>
        <a href={c.link} className="cert-cta-link">
          View Certificate →
        </a>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [loaded,setLoaded]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [formData,setFormData]=useState({name:"",email:"",number:"",message:""});
  const [formStatus,setFormStatus]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const typedText=useTyped(["Software Development Engineer","Full Stack Developer","DSA & C++ Enthusiast","Gen AI Explorer","Problem Solver"]);

  useProgressBar(); useReveal();

  useEffect(()=>{const s=document.createElement("style");s.textContent=GLOBAL_CSS;document.head.appendChild(s);return()=>document.head.removeChild(s);},[]);
  useEffect(()=>{const t=setTimeout(()=>setLoaded(true),2200);return()=>clearTimeout(t);},[]);

  const handleChange=useCallback(e=>setFormData(p=>({...p,[e.target.name]:e.target.value})),[]);
  const handleSubmit=useCallback(async e=>{
    e.preventDefault();setSubmitting(true);setFormStatus("");
    try{
      await emailjs.send("service_eo6kkri","template_y1amy1i",{name:formData.name,email:formData.email,number:formData.number,message:formData.message,time:new Date().toLocaleString()});
      setFormStatus("success");setFormData({name:"",email:"",number:"",message:""});
    }catch(err){setFormStatus("error");}
    finally{setSubmitting(false);}
  },[formData]);

  return (
    <>
      <div id="progress-bar"/>
      <AnimatedBackground/>

      {/* LOADER */}
      <div className={`loader-wrap${loaded?" hidden":""}`}>
        <div className="loader-inner">
          <div className="loader-line">$ ssh mohit@portfolio.dev</div>
          <div className="loader-line">Connected. Loading profile...</div>
          <div className="loader-line">Mounting projects, skills, achievements...</div>
          <div className="loader-line">✓ Ready.</div>
          <div className="loader-bar-wrap"><div className="loader-bar"/></div>
        </div>
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <span className="nav-logo-bracket">[</span>&nbsp;MG&nbsp;<span className="nav-logo-bracket">]</span>
          </a>
          <ul className="nav-links">
            {["about","skills","projects","achievements","certifications","journey","contact"].map(s=>(
              <li key={s}><a href={`#${s}`}>{s}</a></li>
            ))}
          </ul>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <a href="Mohit_CV.pdf" download className="btn-download" style={{padding:"7px 14px",fontSize:"11px"}}>
              <DownloadIcon/>&nbsp;resume
            </a>
            <a href="#contact" className="btn-nav">hire_me()</a>
            <button className="hamburger" onClick={()=>setMobileOpen(o=>!o)}><span/><span/><span/></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div id="mobile-menu" className={mobileOpen?"open":""}>
        {["about","skills","projects","achievements","certifications","journey","contact"].map(s=>(
          <a key={s} href={`#${s}`} onClick={()=>setMobileOpen(false)}>/{s}</a>
        ))}
        <a href="Mohit_Godara_Resume.pdf" download style={{color:"var(--green)"}}>⬇ download resume</a>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="container">
          <div className="hero-layout">
            <div>
              <div className="hero-prompt reveal">
                <span className="dollar">$</span>
                <span style={{color:"var(--ink3)"}}>whoami</span>
              </div>
              <h1 className="hero-title reveal reveal-delay-1">MOHIT<br/><span className="name-green">GODARA</span></h1>
              <div className="hero-role reveal reveal-delay-2">
                <span style={{color:"var(--ink3)"}}>~/role:&nbsp;</span>
                <span className="typed">{typedText}</span>
                <span className="typed-cursor">█</span>
              </div>
              <p className="hero-desc reveal reveal-delay-3">
                Building scalable backend systems, solving critical DSA problems in C++ and Java, and exploring the frontier of Generative AI — one commit at a time.
              </p>
              <div className="hero-ctas reveal reveal-delay-4">
                <a href="#projects" className="btn-primary">./view-projects</a>
                <a href="#contact" className="btn-secondary">./contact-me</a>
                <a href="Mohit_CV.pdf" download className="btn-download"><DownloadIcon/>&nbsp;resume.pdf</a>
              </div>
              <div className="hero-meta reveal reveal-delay-5" style={{marginTop:36}}>
                <div className="hero-meta-item"><div className="hero-meta-val">200+</div><div className="hero-meta-label">LC_SOLVED</div></div>
                <div className="hero-meta-sep"/>
                <div className="hero-meta-item"><div className="hero-meta-val">1,657</div><div className="hero-meta-label">RATING</div></div>
                <div className="hero-meta-sep"/>
                <div className="hero-meta-item"><div className="hero-meta-val">4+</div><div className="hero-meta-label">PROJECTS</div></div>
                <div className="hero-meta-sep"/>
                <div className="hero-meta-item"><div className="hero-meta-val">5</div><div className="hero-meta-label">CERTS</div></div>
              </div>
            </div>

            <div className="terminal-card reveal-right reveal-delay-2">
              <div className="terminal-bar">
                <div className="t-dot t-dot-r"/><div className="t-dot t-dot-y"/><div className="t-dot t-dot-g"/>
                <div className="terminal-title">mohit@portfolio ~ </div>
              </div>
              <div className="terminal-body">
                <div className="t-line"><span className="t-prompt">❯</span><span className="t-cmd"> cat developer.json</span></div>
                <div className="t-gap"/>
                <div className="t-line"><span className="t-out">{"{"}</span></div>
                <div className="t-line"><span className="t-out">&nbsp;&nbsp;<span className="t-blue">"name"</span>: <span className="t-green">"Mohit Godara"</span>,</span></div>
                <div className="t-line"><span className="t-out">&nbsp;&nbsp;<span className="t-blue">"role"</span>: <span className="t-green">"SDE / Full Stack"</span>,</span></div>
                <div className="t-line"><span className="t-out">&nbsp;&nbsp;<span className="t-blue">"stack"</span>: [<span className="t-orange">"C++"</span>, <span className="t-orange">"JS"</span>, <span className="t-orange">"React"</span>],</span></div>
                <div className="t-line"><span className="t-out">&nbsp;&nbsp;<span className="t-blue">"leetcode"</span>: <span className="t-purple">1657</span>,</span></div>
                <div className="t-line"><span className="t-out">&nbsp;&nbsp;<span className="t-blue">"status"</span>: <span className="t-green">"open_to_work"</span></span></div>
                <div className="t-line"><span className="t-out">{"}"}</span></div>
                <div className="t-gap"/>
                <div className="t-line"><span className="t-prompt">❯</span><span className="t-cmd"> git log --oneline -3</span></div>
                <div className="t-gap"/>
                <div className="t-line"><span className="t-out"><span className="t-orange">a3f2c1</span> feat: AgroTech AI crop system</span></div>
                <div className="t-line"><span className="t-out"><span className="t-orange">b91d4e</span> feat: DocGen AI repo analyzer</span></div>
                <div className="t-line"><span className="t-out"><span className="t-orange">c55f3a</span> feat: UniLink platform</span></div>
                <div className="t-gap"/>
                <div className="t-line"><span className="t-prompt">❯</span><span className="t-cmd"> <span className="t-cursor"/></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="reveal-left">
              <div className="about-code-block">
                <div className="code-block-header">
                  <div className="t-dot t-dot-r"/><div className="t-dot t-dot-y"/><div className="t-dot t-dot-g"/>
                  <div className="code-file">profile.cpp</div>
                </div>
                <div className="code-content">
                  <div><span className="ln">1</span><span className="cm">// Mohit Godara — Developer Profile</span></div>
                  <div><span className="ln">2</span><span className="kw">class </span><span className="fn">Developer</span><span className="ob"> {"{"}</span></div>
                  <div><span className="ln">3</span><span className="kw">&nbsp;&nbsp;public:</span></div>
                  <div><span className="ln">4</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;string </span><span className="fn">name</span><span className="ob"> = </span><span className="str">"Mohit Godara"</span><span className="ob">;</span></div>
                  <div><span className="ln">5</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;string </span><span className="fn">uni</span><span className="ob"> = </span><span className="str">"LPU, Punjab"</span><span className="ob">;</span></div>
                  <div><span className="ln">6</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;float </span><span className="fn">cgpa</span><span className="ob"> = </span><span className="num">7.62</span><span className="ob">;</span></div>
                  <div><span className="ln">7</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;int </span><span className="fn">lc_rating</span><span className="ob"> = </span><span className="num">1657</span><span className="ob">;</span></div>
                  <div><span className="ln">8</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;bool </span><span className="fn">open_to_work</span><span className="ob"> = </span><span className="num">true</span><span className="ob">;</span></div>
                  <div><span className="ln">9</span></div>
                  <div><span className="ln">10</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;vector&lt;string&gt; </span><span className="fn">skills</span><span className="ob"> = {"{"}</span></div>
                  <div><span className="ln">11</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="str">"C++"</span><span className="ob">, </span><span className="str">"JavaScript"</span><span className="ob">, </span><span className="str">"React"</span><span className="ob">,</span></div>
                  <div><span className="ln">12</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="str">"Node.js"</span><span className="ob">, </span><span className="str">"MongoDB"</span><span className="ob">,</span></div>
                  <div><span className="ln">13</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="str">"Docker"</span><span className="ob">, </span><span className="str">"Socket.io"</span><span className="ob">, </span><span className="str">"Gen AI"</span></div>
                  <div><span className="ln">14</span><span className="ob">&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</span><span className="ob">;</span></div>
                  <div><span className="ln">15</span><span className="ob">{"}"}</span><span className="ob">;</span></div>
                </div>
              </div>
              <div className="about-tags" style={{marginTop:16}}>
                {["C++ / DSA","Full Stack","Gen AI","System Design","Docker","Socket.io"].map(t=>(
                  <span key={t} className="about-tag">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="section-eyebrow reveal">about_me.md</span>
              <h2 className="section-heading reveal reveal-delay-1" style={{marginBottom:24}}>Engineer by curiosity,<br/><span className="hl">builder</span> by choice</h2>
              <p className="about-body reveal reveal-delay-2">I'm Mohit Godara — a B.Tech CSE student at LPU with a passion for building systems that scale. My foundation is rooted in Data Structures & Algorithms using C++ and Java, giving me the mental framework to tackle complex problems with precision.</p>
              <p className="about-body reveal reveal-delay-3">From full-stack apps like Apni Dukan (50+ retailers) and UniLink (1000+ students) to AI-powered tools like DocGen AI — I enjoy turning ideas into production-ready software. Currently exploring the intersection of backend engineering and Generative AI.</p>
              <p className="about-body reveal reveal-delay-4" style={{fontSize:13,color:"var(--ink3)"}}>6-week MERN training at Allsoft Solutions · LeetCode Top 21% · Hackathon 6th/100</p>
              <div className="reveal reveal-delay-4" style={{marginTop:28,display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href="https://github.com/MOHITGODARA1" target="_blank" rel="noreferrer" className="btn-secondary" style={{fontSize:11}}><GitHubIcon/>&nbsp;GitHub</a>
                <a href="https://www.linkedin.com/in/mohit-godara816/" target="_blank" rel="noreferrer" className="btn-secondary" style={{fontSize:11}}>LinkedIn ↗</a>
                <a href="Mohit_CV.pdf" download className="btn-download" style={{fontSize:11}}><DownloadIcon/>&nbsp;resume.pdf</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <span className="section-eyebrow reveal">tech_stack.json</span>
          <h2 className="section-heading reveal reveal-delay-1">Tools of the <span className="hl">trade</span></h2>
          <p className="reveal reveal-delay-2" style={{color:"var(--ink3)",marginTop:10,fontSize:13,fontFamily:"var(--ff-mono)"}}>// 10 technologies I ship with</p>
          <div className="skills-grid">
            {SKILLS.map((s,i)=>(
              <div key={s.name} className={`skill-card reveal reveal-delay-${(i%4)+1}`}>
                <div className="skill-lang">{s.lang}</div>
                <div className="skill-name">{s.icon} {s.name}</div>
                <div className="skill-desc">{s.desc}</div>
                <div className="skill-bar-track"><div className="skill-bar-fill" data-width={s.pct}/></div>
                <div className="skill-pct">{s.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS — horizontal carousel */}
      <HorizontalCarousel
        items={PROJECTS}
        renderCard={renderProjectCard}
        sectionId="projects"
        eyebrow="projects/"
        heading="Experiments &"
        headingHighlight="Builds"
        subtext="// scroll down when centered · use arrows · swipe on mobile"
      />

      {/* ACHIEVEMENTS */}
      <section id="achievements">
        <div className="container">
          <span className="section-eyebrow reveal">achievements.log</span>
          <h2 className="section-heading reveal reveal-delay-1">Validated <span className="hl">Progress</span></h2>
          <div className="achievements-grid">
            {ACHIEVEMENTS.map((a,i)=>(
              <div key={a.title} className={`achievement-card reveal-scale reveal-delay-${(i%4)+1}`}>
                <div className="achievement-badge">{a.badge}</div>
                <div className="achievement-rank">{a.rank}</div>
                <div className="achievement-title">{a.title}</div>
                <div className="achievement-desc">{a.desc}</div>
                <div className="achievement-date">{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS — horizontal carousel */}
      <HorizontalCarousel
        items={CERTS}
        renderCard={renderCertCard}
        sectionId="certifications"
        eyebrow="certificates/"
        heading="Certified"
        headingHighlight="Skills"
        subtext="// scroll down when centered · use arrows · swipe on mobile"
      />

      {/* JOURNEY — ZIGZAG */}
      <section id="journey">
        <div className="container">
          <span className="section-eyebrow reveal" style={{justifyContent:"center"}}>journey.md</span>
          <h2 className="section-heading reveal reveal-delay-1" style={{textAlign:"center"}}>How I <span className="hl">Think</span></h2>
          <p className="reveal reveal-delay-2" style={{color:"var(--ink3)",marginTop:10,fontSize:13,fontFamily:"var(--ff-mono)",textAlign:"center"}}>
            // a structured progression from fundamentals to frontier
          </p>
          <div className="timeline-zigzag">
            {JOURNEY.map((j,i)=>{
              const isLeft=i%2===0;
              return(
                <div key={j.title} className="tz-item">
                  {isLeft?(
                    <>
                      <div className={`tz-card-left reveal-left reveal-delay-${(i%3)+1}`}>
                        <div className="tz-card">
                          <div className="tz-phase">{j.phase}</div>
                          <div className="tz-title">{j.title}</div>
                          <div className="tz-body">{j.body}</div>
                        </div>
                      </div>
                      <div className="tz-dot-wrap"><div className="tz-dot"/></div>
                      <div className="tz-empty"/>
                    </>
                  ):(
                    <>
                      <div className="tz-empty"/>
                      <div className="tz-dot-wrap"><div className="tz-dot"/></div>
                      <div className={`tz-card-right reveal-right reveal-delay-${(i%3)+1}`}>
                        <div className="tz-card">
                          <div className="tz-phase">{j.phase}</div>
                          <div className="tz-title">{j.title}</div>
                          <div className="tz-body">{j.body}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section id="metrics">
        <div className="container">
          <span className="section-eyebrow reveal">metrics.json</span>
          <h2 className="section-heading reveal reveal-delay-1">By the <span className="hl">Numbers</span></h2>
          <div className="metrics-grid">
            {METRICS.map((m,i)=>(
              <div key={m.val} className={`metric-card reveal-scale reveal-delay-${i+1}`}>
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-bar-track"><div className="metric-bar-fill" data-width={m.pct}/></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <div className="contact-grid">
            <div>
              <span className="section-eyebrow reveal">contact.sh</span>
              <h2 className="section-heading reveal reveal-delay-1" style={{marginBottom:14}}>Let's <span className="hl">Talk</span></h2>
              <p className="reveal reveal-delay-2" style={{color:"var(--ink2)",fontSize:14,lineHeight:1.7,maxWidth:360,marginBottom:8}}>
                Open to full-time roles, internships, and collaborations. Have a project or opportunity? Let's build something.
              </p>
              <div className="contact-socials">
                <a href="mailto:mohitgodara816@gmail.com" className="social-link reveal reveal-delay-1">
                  <div className="social-icon">✉️</div>
                  <div><div className="social-name">Email</div><div className="social-handle">mohitgodara816@gmail.com</div></div>
                </a>
                <a href="https://github.com/MOHITGODARA1" target="_blank" rel="noreferrer" className="social-link reveal reveal-delay-2">
                  <div className="social-icon"><GitHubIcon/></div>
                  <div><div className="social-name">GitHub</div><div className="social-handle">@MOHITGODARA1</div></div>
                </a>
                <a href="https://www.linkedin.com/in/mohit-godara816/" target="_blank" rel="noreferrer" className="social-link reveal reveal-delay-3">
                  <div className="social-icon">💼</div>
                  <div><div className="social-name">LinkedIn</div><div className="social-handle">mohit-godara816</div></div>
                </a>
                <a href="tel:+919057164791" className="social-link reveal reveal-delay-4">
                  <div className="social-icon">📱</div>
                  <div><div className="social-name">Phone</div><div className="social-handle">+91 9057164791</div></div>
                </a>
                <a href="Mohit_CV.pdf" download className="social-link reveal reveal-delay-4" style={{borderColor:"rgba(0,255,136,.3)"}}>
                  <div className="social-icon" style={{background:"var(--green-dim)",borderColor:"rgba(0,255,136,.2)"}}>📄</div>
                  <div><div className="social-name" style={{color:"var(--green)"}}>Download Resume</div><div className="social-handle">Mohit_Godara_Resume.pdf</div></div>
                </a>
              </div>
            </div>
            <div className="reveal-right reveal-delay-2">
              <div className="contact-form-wrap">
                <div className="form-header">
                  <div className="form-header-dot"/>
                  send_message.js — active
                </div>
                <div className="form-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">name</label>
                        <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name"/>
                      </div>
                      <div className="form-group">
                        <label className="form-label">phone</label>
                        <input className="form-input" type="tel" name="number" value={formData.number} onChange={handleChange} placeholder="+91 xxxxx xxxxx"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">email</label>
                      <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">message</label>
                      <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} required placeholder="// describe your project or opportunity..."/>
                    </div>
                    <button type="submit" className="btn-submit" disabled={submitting}>
                      {submitting?"sending...":"$ ./send-message.sh"}
                    </button>
                    {formStatus==="success"&&<p className="form-status success">✓ message sent successfully!</p>}
                    {formStatus==="error"&&<p className="form-status error">✗ failed to send. try again.</p>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">// © 2026 Mohit Godara · built with precision</div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="Mohit_Godara_Resume.pdf" download className="btn-download" style={{padding:"6px 14px",fontSize:"10px"}}>
            <DownloadIcon/>&nbsp;resume.pdf
          </a>
          <span className="footer-back" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>^ back_to_top()</span>
        </div>
      </footer>
    </>
  );
}