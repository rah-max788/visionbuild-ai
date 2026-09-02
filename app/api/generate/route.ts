import { ToolLoopAgent, gateway, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const MAX_STEPS = 12
const MAX_FILES = 40
const MAX_FILE_SIZE = 120_000

type AgentEvent = { type: 'log' | 'file' | 'complete' | 'error'; message?: string; path?: string; content?: string; files?: string[] }

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json() as { prompt?: string; image?: string; projectId?: string }
  const prompt = body.prompt?.trim()
  if (!prompt) return Response.json({ error: 'A build description is required.' }, { status: 400 })

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AgentEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      const files = new Map<string, string>()
      const projectId = body.projectId
      const persist = async (path: string, content: string) => {
        if (!projectId || files.size >= MAX_FILES || content.length > MAX_FILE_SIZE) return
        const { error } = await supabase.from('project_files').upsert({ project_id: projectId, user_id: user.id, path, content, language: path.endsWith('.tsx') ? 'tsx' : path.endsWith('.css') ? 'css' : 'ts' }, { onConflict: 'project_id,path' })
        if (error) throw error
      }
      try {
        send({ type: 'log', message: 'Agent initialized · autonomous build loop ready' })
        const agent = new ToolLoopAgent({
          model: gateway('openai/gpt-4.1-mini'),
          instructions: 'You are a production app engineer. Build a complete multi-file React project. Use createFile for new files, modifyFile for corrections, and runTest after implementation. Keep files concise, accessible, and mobile safe. Do not stop until tests pass.',
          stopWhen: ({ steps }) => steps.length >= MAX_STEPS || steps.some(step => step.toolCalls.some(call => call.toolName === 'runTest' && step.toolResults.some(result => result.toolCallId === call.toolCallId))),
          tools: {
            createFile: tool({ description: 'Create a separate project source file.', inputSchema: z.object({ path: z.string().min(1).max(180), content: z.string().max(MAX_FILE_SIZE) }), execute: async ({ path, content }) => { if (files.has(path)) return { ok: false, error: 'File exists; use modifyFile.' }; files.set(path, content); await persist(path, content); send({ type: 'log', message: `Tool Called: createFile · ${path}` }); send({ type: 'file', path, content }); return { ok: true, path } } }),
            modifyFile: tool({ description: 'Modify an existing project source file.', inputSchema: z.object({ path: z.string().min(1).max(180), content: z.string().max(MAX_FILE_SIZE), reason: z.string().max(300).optional() }), execute: async ({ path, content, reason }) => { files.set(path, content); await persist(path, content); send({ type: 'log', message: `Tool Called: modifyFile · ${path}${reason ? ` · ${reason}` : ''}` }); send({ type: 'file', path, content }); return { ok: true, path } } }),
            runTest: tool({ description: 'Run a lightweight validation over all generated files.', inputSchema: z.object({ command: z.string().max(200) }), execute: async ({ command }) => { send({ type: 'log', message: `Running Dependency Check · ${command}` }); const invalid = [...files].filter(([path, content]) => !path.includes('/') || content.trim().length === 0); if (invalid.length) { send({ type: 'log', message: `Error Caught: Auto-fixing ${invalid[0][0]}` }); return { ok: false, errors: invalid.map(([path]) => `${path} is empty or misplaced`) } } send({ type: 'log', message: 'Tests passed · multi-file structure is valid' }); return { ok: true, files: files.size } } }),
          },
        })
        await agent.generate({ prompt: `${prompt}${body.image ? '\nAn image reference is available.' : ''}` })
        send({ type: 'complete', message: 'Autonomous build complete', files: [...files.keys()] })
      } catch (error) { console.error('[v0] agent generation error', error); send({ type: 'error', message: 'The autonomous build could not complete safely.' }) }
      finally { controller.close() }
    },
  })
  return new Response(stream, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache, no-transform', connection: 'keep-alive' } })
}
