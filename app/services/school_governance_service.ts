import db from '@adonisjs/lucid/services/db'
import type User from '#models/user'

export const SCHOOL_POSITIONS = {
  promoter: 'Promoteur',
  preschool_director: 'Directeur de la maternelle',
  primary_director: 'Directeur du primaire',
  prefect: 'Préfet des études',
  studies_director: 'Directeur des études',
  pedagogical_advisor: 'Conseiller pédagogique',
  discipline_director: 'Directeur de discipline titulaire',
  deputy_discipline_director: 'Directeur de discipline adjoint',
  finance_director: 'Directeur financier',
  secretary: 'Secrétaire',
  teacher: 'Enseignant',
} as const

export type SchoolPosition = keyof typeof SCHOOL_POSITIONS

export const SCHOOL_WIDE_POSITIONS: SchoolPosition[] = ['finance_director', 'secretary']

export const POSITION_SUPERVISORS: Partial<Record<SchoolPosition, SchoolPosition>> = {
  preschool_director: 'promoter',
  primary_director: 'promoter',
  prefect: 'promoter',
  studies_director: 'prefect',
  pedagogical_advisor: 'prefect',
  discipline_director: 'prefect',
  deputy_discipline_director: 'discipline_director',
  finance_director: 'promoter',
  secretary: 'promoter',
  teacher: 'studies_director',
}

export const POSITION_MISSIONS: Record<SchoolPosition, string> = {
  promoter:
    "Supervise l'établissement comme propriétaire, nomme les responsables et suit les grandes décisions administratives, pédagogiques et financières.",
  preschool_director:
    'Dirige la section maternelle, suit les classes, les enseignants, les élèves et l’application du calendrier scolaire dans sa section.',
  primary_director:
    'Dirige la section primaire, encadre les classes, les enseignants, les élèves et le suivi pédagogique de sa section.',
  prefect:
    "Dirige la section secondaire comme chef d'établissement, supervise les études, la pédagogie, la discipline, le personnel et les rapports de gestion.",
  studies_director:
    'Organise les activités scolaires du secondaire : classes, horaires, examens, bulletins, suivi des résultats et dossiers scolaires, sous la supervision du Préfet des études.',
  pedagogical_advisor:
    'Accompagne les enseignants, suit les méthodes pédagogiques, les préparations, les programmes et les performances scolaires, sous la supervision du Préfet des études.',
  discipline_director:
    'Assure l’ordre, la discipline, le suivi des présences, incidents, sanctions et mesures éducatives, sous la supervision du Préfet des études.',
  deputy_discipline_director:
    'Assiste le Directeur de discipline titulaire dans le contrôle des élèves, les présences, les incidents et l’exécution des mesures disciplinaires.',
  finance_director:
    "Suit les frais scolaires, paiements, recettes, dépenses et rapports financiers de toutes les sections, sous l'autorité du Promoteur.",
  secretary:
    "Gère le secrétariat de l'école : correspondances, dossiers administratifs, archives, attestations et appui administratif à toutes les sections.",
  teacher:
    'Assure les enseignements, les évaluations et le suivi quotidien des élèves dans ses classes.',
}

export const POSITION_INTERFACE_SCOPES: Record<SchoolPosition, string[]> = {
  promoter: [
    'Nommer les responsables de section et les fonctions transversales.',
    "Suivre l'administration, la pédagogie, la discipline et les finances de toute l'école.",
    'Contrôler les rapports de gestion et les grandes décisions institutionnelles.',
  ],
  preschool_director: [
    'Gérer les classes, les élèves et les enseignants de la section maternelle.',
    'Suivre les présences, les activités et les dossiers scolaires de sa section.',
    'Rendre compte au Promoteur.',
  ],
  primary_director: [
    'Gérer les classes, les élèves et les enseignants de la section primaire.',
    'Suivre les notes, les bulletins et le fonctionnement pédagogique de sa section.',
    'Rendre compte au Promoteur.',
  ],
  prefect: [
    'Diriger la section secondaire comme responsable hiérarchique.',
    'Superviser le Directeur des études, le Conseiller pédagogique et la Direction de discipline.',
    'Valider le suivi des classes, des examens, de la discipline et des rapports du secondaire.',
  ],
  studies_director: [
    'Organiser les classes, les horaires, les examens, les bulletins et les dossiers scolaires.',
    'Coordonner le travail scolaire des enseignants du secondaire.',
    'Rendre compte au Préfet des études.',
  ],
  pedagogical_advisor: [
    'Accompagner les enseignants dans les méthodes, les préparations et les programmes.',
    'Analyser les performances scolaires et proposer des améliorations pédagogiques.',
    'Rendre compte au Préfet des études.',
  ],
  discipline_director: [
    'Organiser le suivi de l’ordre, des présences, des incidents et des sanctions.',
    'Encadrer le Directeur de discipline adjoint lorsqu’il est nommé.',
    'Rendre compte au Préfet des études.',
  ],
  deputy_discipline_director: [
    'Assister le Directeur de discipline titulaire.',
    'Suivre les présences, signalements, incidents et mesures disciplinaires.',
    'Rendre compte au Directeur de discipline titulaire.',
  ],
  finance_director: [
    'Gérer les frais scolaires, paiements, recettes et dépenses.',
    "Produire les rapports financiers pour l'ensemble de l'établissement.",
    'Rendre compte au Promoteur.',
  ],
  secretary: [
    'Tenir les correspondances, dossiers administratifs, archives et documents scolaires.',
    'Appuyer les directions de section dans le suivi administratif.',
    'Rendre compte au Promoteur.',
  ],
  teacher: [
    'Gérer ses cours, devoirs, présences et notes.',
    'Suivre les élèves de ses classes.',
    'Rendre compte à la direction pédagogique compétente.',
  ],
}

