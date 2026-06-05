// ─── Anthropic Claude API client ─────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeResponse {
  content: string
  error?: string
}

export async function askClaude(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<ClaudeResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    return { content: '⚠️ No Anthropic API key configured. Add VITE_ANTHROPIC_API_KEY to your .env file.', error: 'no_key' }
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).error?.message || `HTTP ${res.status}`)
    }

    const data = await res.json()
    const text = data.content?.map((b: any) => b.text || '').join('') || 'No response.'
    return { content: text }
  } catch (err: any) {
    console.error('[Claude] API error:', err)
    return { content: `Error: ${err.message}`, error: err.message }
  }
}
