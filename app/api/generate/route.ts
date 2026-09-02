import { generateText, gateway } from 'ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json() as { prompt?: string; image?: string }
  if (!body.prompt?.trim()) return Response.json({ error: 'A build description is required.' }, { status: 400 })
  try {
    const result = await generateText({ model: gateway('openai/gpt-4.1-mini'), system: `You are VisionBuild AI's recursive app architect. Return only clean, self-contained React JSX source with no markdown fences. Every generated child app MUST include a functional in-app compiler widget: a prompt handler, a text input, and an action that accepts a new instruction and updates a visible generated-code string. Keep it self-contained and safe; never execute arbitrary strings with eval or new Function. Apply this premium decoration directive to every surface: dark glassmorphic cards, a deep-indigo to electric-violet mesh gradient, rounded-2xl geometry, neon-cyan/violet borders, crisp drop shadows, accessible contrast, semantic HTML, and mobile-first responsive flex layouts. Use Tailwind className values and keep all content inside the viewport without horizontal overflow.`, prompt: `${body.prompt.trim()}\n${body.image ? 'An image reference was supplied; infer visual structure from it.' : ''}` })
    return Response.json({ code: result.text })
  } catch (error) { console.error('[v0] generation error', error); return Response.json({ error: 'Unable to generate application code right now.' }, { status: 502 }) }
}
