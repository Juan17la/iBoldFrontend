import { Bot, SendHorizonal, User } from 'lucide-react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
  tokens?: number
}

interface ChatWindowProps {
  messages: ChatMessage[]
  prompt: string
  estimatedTokens: number
  blockedForSeconds: number
  onPromptChange: (value: string) => void
  onSend: () => void
  busy: boolean
}

export const ChatWindow = ({
  messages,
  prompt,
  estimatedTokens,
  blockedForSeconds,
  onPromptChange,
  onSend,
  busy,
}: ChatWindowProps) => {
  const disabled = busy || blockedForSeconds > 0 || !prompt.trim()

  return (
    <div className="flex h-full flex-col border border-slate-300 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)] rounded-none">
      <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-3 sm:px-5">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Chat de Solicitudes IA</h2>
        <p className="mt-0.5 text-sm text-slate-600">
          Estimador: aproximadamente {estimatedTokens.toLocaleString()} tokens
        </p>
      </div>

      <div className="h-[420px] space-y-3 overflow-auto bg-slate-50/40 p-4 sm:p-5">
        {messages.length === 0 ? (
          <p className="border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
            Aun no hay mensajes. Envia tu primera solicitud.
          </p>
        ) : null}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`border p-3 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.55)] rounded-none ${
              message.role === 'assistant'
                ? 'border-cyan-200 bg-cyan-50/70'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide">
                {message.role === 'assistant' ? (
                  <Bot className="h-3.5 w-3.5 text-cyan-700" />
                ) : (
                  <User className="h-3.5 w-3.5 text-slate-700" />
                )}
                {message.role === 'assistant' ? 'Asistente' : 'Usuario'}
              </span>
              <span>{message.timestamp}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-800">{message.text}</p>
            {message.tokens ? (
              <p className="mt-2 text-xs text-slate-500">Tokens consumidos: {message.tokens}</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-800">Consulta</span>
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Escribe una consulta corta sobre patrones de diseno"
            className="h-28 w-full border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm outline-none transition focus:border-sky-600 focus:bg-white rounded-none"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-500">
            {blockedForSeconds > 0
              ? `Limite de peticiones alcanzado. Reintenta en ${blockedForSeconds}s.`
                : 'El envio esta disponible.'}
          </p>
          <button
            type="button"
            onClick={onSend}
            disabled={disabled}
            className="inline-flex items-center gap-2 border border-sky-700 bg-sky-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-400 rounded-none"
          >
            <SendHorizonal className="h-4 w-4" />
            {busy ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </div>
    </div>
  )
}
