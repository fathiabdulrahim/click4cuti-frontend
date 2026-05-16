import { PageHeader } from '@/components/shared/PageHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="My Profile" description="View and update your information" />
      <ProfileTabs />
    </div>
  )
}
