import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Award, Cpu, Terminal, Shield } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { siCplusplus, siPython, siJavascript, siTypescript, siOpenjdk, siReact, siVite, siTailwindcss, siHtml5, siCss, siNodedotjs, siExpress, siFastapi, siMongodb, siPostgresql, siSpringboot, siLangchain, siLanggraph, siGoogle, siFirebase, siGooglecloud } from 'simple-icons'
import { site, asset } from './content/site'

gsap.registerPlugin(ScrollTrigger)

function Preloader() {
  const [visible, setVisible] = useState(!sessionStorage.getItem('intro-seen'))
  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => { setVisible(false); sessionStorage.setItem('intro-seen', '1') }, 2400)
    return () => window.clearTimeout(timer)
  }, [visible])
  if (!visible) return null
  return <div className="preloader" aria-label="Tanmay Jain portfolio intro"><div className="preload-mark"><span>TAN</span><span className="preload-photo"><ResponsiveImage path={site.profile.photo} alt="" width={1350} height={1688} loading="eager" sizes="20vw"/></span><span>MAY</span></div><span className="micro">AI / ML + FULL-STACK DEVELOPER</span></div>
}

function hideMissingImage(event: SyntheticEvent<HTMLImageElement>) { event.currentTarget.classList.add('image-missing') }

function ResponsiveImage({ path, alt, width, height, sizes = '100vw', loading = 'lazy', className = '', fetchPriority }: { path: string; alt: string; width: number; height: number; sizes?: string; loading?: 'eager' | 'lazy'; className?: string; fetchPriority?: 'high' }) {
  const variants = [480, 800, 1200].map(size => `${asset(path.replace(/\.jpe?g$/i, `-${size}.webp`))} ${size}w`).join(', ')
  return <picture className="responsive-picture"><source type="image/webp" srcSet={variants} sizes={sizes}/><img className={className} src={asset(path)} alt={alt} width={width} height={height} loading={loading} decoding="async" fetchPriority={fetchPriority} onError={hideMissingImage}/></picture>
}

function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const close = () => setOpen(false)
  useEffect(() => {
    if (!open) return
    document.querySelector<HTMLElement>('.menu-overlay a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { close(); toggleRef.current?.focus() }
      if (event.key === 'Tab') {
        const links = Array.from(document.querySelectorAll<HTMLElement>('.menu-overlay a'))
        if (!links.length) return
        if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links[links.length - 1].focus() }
        else if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); links[0].focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  const items = [['Work', '#projects'], ['About', '#about'], ['Skills', '#skills'], ['Lab', '#lab'], ['Contact', '#contact']]
  return <><header className="header"><a className="brand" href="#home" onClick={close}>TANMAY.JAIN<sup>®</sup></a><span className="header-location">AI / ML + FULL-STACK · JAIPUR, IN</span><button ref={toggleRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X/> : <Menu/>}<span>{open ? 'CLOSE' : 'MENU'}</span></button></header>{open && <nav className="menu-overlay" aria-label="Main menu">{items.map(([name, href], i) => <a style={{ transitionDelay: `${i * 65}ms` }} href={href} key={name} onClick={close}><small>0{i + 1}</small>{name}<ArrowUpRight/></a>)}<div className="menu-foot micro">JAIPUR, INDIA · AVAILABLE FOR WHAT'S NEXT</div></nav>}</>
}

function Hero() {
  return <section className="hero section-pad" id="home"><div className="hero-copy"><p className="eyebrow"><span className="red-dot"/> OPEN TO WORK <span className="eyebrow-sep">/</span> {site.location}</p><h1>Tanmay<br/><span>Jain</span></h1><p className="hero-role">AI/ML Developer <i>•</i> Full-Stack Developer <i>•</i> Builder</p><p className="hero-intro">{site.intro}</p><div className="chips">{['AI/ML', 'Full-Stack', 'Agentic AI', 'Product Building'].map(x => <span key={x}>{x}</span>)}</div><div className="hero-actions"><a className="button button-dark" href="#projects">EXPLORE WORK <ArrowRight/></a>{site.profile.resume && <a className="button button-outline" href={asset(site.profile.resume)} target="_blank" rel="noreferrer">DOWNLOAD RESUME <ArrowRight/></a>}</div></div><div className="hero-image"><ResponsiveImage path={site.profile.photo} alt="Portrait of Tanmay Jain" width={1350} height={1688} loading="eager" className="hero-photo" fetchPriority="high" sizes="(max-width: 850px) 45vw, 42vw"/><span className="image-caption">01 — TANMAY JAIN / JAIPUR</span></div><a className="scroll-cue" href="#about"><ArrowDown/> SCROLL TO EXPLORE</a>{site.openToWorkTab && <a className="work-tab" href="#contact">OPEN TO WORK</a>}</section>
}

function About() {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = site.about.split(' ')
    el.innerHTML = words.map(word => `<span class="reveal-word">${word} </span>`).join('')
    const spans = el.querySelectorAll('.reveal-word')
    gsap.fromTo(spans, { color: '#c2beb5' }, { color: '#080808', stagger: 0.035, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: `+=${Math.max(el.offsetHeight * 1.45, 600)}`, scrub: true } })
    return () => { ScrollTrigger.getAll().forEach(t => t.trigger === el && t.kill()) }
  }, [])
  return <section className="about section-pad" id="about"><div className="section-head"><span className="micro">01 / A LITTLE ABOUT ME</span><span className="micro">STUDENT · BUILDER · JAIPUR</span></div><div className="about-content"><div className="tilt-note"><ResponsiveImage path={site.profile.photo} alt="Tanmay Jain" width={1350} height={1688} sizes="15vw"/></div><p ref={ref}>{site.about}</p></div></section>
}

