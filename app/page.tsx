'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Activity, ArrowUpRight, Box, Check, ChevronRight, CircleDot, Code2, Cpu, Database, FileCode2, FolderKanban, ImagePlus, Layers3, LayoutGrid, Rocket, Send, Settings2, Sparkles, Terminal, Upload, WandSparkles, Zap, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type View = 'factory' | 'builder' | 'sandbox'

const stages = [
  { label: 'Logic Mapping', icon: '🧠' },
  { label: 'Code Injection', icon: '💻' },
  { label: 'Database Provision', icon: '🗄️' },
  { label: 'Live Deploy', icon: '🚀' },
]

type Template = 'story' | 'music' | 'finance' | 'health'

const templateMeta: Record<Template, { label: string; terminal: string[] }> = {
  story: { label: 'Episode Spark AI', terminal: ['visionbuild@core:~$ architect --watch', '>> compiling Episode Spark AI', '✓ route graph synthesized', '✓ interactive state machine online', '→ streaming edge functions...', '✓ database schema provisioned', '→ optimizing production bundle', '✓ deployment ready at spark.build', 'visionbuild@core:~$ _'] },
  music: { label: 'Neon Music Player', terminal: ['visionbuild@core:~$ architect --watch', '>> compiling Neon Music Player', '✓ audio graph initialized', '✓ violet glass surfaces linked', '→ analyzing waveform peaks...', '✓ media controls provisioned', '→ optimizing album art cache', '✓ player ready at neon.wave', 'visionbuild@core:~$ _'] },
  finance: { label: 'Cyberpunk Finance Tracker', terminal: ['visionbuild@core:~$ architect --watch', '>> compiling Cyberpunk Finance Tracker', '✓ wallet schema synthesized', '✓ realtime balances online', '→ rendering cyan graph layer...', '✓ asset cards provisioned', '→ securing ledger endpoints', '✓ finance dashboard ready', 'visionbuild@core:~$ _'] },
  health: { label: 'AI Health Tracker', terminal: ['visionbuild@core:~$ architect --watch', '>> compiling AI Health Tracker', '✓ biometric stream connected', '✓ glass stat surfaces linked', '→ rendering pink wellness graph...', '✓ health insights provisioned', '→ securing personal metrics...', '✓ health dashboard ready', 'visionbuild@core:~$ _'] },
}

