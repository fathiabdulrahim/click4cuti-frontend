import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PersonalDetailTab from '@/pages/profile/tabs/PersonalDetailTab'
import WorkExperienceTab from '@/pages/profile/tabs/WorkExperienceTab'
import ContactInfoTab from '@/pages/profile/tabs/ContactInfoTab'
import DependentsTab from '@/pages/profile/tabs/DependentsTab'
import FilesTab from '@/pages/profile/tabs/FilesTab'
import TrainingTab from '@/pages/profile/tabs/TrainingTab'
import EquipmentTab from '@/pages/profile/tabs/EquipmentTab'
import PreferencesTab from '@/pages/profile/tabs/PreferencesTab'

const TAB_VALUES = [
  'personal',
  'contact',
  'dependents',
  'work-experience',
  'files',
  'training',
  'equipment',
  'preferences',
] as const

type TabValue = (typeof TAB_VALUES)[number]

export function ProfileTabs() {
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
        <TabsTrigger value="contact">Contact Info</TabsTrigger>
        <TabsTrigger value="dependents">Dependents</TabsTrigger>
        <TabsTrigger value="work-experience">Work Experience</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="training">Training &amp; Certificate</TabsTrigger>
        <TabsTrigger value="equipment">Assets</TabsTrigger>
        <TabsTrigger value="preferences">App Setting</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <PersonalDetailTab />
      </TabsContent>
      <TabsContent value="contact">
        <ContactInfoTab />
      </TabsContent>
      <TabsContent value="dependents">
        <DependentsTab />
      </TabsContent>
      <TabsContent value="work-experience">
        <WorkExperienceTab />
      </TabsContent>
      <TabsContent value="files">
        <FilesTab />
      </TabsContent>
      <TabsContent value="training">
        <TrainingTab />
      </TabsContent>
      <TabsContent value="equipment">
        <EquipmentTab />
      </TabsContent>
      <TabsContent value="preferences">
        <PreferencesTab />
      </TabsContent>
    </Tabs>
  )
}
