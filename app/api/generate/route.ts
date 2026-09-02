import { generateText, gateway } from 'ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json() as { prompt?: string; image?: string }
  if (!body.prompt?.trim()) return Response.json({ error: 'A build description is required.' }, { status: 400 })
  try {
    const result = await generateText({ model: gateway('openai/gpt-4.1-mini'), system: 'You generate clean, self-contained React JSX components. Return only valid JSX code, no markdown fences. Use accessible semantic HTML and inline className values.', prompt: `${body.prompt}\n${body.image ? 'An image reference was supplied; infer visual structure from it.' : ''}` })
    return Response.json({ code: result.text })
  } catch (error) { console.error('[v0] generation error', error); return Response.json({ error: 'Unable to generate application code right now.' }, { status: 502 }) }
}
