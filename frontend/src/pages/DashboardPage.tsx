import { selectCurrentUser } from '../auth/authSelectors'
import { PageHeader } from '../components/PageHeader'
import { useAppSelector } from '../store/hooks'

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser)

  return (
    <PageHeader
      title={`Welcome back, ${user?.name.split(' ')[0]}`}
      description="You are signed in. This is where your tasks will live."
    />
  )
}

export default DashboardPage
