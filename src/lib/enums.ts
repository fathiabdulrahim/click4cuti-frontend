// Human-readable labels for backend enums.
// Used by <EnumSelect /> and read-only displays.

export const ENUM_LABELS = {
  employee_type: {
    PERMANENT: 'Permanent',
    CONTRACT: 'Contract Basis',
    PROBATION: 'Probation',
    INTERNSHIP: 'Internship',
    FREELANCE: 'Freelance',
    PART_TIME: 'Part-Time Staff',
    OJT: 'OJT',
    SL1M_OJT: 'SL1M OJT',
  },
  nric_color: {
    BLUE: 'Blue',
    RED: 'Red',
  },
  race: {
    MALAY: 'Malay',
    CHINESE: 'Chinese',
    INDIAN: 'Indian',
    OTHERS: 'Others',
  },
  religion: {
    ISLAM: 'Islam',
    BUDDHISM: 'Buddhism',
    HINDU: 'Hindu',
    CHRISTIAN: 'Christian',
    OTHERS: 'Others',
  },
  blood_type: {
    A: 'A',
    B: 'B',
    AB: 'AB',
    O: 'O',
  },
  education_level: {
    PRE_SCHOOL: 'Pre School',
    PRIMARY_SCHOOL: 'Primary School',
    SECONDARY_SCHOOL: 'Secondary School',
    COLLEGE: 'College / University',
    DIPLOMA: 'Diploma',
    DEGREE: 'Degree',
    MASTER: 'Master',
    PHD: 'PhD',
  },
  marital_status: {
    SINGLE: 'Single',
    MARRIED: 'Married',
    DIVORCED: 'Divorced',
    WIDOWED: 'Widowed',
  },
  nationality: {
    CITIZEN: 'Citizen',
    NON_CITIZEN: 'Non Citizen',
    PERMANENT_RESIDENT: 'Permanent Resident',
  },
  bumi_status: {
    BUMIPUTERA: 'Bumiputera',
    NON_BUMIPUTERA: 'Non Bumiputera',
  },
  family_relation: {
    SPOUSE: 'Spouse',
    CHILD: 'Child',
    PARENT: 'Parent',
  },
  family_employment_status: {
    WORKING: 'Working',
    NOT_WORKING: 'Not Working',
    STUDYING: 'Studying',
    RETIRED: 'Retired',
  },
  supervisor_category: {
    LEAVE: 'Leave',
    CLAIM: 'Claim',
    OVERTIME: 'Overtime',
    TIMEOFF: 'Time-off',
  },
  warning_source: {
    AUTO: 'Auto-generated',
    MANUAL: 'Manual',
  },
  bank_account_type: {
    SAVING: 'Savings',
    CURRENT: 'Current',
    FIXED: 'Fixed',
    OTHERS: 'Others',
  },
  bank_account_status: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },
  epf_contribution_start: {
    BEFORE_1998_AUG: 'Before 1 August 1998',
    AFTER_1998_AUG: 'After 1 August 1998',
    AFTER_2001_AUG: 'After 1 August 2001',
  },
  tax_category: {
    REGULAR: 'Regular',
    REP: 'Returning Expert Programme (REP)',
    KNOWLEDGE_WORKER: 'Knowledge Worker (Iskandar Malaysia)',
  },
  claim_status: {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  },
  driving_license_class: {
    A: 'A — Disabled vehicle ≤ 450 kg',
    A1: 'A1 — Disabled vehicle ≤ 3500 kg',
    B: 'B — Motorcycles (all)',
    B1: 'B1 — Motorcycles ≤ 500cc',
    B2: 'B2 — Motorcycles ≤ 250cc',
    C: 'C — Motorized tricycles',
    D: 'D — Cars ≤ 3500 kg',
    DA: 'DA — Cars no clutch ≤ 3500 kg',
    E: 'E — Trucks (all)',
    E1: 'E1 — Trucks ≤ 7500 kg',
    E2: 'E2 — Trucks ≤ 5000 kg',
    F: 'F — Tractors wheeled ≤ 5000 kg',
    G: 'G — Tractors chained ≤ 5000 kg',
    H: 'H — Tractors wheeled > 5000 kg',
    I: 'I — Tractors chained > 5000 kg',
    M: 'M — Court Conviction',
  },
} as const

// Rails enum quirk: API returns lowercase keys, accepts uppercase values on write.
// Normalize an API response value back to uppercase for our typed code.
export function upperEnum<T extends string>(value: string | null | undefined): T | null {
  if (!value) return null
  return value.toUpperCase() as T
}

// Build options array for <Select /> / <Combobox /> from a label map.
export function enumOptions<T extends string>(
  map: Readonly<Record<T, string>>,
): { value: T; label: string }[] {
  return (Object.entries(map) as [T, string][]).map(([value, label]) => ({ value, label }))
}