function StackMarquee() {
  const [thumb, setThumb] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setThumb(value => (value + 1) % site.projects.length), 2400)
    return () => window.clearInterval(timer)
  }, [])
  const icons = [siCplusplus,siPython,siJavascript,siTypescript,siOpenjdk,siReact,siVite,siTailwindcss,siHtml5,siCss,siNodedotjs,siExpress,siFastapi,siMongodb,siPostgresql,siSpringboot,siLangchain,siLanggraph,siGoogle,siFirebase,siGooglecloud]
  const labels = ['C++','Python','JavaScript','TypeScript','Java','React','Vite','Tailwind','HTML5','CSS3','Node.js','Express','FastAPI','MongoDB','PostgreSQL','Spring Boot','LangChain','LangGraph','Gemini','Firebase','Google Cloud']
  const items = labels.map((name, i) => ({ name, path: icons[i].path }))
  const row = (list: typeof items) => [...list, ...list].map((item, i) => <span className="tech-item" key={`${item.name}-${i}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.path}/></svg>{item.name}</span>)
  return <section className="stack-strip"><div className="stack-label"><span className={`stack-thumb thumb-${thumb}`}><ResponsiveImage key={thumb} path={site.projects[thumb].image} alt="" width={1600} height={1000} sizes="65px"/><b>{site.projects[thumb].name}</b></span><span className="micro">(STACK & TOOLS)</span></div><div className="marquee" aria-label="Technology stack"><div>{row(items)}</div><div>{row(items.slice().reverse())}</div></div></section>
}

function Projects() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  return <section className="projects section-pad" id="projects"><div className="section-head"><span className="micro">02 / SELECTED WORK</span><span className="micro">2024 — 2026</span></div><h2 className="section-title">Selected<br/><span>Projects</span><sup> ({site.projects.length})</sup></h2><div className="project-list">{site.projects.map((p, i) => <article className={`project-row ${active === i ? 'active' : ''}`} key={p.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}><button className="project-main" onClick={() => setActive(i)} aria-expanded={active === i}><span className="project-number">0{i + 1}</span><span className="project-name">{p.name}</span><ArrowUpRight/></button><div className="project-detail"><p>{p.description}</p><div className="project-meta"><div><small>STACK</small><span>{p.stack}</span></div><div><small>TYPE</small><span>{p.type}</span></div>{[p.year,p.status].filter(x => !/^TODO/i.test(x)).length > 0 && <div><small>YEAR / STATUS</small><span>{[p.year,p.status].filter(x => !/^TODO/i.test(x)).join(' · ')}</span></div>}<div className="project-actions"><button className="button button-outline" onClick={() => navigate(`/project/${p.name.toLowerCase().replace(/\s+/g, '-')}`)}>PROJECT DETAILS <ArrowRight/></button>{p.repoUrl.startsWith('http') && <a className="button button-outline" href={p.repoUrl} target="_blank" rel="noreferrer">VIEW REPOSITORY <ArrowRight/></a>}{p.liveUrl.startsWith('http') && <a className="button button-outline" href={p.liveUrl} target="_blank" rel="noreferrer">LIVE <ArrowRight/></a>}</div></div><div className={`project-placeholder project-art art-${i}`}><ResponsiveImage path={p.image} alt={p.imageAlt} width={1600} height={1000} sizes="(max-width: 600px) 88vw, 28vw"/><strong>{p.name}</strong><small>{p.type}</small></div></div></article>)}</div></section>
}

function Lab() {
  return <section className="lab section-pad" id="lab"><div className="section-head"><span className="micro">03 / CURIOSITY IN PRACTICE</span><span className="micro">LEARNING NEVER SHIPS LAST</span></div><h2 className="section-title">The <span>Lab</span></h2><div className="lab-grid">{site.lab.map((item, i) => <article className="lab-card" key={item.title}><div className={`lab-graphic graphic-${i}`} aria-hidden="true"><div className={`lab-visual lab-visual-${i}`}>{i===0?<><span>INPUT</span><b>AGENT</b><span>TOOLS</span><b>OUTPUT</b></>:<><span>01&nbsp; vector&lt;int&gt;</span><span>02&nbsp; sort(nums)</span><span>03&nbsp; return result</span></>}</div><b>{item.label}</b></div><small className="micro">{item.label}</small><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="lab-links"><a className="button button-dark" href={site.links.github} target="_blank" rel="noreferrer">GITHUB <ArrowRight/></a><a className="button button-outline" href={site.links.leetcode} target="_blank" rel="noreferrer">LEETCODE <ArrowRight/></a></div></section>
}

function Skillset() {
  const refs = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!refs.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => gsap.utils.toArray<HTMLElement>('.skill-row').forEach(row => ScrollTrigger.create({ trigger: row, start: 'top center', end: 'bottom center', onToggle: self => row.classList.toggle('in-view', self.isActive) })), refs)
    return () => ctx.revert()
  }, [])
  return <section className="skillset section-pad" id="skills"><div className="section-head"><span className="micro">04 / WHAT I WORK WITH</span><span className="micro">TOOLS FOLLOW CURIOSITY</span></div><h2 className="section-title">Skillset<span>.</span></h2><div ref={refs} className="skill-rows">{site.skills.map((s, i) => <div className="skill-row" key={s.title}><span className="skill-index">0{i + 1}</span><h3>{s.title}</h3><p>{s.body}</p><ArrowUpRight/></div>)}</div></section>
}

function ContactSky() {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); observer.disconnect() }
    }, { rootMargin: '250px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className="contact-cloud" aria-hidden="true">
    {near && __HAS_SKY_POSTER__ && <img className="sky-poster" src={asset('/sky.jpg')} alt="" width="1920" height="1080" loading="lazy" decoding="async" onError={hideMissingImage}/>}
    {near && __HAS_SKY_VIDEO__ && !reduceMotion && !videoFailed && <video className="sky-video" autoPlay muted loop playsInline preload="none" poster={__HAS_SKY_POSTER__ ? asset('/sky.jpg') : undefined} onError={() => setVideoFailed(true)}><source src={asset('/sky.mp4')} type="video/mp4"/></video>}
    <i className="sky-cloud sky-cloud-one"/><i className="sky-cloud sky-cloud-two"/><i className="sky-cloud sky-cloud-three"/><i className="sky-cloud sky-cloud-four"/>
  </div>
}

function Statement() {
  const [activePillar, setActivePillar] = useState<'concept' | 'code' | 'deploy'>('concept')
  const [activeStage, setActiveStage] = useState<number>(0)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const radarRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!radarRef.current) return
    const rect = radarRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  const pillars = {
    concept: {
      id: '01',
      tag: 'AUTONOMOUS INTELLIGENCE & AGENTIC GRAPHS',
      title: 'CONCEPT',
      subtitle: 'Self-Healing State Machines',
      lead: 'LLMs are probabilistic; production software must be deterministic. I design goal-driven agentic architectures with structured state graphs, multi-agent evaluation cycles, and zero-downtime deterministic fallbacks when models timeout or hit quota ceilings.',
      highlight: 'Engineered MORPHOS (7-stage hypothesis & confidence engine) and GuardSaaB (AI agent permission governance with tamper-evident audit logs).',
      icon: Cpu,
      stats: [
        { label: 'WORKFLOW ARCHITECTURE', value: '7-Stage State Graph' },
        { label: 'ERROR RESILIENCE', value: 'Deterministic Fallback' },
        { label: 'AGENTIC FRAMEWORK', value: 'LangGraph & LangChain' },
      ],
    },
    code: {
      id: '02',
      tag: 'ENTERPRISE FULL-STACK & RIGOROUS TESTING',
      title: 'CODE',
      subtitle: 'Type-Safe Architecture & Coverage',
      lead: 'Code that works once is a prototype; code that works under latency, rate-limiting, and edge cases is software. From Java 21 & Spring Boot enterprise REST services with Flyway migrations to TypeScript full-stack systems backed by 365+ automated tests, every layer is engineered for reliability.',
      highlight: 'Maintains 365+ automated test suites with Vitest & JUnit 5, coupled with a 9.04 / 10 academic CGPA in CSE (AI & ML) at JECRC University.',
      icon: Terminal,
      stats: [
        { label: 'AUTOMATED TEST SUITES', value: '365+ Tests' },
        { label: 'ACADEMIC CGPA', value: '9.04 / 10' },
        { label: 'ALGORITHMIC PRACTICE', value: '100+ DSA in C++' },
      ],
    },
    deploy: {
      id: '03',
      tag: 'HIGH-STAKES EXECUTION & COMPETITIVE PROWESS',
      title: 'DEPLOYMENT',
      subtitle: 'Proven Under High-Stakes Pressure',
      lead: 'Theory is validated only when put to the test under real pressure. Won 1st Runner-Up at the CodeX 3.0 Hackathon competing against 100 teams in an intense 36-hour sprint, creating GuardSaaB — an AI agent governance system with tamper-evident audit logs and permission enforcement.',
      highlight: 'Secured ₹40,000 cash prize among top 1% of 100 competing engineering teams across India.',
      icon: Award,
      stats: [
        { label: 'HACKATHON RANK', value: '1st Runner-Up' },
        { label: 'TEAMS COMPETING', value: '100 Teams' },
        { label: 'AWARD SECURED', value: '₹40,000 Cash Prize' },
      ],
    },
  }

  const pipeline = [
    { step: '01', title: 'HYPOTHESIS & DOMAIN MODEL', detail: 'Formalizing state spaces, schema boundaries, and invariants' },
    { step: '02', title: 'LANGGRAPH MULTI-AGENT CORE', detail: 'State machines with confidence thresholds & cycle control' },
    { step: '03', title: 'EXHAUSTIVE TEST HARNESS', detail: '365+ tests covering edge cases, latency, and quota fallbacks' },
    { step: '04', title: 'CONTAINERIZED CLOUD DEPLOY', detail: 'Dockerized runtime with CI/CD and production monitoring' },
  ]

  const current = pillars[activePillar]
  const CurrentIcon = current.icon

  return (
    <section className="statement section-pad" id="manifesto">
      <div className="nexus-top">
        <div className="nexus-head-left">
          <span className="micro">05 / CORE ARCHITECTURE & MANIFESTO</span>
          <span className="nexus-subhead">ENGINEERED FOR THE REAL WORLD</span>
        </div>
        <div className="nexus-telemetry">
          <span className="telemetry-dot" />
          <span className="telemetry-text">STATUS: NOMINAL</span>
          <span className="telemetry-sep">/</span>
          <span className="telemetry-text">JAIPUR [26.91°N, 75.79°E]</span>
          <span className="telemetry-sep">/</span>
          <span className="telemetry-text">UPTIME: 100%</span>
        </div>
      </div>

      <div className="nexus-grid">
        <div
          ref={radarRef}
          className="nexus-radar-wrap"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="nexus-radar"
            style={{
              transform: `perspective(900px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            }}
          >
            <svg className="radar-svg" viewBox="0 0 460 460" fill="none">
              <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b3122a" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#b3122a" stopOpacity="0" />
                </linearGradient>
              </defs>

              <circle cx="230" cy="230" r="215" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="230" cy="230" r="175" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <circle cx="230" cy="230" r="125" stroke="rgba(179,18,42,0.3)" strokeWidth="1.2" strokeDasharray="6 6" />
              <circle cx="230" cy="230" r="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              <line x1="230" y1="10" x2="230" y2="450" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="10" y1="230" x2="450" y2="230" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              <text x="230" y="28" fill="#888" fontSize="9" textAnchor="middle" letterSpacing="0.1em">000°</text>
              <text x="442" y="233" fill="#888" fontSize="9" textAnchor="end" letterSpacing="0.1em">090°</text>
              <text x="230" y="445" fill="#888" fontSize="9" textAnchor="middle" letterSpacing="0.1em">180°</text>
              <text x="18" y="233" fill="#888" fontSize="9" textAnchor="start" letterSpacing="0.1em">270°</text>

              <g className="radar-sweep">
                <path d="M 230 230 L 230 15 A 215 215 0 0 1 382 78 Z" fill="url(#beamGradient)" />
                <line x1="230" y1="230" x2="382" y2="78" stroke="#b3122a" strokeWidth="1.5" />
              </g>

              <g className={`orbit-node node-concept ${activePillar === 'concept' ? 'active' : ''}`} onClick={() => setActivePillar('concept')}>
                <circle cx="345" cy="140" r="9" fill={activePillar === 'concept' ? '#b3122a' : 'rgba(255,255,255,0.1)'} stroke="#b3122a" strokeWidth="2" />
                <text x="360" y="144" fill={activePillar === 'concept' ? '#fff' : '#888'} fontSize="8" letterSpacing="0.12em">01 // AI</text>
              </g>

              <g className={`orbit-node node-code ${activePillar === 'code' ? 'active' : ''}`} onClick={() => setActivePillar('code')}>
                <circle cx="115" cy="140" r="9" fill={activePillar === 'code' ? '#b3122a' : 'rgba(255,255,255,0.1)'} stroke="#b3122a" strokeWidth="2" />
                <text x="48" y="144" fill={activePillar === 'code' ? '#fff' : '#888'} fontSize="8" letterSpacing="0.12em">02 // CODE</text>
              </g>

              <g className={`orbit-node node-deploy ${activePillar === 'deploy' ? 'active' : ''}`} onClick={() => setActivePillar('deploy')}>
                <circle cx="230" cy="355" r="9" fill={activePillar === 'deploy' ? '#b3122a' : 'rgba(255,255,255,0.1)'} stroke="#b3122a" strokeWidth="2" />
                <text x="246" y="359" fill={activePillar === 'deploy' ? '#fff' : '#888'} fontSize="8" letterSpacing="0.12em">03 // PROD</text>
              </g>
            </svg>

            <div className="radar-core-center">
              <span className="radar-core-micro">SYSTEM CORE // 2026</span>
              <h2 className="radar-core-brand">TANMAY</h2>
              <span className="radar-core-status">ENGINEERING NEXUS</span>
            </div>
          </div>

          <div className="radar-footer-caption">
            <span>[PARALLAX TILT ACTIVE]</span>
            <span>CLICK ORBIT NODES OR TABS TO INSPECT</span>
          </div>
        </div>

        <div className="nexus-console">
          <div className="nexus-tabs" role="tablist">
            {(['concept', 'code', 'deploy'] as const).map(key => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activePillar === key}
                className={`nexus-tab ${activePillar === key ? 'active' : ''}`}
                onClick={() => setActivePillar(key)}
              >
                <span className="tab-num">0{key === 'concept' ? 1 : key === 'code' ? 2 : 3}</span>
                <span className="tab-name">{key.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div className="pillar-display" key={activePillar}>
            <div className="pillar-header">
              <div className="pillar-icon-badge">
                <CurrentIcon size={20} />
              </div>
              <div>
                <span className="pillar-eyebrow">{current.tag}</span>
                <h3 className="pillar-title">
                  {current.title} <span>— {current.subtitle}</span>
                </h3>
              </div>
            </div>

            <p className="pillar-lead">{current.lead}</p>

            <div className="pillar-proof">
              <Shield className="proof-icon" size={16} />
              <div>
                <strong className="proof-label">VERIFIED DELIVERABLE & PROOF</strong>
                <p className="proof-desc">{current.highlight}</p>
              </div>
            </div>

            <div className="pillar-specs-grid">
              {current.stats.map(s => (
                <div key={s.label} className="spec-item">
                  <span className="spec-label">{s.label}</span>
                  <strong className="spec-value">{s.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="nexus-metrics-strip">
        <div className="metric-box">
          <div className="metric-top">
            <span className="metric-val">9.04</span>
            <span className="metric-unit">/ 10</span>
          </div>
          <span className="metric-label">ACADEMIC CGPA (B.TECH AI & ML)</span>
          <p className="metric-sub">JECRC University · Distinction in Systems & Algorithms</p>
        </div>

        <div className="metric-box highlighted">
          <div className="metric-top">
            <span className="metric-val">1st Runner-Up</span>
            <Award className="metric-badge-icon" size={20} />
          </div>
          <span className="metric-label">CODEX 3.0 HACKATHON WINNER</span>
          <p className="metric-sub">Top 1% of 100 teams · ₹40,000 cash prize · GuardSaaB</p>
        </div>

        <div className="metric-box">
          <div className="metric-top">
            <span className="metric-val">365+</span>
            <span className="metric-unit">Tests</span>
          </div>
          <span className="metric-label">AUTOMATED TEST SUITES</span>
          <p className="metric-sub">Across 32 suites in Vitest & JUnit 5 · Zero unverified code</p>
        </div>

        <div className="metric-box">
          <div className="metric-top">
            <span className="metric-val">100+</span>
            <span className="metric-unit">Solved</span>
          </div>
          <span className="metric-label">ALGORITHMIC PROBLEMS (C++)</span>
          <p className="metric-sub">LeetCode & GeeksforGeeks · Arrays, Trees, Dynamic Prog.</p>
        </div>
      </div>

      <div className="nexus-pipeline">
        <div className="pipeline-header">
          <span className="micro">SYSTEM PIPELINE</span>
          <p>FROM FIRST PRINCIPLES TO RELIABLE CLOUD EXECUTION</p>
        </div>
        <div className="pipeline-stages">
          {pipeline.map((p, idx) => (
            <div
              key={p.step}
              className={`pipeline-stage ${activeStage === idx ? 'active' : ''}`}
              onClick={() => setActiveStage(idx)}
            >
              <div className="stage-top">
                <span className="stage-num">{p.step}</span>
                <span className="stage-tag">{idx === 3 ? 'DEPLOY' : 'BUILD'}</span>
              </div>
              <strong className="stage-title">{p.title}</strong>
              <p className="stage-detail">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [phone, setPhone] = useState('')

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    const form = event.currentTarget
    const values = new FormData(form)
    const errors: Record<string, string> = {}
    const name = String(values.get('name') || '').trim()
    const email = String(values.get('email') || '').trim()
    const reason = String(values.get('reason') || '').trim() || 'General inquiry'
    const message = String(values.get('message') || '').trim()

    if (!name) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid email address.'
    if (phone && !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Enter 10 digits after +91.'
    }
    if (message.length < 5) errors.message = 'Please enter a message (at least 5 characters).'

    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    const key = import.meta.env.VITE_WEB3FORMS_KEY || '1b3ba267-8158-4295-bc2c-047e4bb0ccc5'
    if (key) {
      setSending(true)
      values.set('name', name); values.set('email', email); values.set('message', message)
      values.set('phone', phone ? `+91 ${phone}` : '')
      values.set('access_key', key); values.set('subject', `Portfolio contact — ${name} (${reason})`)
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: values })
        const result = await response.json()
        if (response.ok && result.success) {
          setSent(true)
          form.reset()
          setPhone('')
          return
        }
      } catch (err) {
        console.warn('Web3Forms submit error, using mailto fallback:', err)
      } finally {
        setSending(false)
      }
    }

    // Always-working direct mailto fallback so contact NEVER fails
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name} [${reason}]`)
    const body = encodeURIComponent(
      `Hi Tanmay,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone ? `+91 ${phone}` : 'Not provided'}\nReason: ${reason}\n\nMessage:\n${message}\n`
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
    form.reset()
    setPhone('')
  }
  const errorFor = (field: string) => fieldErrors[field] && <span className="field-error" id={`${field}-error`} role="alert">{fieldErrors[field]}</span>
  return <section className="contact section-pad" id="contact"><ContactSky/><div className="contact-card"><span className="micro">HAVE SOMETHING IN MIND?</span><h2>LET’S BUILD<br/>SOMETHING<span>.</span></h2><p className="contact-direct">Or just write: <a href={`mailto:${site.email}`}>{site.email}</a></p>{sent ? <div className="success-state" role="status"><p style={{ margin: 0 }}><strong>Thank you!</strong> Your message has been prepared & sent.</p><p style={{ margin: '8px 0 0', fontSize: '11px', color: '#b5b1aa' }}>I'll reply soon. You can also email directly at <a href={`mailto:${site.email}`} style={{ color: 'var(--red)', textDecoration: 'underline' }}>{site.email}</a>.</p><button type="button" className="button button-outline" style={{ marginTop: '14px', fontSize: '9px', minHeight: '32px', color: 'white', borderColor: '#666' }} onClick={() => setSent(false)}>SEND ANOTHER MESSAGE</button></div> : <form onSubmit={submit} noValidate>
    <input className="botcheck" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="form-pair"><label htmlFor="contact-name">YOUR NAME<input id="contact-name" name="name" autoComplete="name" required onInput={() => clearFieldError('name')} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'name-error' : undefined} placeholder="Name"/>{errorFor('name')}</label><label htmlFor="contact-email">EMAIL ADDRESS<input id="contact-email" type="email" name="email" autoComplete="email" required onInput={() => clearFieldError('email')} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'email-error' : undefined} placeholder="you@example.com"/>{errorFor('email')}</label></div>
    <div className="form-pair"><label htmlFor="contact-phone">PHONE <span className="phone-field"><span>+91</span><input id="contact-phone" type="tel" inputMode="numeric" name="phone" autoComplete="tel-national" value={phone} onChange={event => { setPhone(event.target.value.replace(/\D/g, '').slice(0, 10)); clearFieldError('phone') }} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'phone-error' : undefined} placeholder="9876543210"/></span>{errorFor('phone')}</label><label htmlFor="contact-reason">REASON<select id="contact-reason" name="reason" defaultValue="" onChange={() => clearFieldError('reason')} aria-invalid={Boolean(fieldErrors.reason)} aria-describedby={fieldErrors.reason ? 'reason-error' : undefined}><option value="">Select reason (optional)</option>{['Full-time role', 'Internship', 'Freelance project', 'Collaboration', 'Other'].map(x => <option key={x} value={x}>{x}</option>)}</select>{errorFor('reason')}</label></div>
    <label htmlFor="contact-message">MESSAGE<textarea id="contact-message" name="message" rows={2} required onInput={() => clearFieldError('message')} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'message-error' : undefined} placeholder="A little about what you have in mind…"/>{errorFor('message')}</label>
    <button type="submit" className="button button-light" disabled={sending}>{sending ? 'SENDING…' : 'SEND DETAILS'} <ArrowRight/></button><p className="form-note" aria-live="polite">{error ? <>{error} <a href={`mailto:${site.email}`}>Email me instead</a>.</> : 'No spam. A real reply, usually the same day.'}</p>
  </form>}</div></section>
}

function Footer() {
  return <footer className="footer section-pad"><div className="footer-top"><p className="micro">FROM CONCEPT TO CODE TO DEPLOYMENT.</p><div className="footer-links">{[['EMAIL', `mailto:${site.email}`], ['GITHUB', site.links.github], ['LINKEDIN', site.links.linkedin], ['LEETCODE', site.links.leetcode]].map(([label, href]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{label}<ArrowUpRight/></a>)}{site.profile.resume && <a className="footer-resume" href={asset(site.profile.resume)} target="_blank" rel="noreferrer">DOWNLOAD RESUME <ArrowUpRight/></a>}</div></div><div className="footer-mark">TANMAY.JAIN<sup>®</sup></div><div className="footer-bottom"><span>© 2026 TANMAY JAIN. ALL RIGHTS RESERVED.</span><a href="#home">BACK TO TOP ↑</a><span>MADE IN JAIPUR, INDIA</span></div></footer>
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = site.projects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug)
  const navigate = useNavigate()
  const index = project ? site.projects.indexOf(project) : -1
  const move = (offset: number) => { const next = site.projects[(index + offset + site.projects.length) % site.projects.length]; navigate(`/project/${next.name.toLowerCase().replace(/\s+/g, '-')}`) }
  return <div className="detail-overlay"><button className="button button-outline" onClick={() => navigate('/')}>← BACK TO PORTFOLIO</button>{project ? <><span className="micro">PROJECT / {project.type}</span><h1>{project.name}</h1><ResponsiveImage path={project.image} alt={project.imageAlt} width={1600} height={1000} className="detail-cover" sizes="(max-width: 1000px) 90vw, 1000px"/><p>{project.description}</p><p className="micro">{project.stack}</p><div className="detail-nav"><button className="button button-outline" onClick={() => move(-1)}>← PREVIOUS</button><button className="button button-outline" onClick={() => move(1)}>NEXT PROJECT →</button></div></> : <h1>Project not found.</h1>}</div>
}

function Portfolio() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker); gsap.ticker.lagSmoothing(0)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-title').forEach(el => gsap.from(el, { y: 45, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      gsap.to('.hero-image', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.fromTo('.nexus-radar', { scale: .92, rotate: -5 }, { scale: 1.04, rotate: 5, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 85%', end: 'bottom 15%', scrub: 1 } })
    })
    return () => { ctx.revert(); gsap.ticker.remove(ticker); lenis.destroy() }
  }, [])
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return
    const cursor = document.querySelector<HTMLElement>('.custom-cursor')
    if (!cursor) return
    const move = (event: PointerEvent) => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px` }
    const over = (event: PointerEvent) => { if ((event.target as HTMLElement).closest('a,button')) cursor.classList.add('cursor-hover') }
    const out = (event: PointerEvent) => { if ((event.target as HTMLElement).closest('a,button')) cursor.classList.remove('cursor-hover') }
    window.addEventListener('pointermove', move); document.addEventListener('pointerover', over); document.addEventListener('pointerout', out)
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); document.removeEventListener('pointerout', out) }
  }, [])
  return <><Preloader/><Header/><main><Hero/><About/><StackMarquee/><Projects/><Lab/><Skillset/><Statement/><ContactForm/></main><Footer/><a className="custom-cursor" href="#home" aria-label="Back to top">↑</a></>
}

export default function App() { return <Routes><Route path="/" element={<Portfolio/>}/><Route path="/project/:slug" element={<><Portfolio/><ProjectDetail/></>}/><Route path="*" element={<Portfolio/>}/></Routes> }
