import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const TAB_VALUES = [
  'personal',
  'job',
  'contact',
  'dependents',
  'compensation',
  'files',
  'career',
  'training',
  'equipment',
  'leave-policy',
  'claim-policy',
  'claim-balances',
  'claim-history',
  'conduct',
  'approval',
  'work-experience',
] as const

type TabValue = (typeof TAB_VALUES)[number]

interface Props {
  userId: string
}

export function AdminUserTabs({ userId }: Props) {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('tab')
  const tab: TabValue = TAB_VALUES.includes(fromUrl as TabValue)
    ? (fromUrl as TabValue)
    : 'personal'

  function handleChange(value: string) {
    const next = new URLSearchParams(params)
    next.set('tab', value)
    setParams(next, { replace: true })
  }

  return (
    <Tabs value={tab} onValueChange={handleChange}>
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="personal">Personal Detail</TabsTrigger>
        <TabsTrigger value="job">Job Info</TabsTrigger>
        <TabsTrigger value="approval">Approval</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="dependents">Dependents</TabsTrigger>
        <TabsTrigger value="work-experience">Work Experience</TabsTrigger>
        <TabsTrigger value="career">Career Timeline</TabsTrigger>
        <TabsTrigger value="compensation">Payroll</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
        <TabsTrigger value="equipment">Assets</TabsTrigger>
        <TabsTrigger value="claim-policy">Claim Policy</TabsTrigger>
        <TabsTrigger value="claim-balances">Claim Balances</TabsTrigger>
        <TabsTrigger value="claim-history">Claim History</TabsTrigger>
        <TabsTrigger value="conduct">Conduct</TabsTrigger>
      </TabsList>
      <TabsContent value="personal"><PersonalDetailAdminTab userId={userId} /></TabsContent>
      <TabsContent value="job"><JobInfoTab userId={userId} /></TabsContent>
      <TabsContent value="approval"><ApprovalMatrixTab userId={userId} /></TabsContent>
      <TabsContent value="contact"><ContactInfoAdminTab userId={userId} /></TabsContent>
      <TabsContent value="dependents"><DependentsAdminTab userId={userId} /></TabsContent>
      <TabsContent value="work-experience"><WorkExperienceAdminTab userId={userId} /></TabsContent>
      <TabsContent value="career"><CareerTimelineTab userId={userId} /></TabsContent>
      <TabsContent value="compensation"><PayrollTab userId={userId} /></TabsContent>
      <TabsContent value="files"><FilesAdminTab userId={userId} /></TabsContent>
      <TabsContent value="training"><TrainingAdminTab userId={userId} /></TabsContent>
      <TabsContent value="equipment"><EquipmentAdminTab userId={userId} /></TabsContent>
      <TabsContent value="claim-policy"><ClaimPolicyTab userId={userId} /></TabsContent>
      <TabsContent value="claim-balances"><ClaimBalancesTab userId={userId} /></TabsContent>
      <TabsContent value="claim-history"><ClaimHistoryTab userId={userId} /></TabsContent>
      <TabsContent value="conduct"><ConductRecordTab userId={userId} /></TabsContent>
    </Tabs>
  )
}
