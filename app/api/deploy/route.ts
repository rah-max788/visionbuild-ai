import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { projectId, code } = await request.json() as { projectId?: string; code?: string }
  if (!code?.trim()) return Response.json({ error: 'Generated code is required.' }, { status: 400 })
  if (!process.env.VERCEL_TOKEN) return Response.json({ error: 'Deployment credentials are not configured. Add VERCEL_TOKEN in project settings.' }, { status: 503 })
  try {
    const deployment = await fetch('https://api.vercel.com/v13/deployments', { method: 'POST', headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `visionbuild-${Date.now()}`, files: [{ file: 'app/page.tsx', data: code }], projectSettings: { framework: 'nextjs' } }) })
    const data = await deployment.json()
    if (!deployment.ok) throw new Error(data.error?.message || 'Vercel deployment failed')
    if (projectId) await supabase.from('projects').update({ status: 'deployed', deployment_url: `https://${data.url}`, updated_at: new Date().toISOString() }).eq('id', projectId).eq('user_id', user.id)
    return Response.json({ url: `https://${data.url}` })
  } catch (error) { console.error('[v0] deployment error', error); return Response.json({ error: error instanceof Error ? error.message : 'Deployment failed.' }, { status: 502 }) }
}
