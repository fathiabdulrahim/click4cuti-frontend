import { useSearchParams } from 'react-router-dom'
import PersonalDetailAdminTab from '@/pages/admin/user-tabs/PersonalDetailAdminTab'
import JobInfoTab from '@/pages/admin/user-tabs/JobInfoTab'
import ApprovalMatrixTab from '@/pages/admin/user-tabs/ApprovalMatrixTab'
import ContactInfoAdminTab from '@/pages/admin/user-tabs/ContactInfoAdminTab'
import DependentsAdminTab from '@/pages/admin/user-tabs/DependentsAdminTab'
import WorkExperienceAdminTab from '@/pages/admin/user-tabs/WorkExperienceAdminTab'
import FilesAdminTab from '@/pages/admin/user-tabs/FilesAdminTab'
import TrainingAdminTab from '@/pages/admin/user-tabs/TrainingAdminTab'
import EquipmentAdminTab from '@/pages/admin/user-tabs/EquipmentAdminTab'
import CareerTimelineTab from '@/pages/admin/user-tabs/CareerTimelineTab'
import ConductRecordTab from '@/pages/admin/user-tabs/ConductRecordTab'
import PayrollTab from '@/pages/admin/user-tabs/PayrollTab'
import ClaimPolicyTab from '@/pages/admin/user-tabs/ClaimPolicyTab'
import ClaimBalancesTab from '@/pages/admin/user-tabs/ClaimBalancesTab'
import ClaimHistoryTab from '@/pages/admin/user-tabs/ClaimHistoryTab'
import { AdminUserSidebarNav } from './AdminUserSidebarNav'
import { AdminUserMobileNav } from './AdminUserMobileNav'
import { ADMIN_USER_NAV_VALUES } from './adminUserNav'

interface Props {
  userId: string
}

export function AdminUserTabs({ userId }: Props) {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('tab') ?? ''
  const tab = ADMIN_USER_NAV_VALUES.includes(fromUrl) ? fromUrl : 'personal'

  function handleChange(value: string) {
    const next = new URLSearchParams(params)
    next.set('tab', value)
    setParams(next, { replace: true })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Mobile: dropdown */}
      <AdminUserMobileNav
        value={tab}
        onChange={handleChange}
        className="md:hidden"
      />

      {/* Desktop: sidebar */}
      <AdminUserSidebarNav
        value={tab}
        onChange={handleChange}
        className="hidden md:block"
      />

      {/* Content area */}
      <div className="min-w-0 flex-1">
        {tab === 'personal'        && <PersonalDetailAdminTab userId={userId} />}
        {tab === 'job'             && <JobInfoTab            userId={userId} />}
        {tab === 'approval'        && <ApprovalMatrixTab     userId={userId} />}
        {tab === 'contact'         && <ContactInfoAdminTab   userId={userId} />}
        {tab === 'dependents'      && <DependentsAdminTab    userId={userId} />}
        {tab === 'work-experience' && <WorkExperienceAdminTab userId={userId} />}
        {tab === 'career'          && <CareerTimelineTab     userId={userId} />}
        {tab === 'compensation'    && <PayrollTab            userId={userId} />}
        {tab === 'files'           && <FilesAdminTab         userId={userId} />}
        {tab === 'training'        && <TrainingAdminTab      userId={userId} />}
        {tab === 'equipment'       && <EquipmentAdminTab     userId={userId} />}
        {tab === 'claim-policy'    && <ClaimPolicyTab        userId={userId} />}
        {tab === 'claim-balances'  && <ClaimBalancesTab      userId={userId} />}
        {tab === 'claim-history'   && <ClaimHistoryTab       userId={userId} />}
        {tab === 'conduct'         && <ConductRecordTab      userId={userId} />}
      </div>
    </div>
  )
}
