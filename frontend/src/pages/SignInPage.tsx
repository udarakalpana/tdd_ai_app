import { useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Logo } from '../components/Logo'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../auth/useAuth'
import { APP_NAME, APP_TAGLINE, ROUTES } from '../config/app'
import { normalizeApiError } from '../lib/apiClient'
import type { SignInCredentials } from '../types/api'

type SignInField = keyof SignInCredentials

type SignInFieldErrors = Partial<Record<SignInField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Catching empty and malformed input in the browser keeps obvious mistakes
 * from eating into the API's five-attempts-per-minute login throttle.
 */
const validateCredentials = ({
  email,
  password,
}: SignInCredentials): SignInFieldErrors => {
  const errors: SignInFieldErrors = {}

  if (!email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

const HIGHLIGHTS = [
  'Capture what needs doing in seconds.',
  'Set priorities so the important work stays visible.',
  'Follow every task from pending through to done.',
]

const SignInPage = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard

  const handleChange = (field: SignInField) => (value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const validationErrors = validateCredentials(credentials)

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      const target = validationErrors.email ? emailRef : passwordRef
      target.current?.focus()

      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await signIn({
        email: credentials.email.trim(),
        password: credentials.password,
      })

      navigate(redirectTo, { replace: true })
    } catch (error) {
      const apiError = normalizeApiError(error)

      setFormError(apiError.message)
      setIsSubmitting(false)

      if (apiError.isValidationError) {
        /* The pair was rejected — never say which half was wrong. */
        passwordRef.current?.focus()
        passwordRef.current?.select()
      }
    }
  }

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1.05fr_1fr] dark:bg-slate-950">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-brand-700 via-brand-800 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -left-24 size-96 rounded-full bg-brand-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -bottom-24 size-[30rem] rounded-full bg-brand-500/20 blur-3xl"
        />

        <div className="relative">
          <Logo tone="inverted" />
        </div>

        <div className="relative flex max-w-md flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance text-white">
              Stay on top of every task.
            </h1>
            <p className="text-lg text-pretty text-brand-100/80">
              Sign in to pick up exactly where you left off.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm text-brand-50/90"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-3"
                    aria-hidden="true"
                  >
                    <path
                      d="m4 10.5 4 4 8-9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-brand-100/60">
          {APP_NAME} — {APP_TAGLINE}
        </p>
      </section>

      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-6">
            <Logo className="lg:hidden" />

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Sign in
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your credentials to open your dashboard.
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            {formError && <Alert>{formError}</Alert>}

            <TextField
              id="email"
              ref={emailRef}
              label="Email address"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              autoFocus
              disabled={isSubmitting}
              value={credentials.email}
              error={fieldErrors.email}
              onChange={(event) => handleChange('email')(event.target.value)}
            />

            <TextField
              id="password"
              ref={passwordRef}
              label="Password"
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              value={credentials.password}
              error={fieldErrors.password}
              onChange={(event) => handleChange('password')(event.target.value)}
              trailing={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={
                    isPasswordVisible ? 'Hide password' : 'Show password'
                  }
                  aria-pressed={isPasswordVisible}
                  className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  {isPasswordVisible ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 4.9c4.6 0 8.2 3.5 9.5 7.1a12 12 0 0 1-2.9 4.2M6.3 6.7A12.3 12.3 0 0 0 2.5 12c1.3 3.6 4.9 7.1 9.5 7.1 1.5 0 2.9-.4 4.1-1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 12C3.8 8.4 7.4 4.9 12 4.9s8.2 3.5 9.5 7.1c-1.3 3.6-4.9 7.1-9.5 7.1S3.8 15.6 2.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingLabel="Signing in…"
              className="mt-1 w-full py-3"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Protected by rate limiting. Repeated failed attempts are temporarily
            blocked.
          </p>
        </div>
      </main>
    </div>
  )
}

export default SignInPage
