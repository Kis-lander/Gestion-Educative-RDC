export type SchoolEvaluationSection = 'maternelle' | 'primaire' | 'secondaire'

export type EvaluationChoice = {
  value: string
  label: string
}

export type SectionEvaluationPolicy = {
  section: SchoolEvaluationSection
  periodAxisLabel: string
  dateLabel: string
  scoreLabel: string
  scoreRequired: boolean
  defaultMaxScore: number
  periods: EvaluationChoice[]
  evaluationTypes: EvaluationChoice[]
  nationalExams: EvaluationChoice[]
}

export const SECTION_EVALUATION_POLICIES: Record<SchoolEvaluationSection, SectionEvaluationPolicy> =
  {
    maternelle: {
      section: 'maternelle',
      periodAxisLabel: 'Période scolaire',
      dateLabel: "Date d'observation",
      scoreLabel: 'Appréciation',
      scoreRequired: false,
      defaultMaxScore: 20,
      periods: [
        { value: 'T1-P1', label: 'Trimestre 1 - Période 1' },
        { value: 'T1-P2', label: 'Trimestre 1 - Période 2' },
        { value: 'T2-P1', label: 'Trimestre 2 - Période 1' },
        { value: 'T2-P2', label: 'Trimestre 2 - Période 2' },
        { value: 'T3-P1', label: 'Trimestre 3 - Période 1' },
        { value: 'T3-P2', label: 'Trimestre 3 - Période 2' },
      ],
      evaluationTypes: [
        { value: 'Observation', label: 'Observation' },
        { value: 'Appréciation', label: 'Appréciation' },
        { value: 'Activité pratique', label: 'Activité pratique' },
      ],
      nationalExams: [],
    },
    primaire: {
      section: 'primaire',
      periodAxisLabel: 'Période scolaire',
      dateLabel: "Date de l'évaluation",
      scoreLabel: 'Note /20',
      scoreRequired: true,
      defaultMaxScore: 20,
      periods: [
        { value: 'T1-P1', label: 'Trimestre 1 - Période 1' },
        { value: 'T1-P2', label: 'Trimestre 1 - Période 2' },
        { value: 'T1-EX', label: 'Trimestre 1 - Examen trimestriel' },
        { value: 'T2-P1', label: 'Trimestre 2 - Période 1' },
        { value: 'T2-P2', label: 'Trimestre 2 - Période 2' },
        { value: 'T2-EX', label: 'Trimestre 2 - Examen trimestriel' },
        { value: 'T3-P1', label: 'Trimestre 3 - Période 1' },
        { value: 'T3-P2', label: 'Trimestre 3 - Période 2' },
        { value: 'T3-EX', label: 'Trimestre 3 - Examen trimestriel' },
      ],
      evaluationTypes: [
        { value: 'Travail journalier', label: 'Travail journalier' },
        { value: 'Interrogation', label: 'Interrogation' },
        { value: 'Devoir', label: 'Devoir' },
        { value: 'Examen trimestriel', label: 'Examen trimestriel' },
      ],
      nationalExams: [{ value: 'ENAFEP', label: 'ENAFEP' }],
    },
    secondaire: {
      section: 'secondaire',
      periodAxisLabel: 'Période scolaire',
      dateLabel: "Date de l'évaluation",
      scoreLabel: 'Note /20',
      scoreRequired: true,
      defaultMaxScore: 20,
      periods: [
        { value: 'S1-P1', label: 'Semestre 1 - Période 1' },
        { value: 'S1-P2', label: 'Semestre 1 - Période 2' },
        { value: 'S1-EX', label: 'Semestre 1 - Examen semestriel' },
        { value: 'S2-P1', label: 'Semestre 2 - Période 1' },
        { value: 'S2-P2', label: 'Semestre 2 - Période 2' },
        { value: 'S2-EX', label: 'Semestre 2 - Examen semestriel' },
      ],
      evaluationTypes: [
        { value: 'Travail journalier', label: 'Travail journalier' },
        { value: 'Interrogation', label: 'Interrogation' },
        { value: 'Devoir', label: 'Devoir' },
        { value: 'Examen semestriel', label: 'Examen semestriel' },
      ],
      nationalExams: [
        { value: 'TENASOSP', label: 'TENASOSP' },
        { value: 'EXETAT', label: 'EXETAT' },
      ],
    },
  }

export function evaluationSectionFromClass(
  sectionCode?: string | null,
  gradeLevel?: number | null
): SchoolEvaluationSection {
  if (sectionCode === 'maternelle' || sectionCode === 'primaire' || sectionCode === 'secondaire') {
    return sectionCode
  }

  if (typeof gradeLevel === 'number' && Number.isFinite(gradeLevel)) {
    if (gradeLevel <= 0) return 'maternelle'
    if (gradeLevel <= 6) return 'primaire'
  }

  return 'secondaire'
}

export function evaluationPolicyForClass(sectionCode?: string | null, gradeLevel?: number | null) {
  return SECTION_EVALUATION_POLICIES[evaluationSectionFromClass(sectionCode, gradeLevel)]
}

export function allEvaluationPeriodOptions(sectionCode?: string | null) {
  const policies = sectionCode
    ? [evaluationPolicyForClass(sectionCode)]
    : Object.values(SECTION_EVALUATION_POLICIES)
  const options = new Map<string, string>()

  for (const policy of policies) {
    for (const period of policy.periods) {
      options.set(period.value, period.label)
    }
  }

  return Array.from(options.entries()).map(([value, label]) => ({ value, label }))
}

export function allEvaluationTypeOptions(sectionCode?: string | null) {
  const policies = sectionCode
    ? [evaluationPolicyForClass(sectionCode)]
    : Object.values(SECTION_EVALUATION_POLICIES)
  const options = new Map<string, string>()

  for (const policy of policies) {
    for (const type of policy.evaluationTypes) {
      options.set(type.value, type.label)
    }
  }

  return Array.from(options.entries()).map(([value, label]) => ({ value, label }))
}

export function evaluationPeriodLabel(value?: string | null) {
  if (!value) return '-'

  for (const policy of Object.values(SECTION_EVALUATION_POLICIES)) {
    const period = policy.periods.find((item) => item.value === value)
    if (period) return period.label
  }

  const legacyLabels: Record<string, string> = {
    'T1': 'Trimestre 1',
    'T2': 'Trimestre 2',
    'T3': 'Trimestre 3',
    'S1': 'Semestre 1',
    'S2': 'Semestre 2',
    'Examens Blancs': 'Examens blancs',
    'Examen National': 'Examen national',
  }

  return legacyLabels[value] || value
}

export function evaluationTypeLabel(value?: string | null) {
  if (!value) return '-'

  for (const policy of Object.values(SECTION_EVALUATION_POLICIES)) {
    const type = policy.evaluationTypes.find(
      (item) => item.value.toLowerCase() === value.toLowerCase()
    )
    if (type) return type.label
  }

  const legacyLabels: Record<string, string> = {
    devoir: 'Devoir',
    interrogation: 'Interrogation',
  }

  return legacyLabels[value] || value
}
