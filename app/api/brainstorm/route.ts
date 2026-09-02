import { streamText } from 'ai'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) return Response.json({ error: 'Message is required.' }, { status: 400 })

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: 'You are the VisionBuild AI architect. Give concise, practical architecture suggestions for mobile-first sci-fi products. Mention components, data models, and risks when relevant.',
    prompt: message,
    maxOutputTokens: 220,
  })
  return result.toTextStreamResponse()
}
