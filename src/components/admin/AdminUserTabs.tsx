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
      <div className="border-b -mt-2 mb-4 overflow-x-auto">
        <TabsList className="h-auto bg-transparent p-0 gap-0 flex-nowrap">
        <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Personal Detail</TabsTrigger>
        <TabsTrigger value="job" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Job Info</TabsTrigger>
        <TabsTrigger value="approval" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Approval</TabsTrigger>
        <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Contact</TabsTrigger>
        <TabsTrigger value="dependents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Dependents</TabsTrigger>
        <TabsTrigger value="work-experience" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Work Experience</TabsTrigger>
        <TabsTrigger value="career" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Career Timeline</TabsTrigger>
        <TabsTrigger value="compensation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Payroll</TabsTrigger>
        <TabsTrigger value="files" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Files</TabsTrigger>
        <TabsTrigger value="training" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Training</TabsTrigger>
        <TabsTrigger value="equipment" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Assets</TabsTrigger>
        <TabsTrigger value="claim-policy" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Claim Policy</TabsTrigger>
        <TabsTrigger value="claim-balances" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Claim Balances</TabsTrigger>
        <TabsTrigger value="claim-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Claim History</TabsTrigger>
        <TabsTrigger value="conduct" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE4E01] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground py-2.5 px-4">Conduct</TabsTrigger>
        </TabsList>
      </div>
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
