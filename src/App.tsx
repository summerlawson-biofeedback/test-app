import { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'

const BG = '#F8F7F4'
const TEXT = '#2E3D49'
const TEAL = '#0D6B5E'

const client = generateClient<Schema>()

function App() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // @ts-expect-error: Amplify data-schema v1.25 incorrectly types 'email' as string[] — runtime is correct
      const { errors } = await client.models.WaitlistEntry.create({ email })
      if (errors && errors.length > 0) {
        setError('Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
        setEmail('')
      }
    } catch {
      setError('Unable to connect. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: BG, color: TEXT }}>
      {/* SECTION 1 — Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl" style={{ color: TEAL }}>
            PulsePause
          </h1>
          <p className="mt-6 text-2xl font-light">
            Your nervous system is talking. It's time to listen.
          </p>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            PulsePause reads your physiology, interrupts stress-driven digital
            habits, and guides you back to calm. Built for people who want to
            perform better by recovering smarter.
          </p>
          <button
            type="button"
            onClick={scrollToWaitlist}
            className="mt-10 rounded-full px-8 py-3 text-lg font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* SECTION 2 — How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Detects',
                body: 'Reads heart rate and HRV from your Apple Watch via HealthKit',
              },
              {
                title: 'Intervenes',
                body: 'Gently pauses overstimulating apps when your nervous system needs a break',
              },
              {
                title: 'Recovers',
                body: 'Guides you through breathing exercises to restore balance',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-xl font-semibold" style={{ color: TEAL }}>
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed opacity-90">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Waitlist signup */}
      <section id="waitlist" className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Be first to restore your focus
          </h2>
          {submitted ? (
            <p className="mt-8 text-lg font-medium" style={{ color: TEAL }}>
              You're on the list! We'll be in touch.
            </p>
          ) : (
            <>
              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-base outline-none focus:border-transparent focus:ring-2 disabled:opacity-60"
                  style={{ color: TEXT }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: TEAL }}
                >
                  {loading ? 'Saving…' : 'Notify Me'}
                </button>
              </form>
              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
            </>
          )}
          <p className="mt-4 text-sm opacity-70">
            iPhone + Apple Watch required. iOS only at launch.
          </p>
        </div>
      </section>

      {/* SECTION 4 — Footer */}
      <footer className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-base font-semibold" style={{ color: TEAL }}>
            PulsePause © 2025
          </p>
          <p className="mt-2 text-sm opacity-70">
            Built for nervous systems in a hyperstimulating world.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
