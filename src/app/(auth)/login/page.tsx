import type { Metadata } from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="rounded-2xl p-8"
         style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
        Sign in to your account
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
        Enter your credentials to continue
      </p>
      <LoginForm />
    </div>
  )
}
