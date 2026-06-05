// ─── Zustand AI chat state ────────────────────────────────────────────────────
import { create } from 'zustand'
import type { ChatMessage } from '../lib/ai/claudeClient'

interface ChatState {
  history:   ChatMessage[]
  loading:   boolean
  input:     string
  setInput:  (v: string) => void
  addMsg:    (msg: ChatMessage) => void
  setLoading:(v: boolean) => void
  clear:     () => void
}

export const useChatStore = create<ChatState>((set) => ({
  history:   [],
  loading:   false,
  input:     '',
  setInput:  (input) => set({ input }),
  addMsg:    (msg) => set(s => ({ history: [...s.history, msg] })),
  setLoading:(loading) => set({ loading }),
  clear:     () => set({ history: [], input: '' }),
}))
