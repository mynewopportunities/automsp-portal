'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
          Email address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@automsp.us"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
          style={{
            background: 'var(--input)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
          style={{
            background: 'var(--input)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-60"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
