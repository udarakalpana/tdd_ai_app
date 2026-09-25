import { selectCurrentUser } from '../auth/authSlice'
import { useAppSelector } from '../store/hooks'

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser)

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Welcome back, {user?.name.split(' ')[0]}
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        You are signed in. This is where your tasks will live.
      </p>
    </div>
  )
}

export default DashboardPage