export type NavigationPolicy = {
  position: SchoolPosition | User['role'] | null
  canViewClasses: boolean
  canViewSubjects: boolean
  canViewStudents: boolean
  canViewTeachers: boolean
  canViewAccounts: boolean
  canViewGrades: boolean
  canViewDiscipline: boolean
  canViewFinance: boolean
  canViewTransfers: boolean
}

export const SECTION_POSITION_OPTIONS: Record<string, SchoolPosition[]> = {
  maternelle: ['preschool_director', 'teacher', 'discipline_director', 'deputy_discipline_director'],
  primaire: ['primary_director', 'teacher', 'discipline_director', 'deputy_discipline_director'],
  secondaire: [
    'prefect',
    'studies_director',
    'pedagogical_advisor',
    'discipline_director',
    'deputy_discipline_director',
    'teacher',
  ],
}

export const POSITION_BASE_ROLES: Record<SchoolPosition, User['role']> = {
  promoter: 'director',
  preschool_director: 'director',
  primary_director: 'director',
  prefect: 'director',
  studies_director: 'director',
  pedagogical_advisor: 'director',
  discipline_director: 'discipline_director',
  deputy_discipline_director: 'discipline_director',
  finance_director: 'finance_director',
  secretary: 'secretary',
  teacher: 'teacher',
}

const CREATION_POLICY: Record<SchoolPosition, SchoolPosition[]> = {
  promoter: Object.keys(SCHOOL_POSITIONS).filter((position) => position !== 'promoter') as SchoolPosition[],
  preschool_director: ['teacher'],
  primary_director: ['teacher'],
  prefect: [
    'teacher',
  ],
  studies_director: ['teacher'],
  pedagogical_advisor: [],
  discipline_director: [],
  deputy_discipline_director: [],
  finance_director: [],
  secretary: [],
  teacher: [],
}

export type GovernanceContext = {
  position: SchoolPosition
  positionLabel: string
  sectionId: string | null
  sectionCode: string | null
  sectionName: string | null
  isPromoter: boolean
  canManageAllSections: boolean
  creatablePositions: SchoolPosition[]
  supervisorPosition: SchoolPosition | null
  supervisorLabel: string | null
  mission: string
  interfaceScopes: string[]
  navigation: NavigationPolicy
}

export function navigationPolicyFor(position?: SchoolPosition | User['role'] | null): NavigationPolicy {
  const key = position || null
  const isPromoter = key === 'promoter'
  const isSectionDirector = ['preschool_director', 'primary_director', 'prefect'].includes(String(key))
  const isStudiesDirector = key === 'studies_director'
  const isPedagogicalAdvisor = key === 'pedagogical_advisor'
  const isDiscipline = key === 'discipline_director' || key === 'deputy_discipline_director'
  const isFinance = key === 'finance_director'
  const isSecretary = key === 'secretary'
  const isTeacher = key === 'teacher'
  const isInspection = key === 'inspection'

  return {
    position: key,
    canViewClasses: isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor || isTeacher,
    canViewSubjects: isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor,
    canViewStudents: isPromoter || isSectionDirector || isStudiesDirector || isDiscipline || isSecretary || isTeacher,
    canViewTeachers: isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor || isInspection,
    canViewAccounts: isPromoter || isSectionDirector || isStudiesDirector,
    canViewGrades: isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor || isTeacher,
    canViewDiscipline: isPromoter || key === 'prefect' || isDiscipline,
    canViewFinance: isPromoter || isSectionDirector || isFinance,
    canViewTransfers: isPromoter || key === 'prefect',
  }
}

