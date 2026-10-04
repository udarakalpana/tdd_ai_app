import { useEffect, useRef, useState, type SubmitEvent } from 'react'

import { CheckIcon, EyeIcon, EyeOffIcon } from '../assets/svg'
import { selectSignInError, selectSignInStatus } from '../auth/authSelectors'
import { clearSignInError } from '../auth/authSlice'
import { signIn } from '../auth/authThunks'
import { Logo } from '../components/Logo'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { SignInCredentials } from '../types/api'
import type { SignInField, SignInFieldErrors } from '../types/signIn'
import { APP_NAME, APP_TAGLINE } from '../utils/constants/app'
import {
  INITIAL_SIGN_IN_CREDENTIALS,
  SIGN_IN_HIGHLIGHTS,
} from '../utils/constants/signIn'
import {
  hasValidationErrors,
  validateSignInCredentials,
} from '../utils/validation/signIn'

const SignInPage = () => {
  const dispatch = useAppDispatch()
  const signInStatus = useAppSelector(selectSignInStatus)
  const signInError = useAppSelector(selectSignInError)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [credentials, setCredentials] = useState<SignInCredentials>(
    INITIAL_SIGN_IN_CREDENTIALS,
  )
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const isSubmitting = signInStatus === 'pending'

  /** A failed attempt should not greet the next visit to this screen. */
  useEffect(() => {
    return () => {
      dispatch(clearSignInError())
    }
  }, [dispatch])

  const handleChange = (field: SignInField) => (value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))

    if (signInError) {
      dispatch(clearSignInError())
    }
  }

  /**
   * Success needs no handling here: once `signIn` is fulfilled, `RequireGuest`
   * redirects the visitor away from this screen.
   */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(clearSignInError())

    const validationErrors = validateSignInCredentials(credentials)

    if (hasValidationErrors(validationErrors)) {
      setFieldErrors(validationErrors)
      const target = validationErrors.email ? emailRef : passwordRef
      target.current?.focus()

      return
    }

    setFieldErrors({})

    const result = await dispatch(
      signIn({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    )

    if (signIn.rejected.match(result) && result.payload?.isValidationError) {
      /* The pair was rejected — never say which half was wrong. */
      passwordRef.current?.focus()
      passwordRef.current?.select()
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
            {SIGN_IN_HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm text-brand-50/90"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <CheckIcon className="size-3" />
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
            {signInError && <Alert>{signInError.message}</Alert>}

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
                    <EyeOffIcon className="size-4.5" />
                  ) : (
                    <EyeIcon className="size-4.5" />
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