export default function Page() {
  const supabase = useMemo(() => typeof window === 'undefined' ? null : createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [view, setView] = useState<View>('factory')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileProgress, setCompileProgress] = useState(0)
  const [story, setStory] = useState('The signal is waiting. What will you do?')
  const [terminalTick, setTerminalTick] = useState(0)
  const [selectedProject, setSelectedProject] = useState<'Episode Spark AI' | 'Neon Core Schema' | null>(null)
  const [template, setTemplate] = useState<Template>('story')
  const [description, setDescription] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [compileError, setCompileError] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [deploying, setDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsUnlocked, setSettingsUnlocked] = useState(false)
  const [settingsPassword, setSettingsPassword] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [settingsValues, setSettingsValues] = useState({ supabaseUrl: '', supabaseAnonKey: '', openAiKey: '' })

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setAuthReady(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const timer = window.setInterval(() => setTerminalTick((tick) => tick + 1), 1800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isCompiling) return
    const started = Date.now()
    const timer = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - started) / 8000) * 100)
      setCompileProgress(next)
      if (next >= 100) {
        window.clearInterval(timer)
        window.setTimeout(() => { setIsCompiling(false); if (description.trim()) { setTemplate('health'); setView('sandbox') } }, 650)
      }
    }, 80)
    return () => window.clearInterval(timer)
  }, [isCompiling])

  const activeStage = isCompiling ? Math.min(3, Math.floor(compileProgress / 25)) : -1
  async function handleCompile() { if (!supabase || !user) return; setCompileError(''); if (!description.trim()) { setCompileError('Add a build description before compiling.'); return } try { const response = await fetch('/api/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: description }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setGeneratedCode(data.code); setCompileProgress(0); setIsCompiling(true); const { data: project, error } = await supabase.from('projects').insert({ user_id: user.id, name: 'AI Health Tracker', prompt: description, generated_code: data.code, status: 'generated' }).select('id').single(); if (error) throw error; setProjectId(project.id) } catch (error) { setCompileError(error instanceof Error ? error.message : 'Compile failed. Try again.') } }
  async function unlockSettings(event: React.FormEvent) { event.preventDefault(); if (!supabase || !user) return; setSettingsError(''); const { error } = await supabase.auth.signInWithPassword({ email: user.email ?? '', password: settingsPassword }); if (error) setSettingsError('Incorrect password. Settings remain locked.'); else { setSettingsUnlocked(true); setSettingsPassword('') } }
  async function handleDeploy() { if (!generatedCode || !supabase) return; setDeploying(true); setCompileError(''); try { const response = await fetch('/api/deploy', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ projectId, code: generatedCode }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setDeploymentUrl(data.url) } catch (error) { setCompileError(error instanceof Error ? error.message : 'Deployment failed. Try again.') } finally { setDeploying(false) } }
  const visibleTerminal = useMemo(() => {
    const activeLines = templateMeta[template].terminal
    const count = Math.max(5, (terminalTick % activeLines.length) + 5)
    return Array.from({ length: count }, (_, index) => activeLines[index % activeLines.length])
  }, [template, terminalTick])

  if (!authReady) return <main className="vb-shell auth-screen"><div className="vb-brand-mark"><Sparkles size={16} /></div><p className="muted-copy">Initializing secure workspace…</p></main>
  if (!user) return <AuthScreen supabase={supabase} />

  return (
    <main className="vb-shell">
      <div className="vb-noise" aria-hidden="true" />
      <header className="vb-header">
        <div className="vb-brand-mark"><Sparkles size={16} /></div>
        <div><p className="vb-kicker">VISIONBUILD AI</p><p className="vb-tagline">Imagine it. Describe it. Build it.</p></div>
        <Button variant="ghost" size="icon" className="vb-icon-button" aria-label="Open settings" onClick={() => { setSettingsOpen(true); setSettingsUnlocked(false); setSettingsError('') }}><Settings2 size={18} /></Button>
      </header>

      <div className="vb-content">
        {view === 'factory' && <FactoryHub onArchitect={() => setView('builder')} onProjectSelect={setSelectedProject} />}
        {view === 'builder' && <Builder description={description} setDescription={setDescription} compileError={compileError} isCompiling={isCompiling} progress={compileProgress} activeStage={activeStage} onCompile={handleCompile} />}
        {view === 'sandbox' && <Sandbox template={template} setTemplate={setTemplate} story={story} setStory={setStory} terminalLines={visibleTerminal} deploymentUrl={deploymentUrl} deploying={deploying} onDeploy={handleDeploy} />}
      </div>

      {settingsOpen && <SettingsModal unlocked={settingsUnlocked} password={settingsPassword} setPassword={setSettingsPassword} error={settingsError} values={settingsValues} setValues={setSettingsValues} onUnlock={unlockSettings} onClose={() => setSettingsOpen(false)} onSignOut={() => supabase?.auth.signOut()} />}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onLaunch={() => { setSelectedProject(null); setView('sandbox') }} />}

      <nav className="vb-nav" aria-label="Primary navigation">
        <NavButton active={view === 'factory'} icon={<LayoutGrid size={19} />} label="Factory Hub" onClick={() => setView('factory')} />
        <NavButton active={view === 'builder'} icon={<WandSparkles size={19} />} label="AI Builder" onClick={() => setView('builder')} />
        <NavButton active={view === 'sandbox'} icon={<Terminal size={19} />} label="Spark Sandbox" onClick={() => setView('sandbox')} />
      </nav>
    </main>
  )
}

function AuthScreen({ supabase }: { supabase: NonNullable<ReturnType<typeof createClient>> }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); setPending(true); setError(''); const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback` } }); setPending(false); if (result.error) setError(result.error.message.includes('confirm') ? 'Check your email to confirm your account.' : 'Unable to authenticate. Check your details and try again.') }
  return <main className="vb-shell auth-screen"><div className="auth-glow" /><div className="vb-brand-mark"><Sparkles size={16} /></div><p className="vb-kicker">VISIONBUILD AI</p><h1>Build beyond<br /><span>the possible.</span></h1><p className="muted-copy">{mode === 'login' ? 'Sign in to access your autonomous build environment.' : 'Create a secure workspace for your next system.'}</p><form className="auth-form" onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></label><label>Password<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>{error && <p className="auth-error" role="alert">{error}</p>}<Button className="cyan-button" disabled={pending}>{pending ? 'Securing workspace…' : mode === 'login' ? 'Enter VisionBuild' : 'Create workspace'}</Button></form><button className="auth-toggle" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Need a workspace? Create one' : 'Already have a workspace? Sign in'}</button></main>
}

function SettingsModal({ unlocked, password, setPassword, error, values, setValues, onUnlock, onClose, onSignOut }: { unlocked: boolean; password: string; setPassword: (value: string) => void; error: string; values: { supabaseUrl: string; supabaseAnonKey: string; openAiKey: string }; setValues: React.Dispatch<React.SetStateAction<{ supabaseUrl: string; supabaseAnonKey: string; openAiKey: string }>>; onUnlock: (event: React.FormEvent) => void; onClose: () => void; onSignOut: () => void }) { return <div className="project-modal-backdrop" role="presentation"><section className="project-modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="modal-header"><div><p className="eyebrow">SECURITY / CONTROL PLANE</p><h2 id="settings-title">Settings</h2></div><button className="modal-close" onClick={onClose} aria-label="Close settings"><X size={18} /></button></div>{!unlocked ? <form className="auth-form" onSubmit={onUnlock}><p className="muted-copy">Re-enter your account password to reveal connection fields.</p><label>Account password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error && <p className="auth-error" role="alert">{error}</p>}<Button className="cyan-button">Unlock settings</Button></form> : <div className="auth-form"><p className="muted-copy">Values stay in memory for this session and are never written to the database.</p><label>Supabase URL<input type="url" value={values.supabaseUrl} onChange={(event) => setValues((current) => ({ ...current, supabaseUrl: event.target.value }))} placeholder="https://project.supabase.co" /></label><label>Supabase Anon Key<input type="password" value={values.supabaseAnonKey} onChange={(event) => setValues((current) => ({ ...current, supabaseAnonKey: event.target.value }))} placeholder="Publishable key" /></label><label>OpenAI API Key<input type="password" value={values.openAiKey} onChange={(event) => setValues((current) => ({ ...current, openAiKey: event.target.value }))} placeholder="sk-…" /></label><p className="muted-copy">AI generation uses the server-side Vercel AI Gateway. These fields do not override deployed environment variables.</p><Button variant="outline" onClick={onSignOut}>Sign out</Button></div>}</section></div> }

function FactoryHub({ onArchitect, onProjectSelect }: { onArchitect: () => void; onProjectSelect: (project: 'Episode Spark AI' | 'Neon Core Schema') => void }) {
  return <section className="view-stack" aria-labelledby="factory-title">
    <div className="section-heading"><div><p className="eyebrow"><CircleDot size={12} /> WORKSPACE / 01</p><h1 id="factory-title">Factory Hub</h1></div><span className="status-pill"><span /> ONLINE</span></div>
    <div className="hero-panel"><div className="hero-orbit"><Cpu size={34} /></div><p className="eyebrow">ARCHITECTURAL CONTROL</p><h2>Turn a thought<br /><span>into a system.</span></h2><p className="muted-copy">Your autonomous build environment is ready for its next instruction.</p><Button className="cyan-button" onClick={onArchitect}>Initiate AI Architect <ArrowUpRight data-icon="inline-end" /></Button></div>
    <div className="stats-grid"><Stat icon={<Activity />} value="98.4%" label="AI Compute Active" accent="cyan" /><Stat icon={<Rocket />} value="24" label="Apps Shipped" accent="purple" /></div>
    <div className="activity-card"><div className="card-title-row"><span>RECENT ACTIVITY</span><Button variant="ghost" size="sm">View all <ChevronRight data-icon="inline-end" /></Button></div><ActivityRow icon={<FileCode2 />} title="Episode Spark AI" detail="Deployed 4m ago" onClick={() => onProjectSelect('Episode Spark AI')} /><ActivityRow icon={<Database />} title="Neon Core Schema" detail="Provisioned 1h ago" onClick={() => onProjectSelect('Neon Core Schema')} /></div>
  </section>
}

function Stat({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent: string }) { return <div className={`stat-card ${accent}`}><div className="stat-icon">{icon}</div><strong>{value}</strong><span>{label}</span></div> }
function ActivityRow({ icon, title, detail, onClick }: { icon: React.ReactNode; title: string; detail: string; onClick: () => void }) { return <button className="activity-row" onClick={onClick} aria-label={`View details for ${title}`}><div className="activity-icon">{icon}</div><div><strong>{title}</strong><span>{detail}</span></div><ChevronRight size={16} className="dim-icon" /></button> }
function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button> }

function ProjectModal({ project, onClose, onLaunch }: { project: 'Episode Spark AI' | 'Neon Core Schema'; onClose: () => void; onLaunch: () => void }) {
  const isEpisode = project === 'Episode Spark AI'
  return <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><div className="modal-handle" /><div className="modal-header"><div><p className="eyebrow">SYSTEM RECORD / {isEpisode ? 'SPARK' : 'NEON'}</p><h2 id="project-modal-title">{project}</h2></div><button className="modal-close" onClick={onClose} aria-label="Close project details"><X size={18} /></button></div><div className="modal-status"><span /> {isEpisode ? 'DEPLOYMENT HEALTHY' : 'PROVISION COMPLETE'} <span className="modal-time">{isEpisode ? '4m ago' : '1h ago'}</span></div><div className="modal-block"><p className="modal-label">SYSTEM LOGS</p><div className="modal-logs"><code>09:41:02  handshake verified</code><code>09:41:04  {isEpisode ? 'edge runtime connected' : 'migration batch applied'}</code><code>09:41:07  {isEpisode ? 'story engine responding' : 'connection pool warmed'}</code><code className="log-good">09:41:09  ✓ operation complete</code></div></div><div className="modal-block"><p className="modal-label">PROJECT PARAMETERS</p><div className="parameter-grid"><span>Runtime<strong>{isEpisode ? 'Edge / React' : 'Neon Postgres'}</strong></span><span>Region<strong>iad1 · US East</strong></span><span>Build<strong>{isEpisode ? 'BUILD_024' : 'SCHEMA_008'}</strong></span><span>Status<strong className="text-primary">Operational</strong></span></div></div><Button className="cyan-button modal-launch" onClick={onLaunch}>Launch Project <ExternalLink data-icon="inline-end" /></Button></section></div>
}

function Builder({ description, setDescription, compileError, isCompiling, progress, activeStage, onCompile }: { description: string; setDescription: (value: string) => void; compileError: string; isCompiling: boolean; progress: number; activeStage: number; onCompile: () => void }) {
  return <section className="view-stack" aria-labelledby="builder-title"><div className="section-heading"><div><p className="eyebrow"><WandSparkles size={12} /> CREATIVE ENGINE / 02</p><h1 id="builder-title">AI Builder</h1></div><span className="build-id">BUILD_024</span></div><p className="muted-copy intro-copy">Give your idea a visual anchor and a clear directive. The Architect handles the rest.</p><label className="upload-box"><input type="file" accept="image/*" /><div className="upload-icon"><ImagePlus size={24} /></div><strong>Drop a visual seed</strong><span>PNG, JPG or WEBP · MAX 10MB</span><span className="upload-link"><Upload size={13} /> Browse files</span></label><div className="field-wrap"><label htmlFor="description">BUILD DESCRIPTION</label><Input id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A cinematic choice-based story game..." /></div><Button className="compile-button" onClick={onCompile} disabled={isCompiling}>{isCompiling ? `Compiling ${Math.round(progress)}%` : 'Compile Application'} <Code2 data-icon="inline-end" /></Button>{compileError && <p className="auth-error" role="alert">{compileError}</p>}{isCompiling && <div className="compile-panel"><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><div className="stage-list">{stages.map((stage, index) => <div className={`stage ${index < activeStage ? 'done' : ''} ${index === activeStage ? 'current' : ''}`} key={stage.label}><span className="stage-icon">{index < activeStage ? <Check size={14} /> : stage.icon}</span><span>{stage.label}</span>{index === activeStage && <span className="stage-live">ACTIVE</span>}</div>)}</div></div>}</section>
}

function Sandbox({ template, setTemplate, story, setStory, terminalLines, deploymentUrl, deploying, onDeploy }: { template: Template; setTemplate: (value: Template) => void; story: string; setStory: (value: string) => void; terminalLines: string[]; deploymentUrl: string; deploying: boolean; onDeploy: () => void }) {
  const visibleLines = terminalLines
  return <section className="view-stack sandbox-view" aria-labelledby="sandbox-title"><div className="section-heading"><div><p className="eyebrow"><Terminal size={12} /> OUTPUT ENVIRONMENT / 03</p><h1 id="sandbox-title">Spark Sandbox</h1></div><span className="status-pill"><span /> LIVE</span></div><label className="template-selector"><span>TEMPLATE SELECTOR</span><select value={template} onChange={(event) => setTemplate(event.target.value as Template)} aria-label="Select app template"><option value="story">Episode Spark AI</option><option value="music">Neon Music Player</option><option value="finance">Cyberpunk Finance Tracker</option><option value="health">AI Health Tracker</option></select></label>{template === 'story' && <div className="spark-preview"><div className="preview-top"><span><span className="preview-live-dot" /> EPISODE SPARK AI</span><span className="preview-dots">● ● ●</span></div><div className="story-content"><div className="story-hero-line"><div className="story-mark"><Zap size={17} /></div><span>AI STORY SIMULATOR</span></div><p className="story-label">EPISODE 01 / THE SIGNAL</p><h2>{story}</h2><p className="story-subcopy">Every decision rewrites the world around you.</p><div className="story-options"><button onClick={() => setStory('A door opens in the static. Beyond it, the stars are listening.')}> <span>Choose Your Destiny</span><ChevronRight size={15} /></button><button onClick={() => setStory('Episode 1 begins: you wake beneath a violet sky.')}> <span>Start Episode 1</span><ChevronRight size={15} /></button></div></div></div>}{template === 'music' && <div className="spark-preview music-preview"><div className="preview-top"><span><span className="preview-live-dot" /> NEON MUSIC PLAYER</span><span className="preview-dots">● ● ●</span></div><div className="music-content"><div className="album-art"><div><Sparkles size={28} /><span>NOCTURNE<br />// 07</span></div></div><p className="story-label">NOW PLAYING / SYNTHWAVE</p><h2>Midnight Signals</h2><p className="music-artist">Astra Protocol · Neon Archive</p><div className="music-progress"><span /><div /></div><div className="music-times"><span>01:42</span><span>04:18</span></div><div className="music-controls"><button aria-label="Previous track">◀</button><button className="play-button" aria-label="Play track">▶</button><button aria-label="Next track">▶</button></div></div></div>}{template === 'health' && <div className="spark-preview health-preview"><div className="preview-top"><span><span className="preview-live-dot" /> AI HEALTH TRACKER</span><span className="preview-dots">● ● ●</span></div><div className="health-content"><div className="health-heading"><div><p className="story-label">WELLNESS OVERVIEW</p><h2>Good morning, Alex</h2></div><div className="health-avatar">A</div></div><div className="health-score"><span>Today&apos;s health score</span><strong>87</strong><small>Excellent · +6%</small><div className="score-ring"><div /></div></div><div className="health-stats"><div><span>Heart rate</span><strong>72 <small>BPM</small></strong><i className="pink-sparkline" /></div><div><span>Sleep quality</span><strong>8.4 <small>HRS</small></strong><i className="pink-sparkline sleep" /></div></div><div className="health-chart"><div className="chart-label"><span>WEEKLY RECOVERY</span><strong>+18.4%</strong></div><svg viewBox="0 0 300 80" role="img" aria-label="Neon pink recovery chart"><polyline points="0,60 36,52 72,58 108,34 144,46 180,24 216,36 252,12 300,20" /></svg></div></div></div>}{template === 'finance' && <div className="spark-preview finance-preview"><div className="preview-top"><span><span className="preview-live-dot" /> CYBERPUNK FINANCE</span><span className="preview-dots">● ● ●</span></div><div className="finance-content"><p className="story-label">TOTAL BALANCE / LIVE</p><h2>$24,680.42</h2><p className="finance-change">+12.8% this month</p><div className="finance-graph"><svg viewBox="0 0 300 90" role="img" aria-label="Cyan balance growth graph"><polyline points="0,75 35,62 65,68 100,42 135,52 170,28 205,38 240,12 300,22" /></svg></div><div className="asset-grid"><div><span>BTC</span><strong>$8,420</strong><small>+4.2%</small></div><div><span>USD</span><strong>$12,180</strong><small>+1.8%</small></div></div></div></div>}<div className="terminal-card"><div className="terminal-head"><span><Terminal size={14} /> LIVE TERMINAL</span><span className="terminal-status">● STREAMING</span></div><div className="terminal-body" aria-live="polite">{visibleLines.map((line, index) => <div key={`${line}-${index}`} className={line.startsWith('✓') ? 'terminal-success' : line.startsWith('→') ? 'terminal-warn' : ''}><span className="line-number">{String(index + 1).padStart(2, '0')}</span>{line}</div>)}</div></div><Button className="cyan-button deploy-live-button" onClick={onDeploy} disabled={deploying || template !== 'health'}>{deploying ? 'Deploying Live…' : 'Deploy Live'} <Rocket data-icon="inline-end" /></Button>{deploymentUrl && <a className="deployment-link" href={deploymentUrl} target="_blank" rel="noreferrer">Open live deployment <ExternalLink data-icon="inline-end" /></a>}</section>
}

/* Keep this component intentionally self-contained: the dashboard is a client-side prototype surface. */
void FolderKanban
void Layers3
void Box
void Send