export async function getGovernanceContext(user: Pick<User, 'id' | 'schoolId' | 'role'>) {
  const assignment = await db
    .from('school_staff_assignments')
    .leftJoin('school_sections', 'school_staff_assignments.school_section_id', 'school_sections.id')
    .where('school_staff_assignments.user_id', user.id)
    .where('school_staff_assignments.school_id', user.schoolId)
    .where('school_staff_assignments.is_active', true)
    .select(
      'school_staff_assignments.position',
      'school_staff_assignments.school_section_id',
      'school_sections.code as section_code',
      'school_sections.name as section_name'
    )
    .orderBy('school_staff_assignments.is_primary', 'desc')
    .first()

  const fallbackPosition: SchoolPosition =
    user.role === 'teacher'
      ? 'teacher'
      : user.role === 'finance_director'
        ? 'finance_director'
        : user.role === 'discipline_director'
          ? 'discipline_director'
          : user.role === 'secretary'
            ? 'secretary'
            : 'promoter'
  const position = (assignment?.position || fallbackPosition) as SchoolPosition
  const isPromoter = position === 'promoter'
  const canManageAllSections = isPromoter || isSchoolWidePosition(position)

  return {
    position,
    positionLabel: SCHOOL_POSITIONS[position] || position,
    sectionId: assignment?.school_section_id || null,
    sectionCode: assignment?.section_code || null,
    sectionName: assignment?.section_name || null,
    isPromoter,
    canManageAllSections,
    creatablePositions: CREATION_POLICY[position] || [],
    supervisorPosition: POSITION_SUPERVISORS[position] || null,
    supervisorLabel: POSITION_SUPERVISORS[position]
      ? positionLabel(POSITION_SUPERVISORS[position])
      : null,
    mission: POSITION_MISSIONS[position] || 'Responsabilité scolaire',
    interfaceScopes: POSITION_INTERFACE_SCOPES[position] || [],
    navigation: navigationPolicyFor(position),
  } satisfies GovernanceContext
}

export async function listSchoolSections(schoolId: string) {
  return db
    .from('school_sections')
    .where('school_id', schoolId)
    .where('is_active', true)
    .orderBy('display_order', 'asc')
}

export async function ensureSchoolSections(schoolId: string, trx?: any) {
  const client = trx || db
  const definitions = [
    { code: 'maternelle', name: 'Section maternelle', display_order: 1 },
    { code: 'primaire', name: 'Section primaire', display_order: 2 },
    { code: 'secondaire', name: 'Section secondaire', display_order: 3 },
  ]

  for (const definition of definitions) {
    await client
      .table('school_sections')
      .insert({
        school_id: schoolId,
        ...definition,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .onConflict(['school_id', 'code'])
      .ignore()
  }

  return client
    .from('school_sections')
    .where('school_id', schoolId)
    .where('is_active', true)
    .orderBy('display_order', 'asc')
}

export function positionLabel(position?: string | null) {
  return SCHOOL_POSITIONS[position as SchoolPosition] || position || 'Collaborateur'
}

export function canCreatePosition(context: GovernanceContext, position: SchoolPosition) {
  return context.creatablePositions.includes(position)
}

export function isSchoolWidePosition(position?: string | null) {
  return SCHOOL_WIDE_POSITIONS.includes(position as SchoolPosition)
}

export function sectionCodeForLevel(level?: string | null, gradeLevel?: number | null) {
  const normalizedLevel = String(level || '').toLowerCase()
  if (normalizedLevel.includes('matern')) return 'maternelle'
  if (normalizedLevel.includes('primaire')) return 'primaire'
  if (normalizedLevel.includes('second') || normalizedLevel.includes('humanit')) return 'secondaire'
  return Number(gradeLevel || 0) >= 7 ? 'secondaire' : 'primaire'
}

export async function resolveSectionIdForLevel(
  schoolId: string,
  level?: string | null,
  gradeLevel?: number | null,
  trx?: any
) {
  const client = trx || db
  const code = sectionCodeForLevel(level, gradeLevel)
  const section = await client
    .from('school_sections')
    .where('school_id', schoolId)
    .where('code', code)
    .first()
  return section?.id || null
}
