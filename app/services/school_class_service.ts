import Class from '#models/class'
import Student from '#models/student'
import { DateTime } from 'luxon'
import { resolveSectionIdForLevel } from '#services/school_governance_service'

const CLASS_CAPACITY = 50

export type RdcClassCatalogItem = {
  name: string
  level: string
  gradeLevel: number
}

export const RDC_SCHOOL_OPTIONS = [
  'Chimie-biologie',
  'Commerciale et gestion',
  'Construction',
  'Coupe et couture',
  'Électricité',
  'Électronique',
  'Hôtellerie et restauration',
  'Industrie agricole',
  'Informatique',
  'Latin-philo',
  'Littéraire',
  'Math-physique',
  'Mecanique generale',
  'Mécanique automobile',
  'Nutrition',
  'Petrochimie',
  'Psychopedagogie',
  'Pédagogie générale',
  'Pédagogie maternelle',
  'Pédagogie primaire',
  'Secrétariat-administration',
  'Sociale',
  'Technique commerciale',
  'Vétérinaire',
] as const

export const RDC_CLASS_CATALOG: RdcClassCatalogItem[] = [
  { name: '1ère Maternelle', level: 'Maternelle', gradeLevel: 1 },
  { name: '2ème Maternelle', level: 'Maternelle', gradeLevel: 2 },
  { name: '3ème Maternelle', level: 'Maternelle', gradeLevel: 3 },
  { name: '1ère Primaire', level: 'Primaire', gradeLevel: 1 },
  { name: '2ème Primaire', level: 'Primaire', gradeLevel: 2 },
  { name: '3ème Primaire', level: 'Primaire', gradeLevel: 3 },
  { name: '4ème Primaire', level: 'Primaire', gradeLevel: 4 },
  { name: '5ème Primaire', level: 'Primaire', gradeLevel: 5 },
  { name: '6ème Primaire', level: 'Primaire', gradeLevel: 6 },
  { name: '7ème Éducation de base', level: 'Éducation de base', gradeLevel: 7 },
  { name: '8ème Éducation de base', level: 'Éducation de base', gradeLevel: 8 },
  { name: '1ère Humanités', level: 'Humanités', gradeLevel: 9 },
  { name: '2ème Humanités', level: 'Humanités', gradeLevel: 10 },
  { name: '3ème Humanités', level: 'Humanités', gradeLevel: 11 },
  { name: '4ème Humanités', level: 'Humanités', gradeLevel: 12 },
]

export function isHumanitiesClass(classObj?: { level?: string | null; gradeLevel: number } | null) {
  return Boolean(
    classObj && (classObj.level?.toLowerCase().includes('humanit') || classObj.gradeLevel >= 9)
  )
}

export function getClassSchoolOption(classObj?: Pick<Class, 'name'> | null) {
  if (!classObj) return null
  const nameWithoutSection = getClassFamilyName(classObj.name)
  return RDC_SCHOOL_OPTIONS.find((option) => nameWithoutSection.endsWith(` - ${option}`)) || null
}

export async function listSchoolClasses(schoolId?: string | null) {
  if (!schoolId) return []

  return Class.query()
    .where('schoolId', schoolId)
    .where('academicYear', DateTime.now().year.toString())
    .whereNull('archivedAt')
    .orderBy('gradeLevel', 'asc')
    .orderBy('name', 'asc')
}

type ResolveEnrollmentClassParams = {
  schoolId: string
  classId?: string
  className?: string
  schoolOption?: string
  allowedSectionId?: string | null
  trx?: any
}

function getClassSectionIndex(name: string) {
  const match = name.match(/\s([A-Z]+)$/)
  if (!match) return 0

  return match[1].split('').reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1
}

function getClassFamilyName(name: string) {
  return name.replace(/\s[A-Z]+$/, '').trim()
}

export function getCatalogClassForClass(
  classObj?: Pick<Class, 'name' | 'level' | 'gradeLevel'> | null
) {
  if (!classObj) return null

  const familyName = getClassFamilyName(classObj.name)
  return (
    RDC_CLASS_CATALOG.find((item) => familyName === item.name) ||
    RDC_CLASS_CATALOG.find(
      (item) => item.gradeLevel === classObj.gradeLevel && item.level === classObj.level
    ) ||
    null
  )
}

function getSectionLabel(index: number) {
  let value = index + 1
  let label = ''

  while (value > 0) {
    value -= 1
    label = String.fromCharCode(65 + (value % 26)) + label
    value = Math.floor(value / 26)
  }

  return label
}

async function findAvailableClass(baseClass: Class, trx?: any) {
  const familyName = getClassFamilyName(baseClass.name)
  const familyClasses = (
    await Class.query({ client: trx })
      .where('schoolId', baseClass.schoolId)
      .where('academicYear', baseClass.academicYear)
      .where('level', baseClass.level)
      .where('gradeLevel', baseClass.gradeLevel)
      .whereNull('archivedAt')
      .forUpdate()
  )
    .filter((classObj) => getClassFamilyName(classObj.name) === familyName)
    .sort((left, right) => getClassSectionIndex(left.name) - getClassSectionIndex(right.name))

  const classIds = familyClasses.map((classObj) => classObj.id)
  const enrollmentRows = classIds.length
    ? await Student.query({ client: trx })
        .whereIn('classId', classIds)
        .where('academicStatus', 'active')
        .select('classId')
        .count('* as total')
        .groupBy('classId')
    : []
  const enrollmentByClass = new Map(
    enrollmentRows.map((row) => [row.classId, Number(row.$extras.total || 0)])
  )

  for (const classObj of familyClasses) {
    const enrollment = enrollmentByClass.get(classObj.id) || 0
    classObj.currentEnrollment = enrollment

    if (enrollment < CLASS_CAPACITY) {
      await classObj.save()
      return classObj
    }
  }

  const lastSectionIndex = familyClasses.reduce(
    (highest, classObj) => Math.max(highest, getClassSectionIndex(classObj.name)),
    0
  )
  const nextSectionIndex = lastSectionIndex + 1
  const nextClassName = `${familyName} ${getSectionLabel(nextSectionIndex)}`

  return Class.firstOrCreate(
    {
      schoolId: baseClass.schoolId,
      name: nextClassName,
      academicYear: baseClass.academicYear,
    },
    {
      schoolId: baseClass.schoolId,
      name: nextClassName,
      level: baseClass.level,
      gradeLevel: baseClass.gradeLevel,
      maxCapacity: CLASS_CAPACITY,
      currentEnrollment: 0,
      academicYear: baseClass.academicYear,
      shift: baseClass.shift,
      teacherId: null,
    },
    { client: trx }
  )
}

export async function resolveEnrollmentClass({
  schoolId,
  classId,
  className,
  schoolOption,
  allowedSectionId,
  trx,
}: ResolveEnrollmentClassParams) {
  if (classId) {
    const selectedClass = await Class.query({ client: trx })
      .where('id', classId)
      .where('schoolId', schoolId)
      .whereNull('archivedAt')
      .firstOrFail()

    if (allowedSectionId && selectedClass.schoolSectionId !== allowedSectionId) {
      throw new Error("Cette classe n'appartient pas à votre section scolaire.")
    }

    const registeredOption = getClassSchoolOption(selectedClass)
    if (
      isHumanitiesClass(selectedClass) &&
      !registeredOption &&
      (!schoolOption ||
        !RDC_SCHOOL_OPTIONS.includes(schoolOption as (typeof RDC_SCHOOL_OPTIONS)[number]))
    ) {
      throw new Error('Veuillez sélectionner une option valide pour cette classe des humanités.')
    }

    if (registeredOption && schoolOption && registeredOption !== schoolOption) {
      throw new Error(`Cette classe est enregistrée avec l'option ${registeredOption}.`)
    }

    return findAvailableClass(selectedClass, trx)
  }

  const catalogClass = RDC_CLASS_CATALOG.find((item) => item.name === className)
  if (!catalogClass) throw new Error('Veuillez sélectionner une classe valide.')

  const humanities = isHumanitiesClass(catalogClass)
  if (
    humanities &&
    (!schoolOption ||
      !RDC_SCHOOL_OPTIONS.includes(schoolOption as (typeof RDC_SCHOOL_OPTIONS)[number]))
  ) {
    throw new Error('Veuillez sélectionner une option valide pour cette classe des humanités.')
  }

  const storedName = humanities ? `${catalogClass.name} - ${schoolOption}` : catalogClass.name
  const academicYear = DateTime.now().year.toString()
  const schoolSectionId = await resolveSectionIdForLevel(
    schoolId,
    catalogClass.level,
    catalogClass.gradeLevel,
    trx
  )
  if (allowedSectionId && schoolSectionId !== allowedSectionId) {
    throw new Error("Vous ne pouvez inscrire un élève que dans votre section scolaire.")
  }
  const archivedClass = await Class.query({ client: trx })
    .where('schoolId', schoolId)
    .where('name', storedName)
    .where('academicYear', academicYear)
    .whereNotNull('archivedAt')
    .first()

  if (archivedClass) {
    throw new Error(
      `La classe ${storedName} est archivée. Restaurez-la depuis les archives avant d'y inscrire un élève.`
    )
  }

  const baseClass = await Class.firstOrCreate(
    { schoolId, name: storedName, academicYear, archivedAt: null },
    {
      schoolId,
      name: storedName,
      level: catalogClass.level,
      gradeLevel: catalogClass.gradeLevel,
      maxCapacity: CLASS_CAPACITY,
      currentEnrollment: 0,
      academicYear,
      schoolSectionId,
      shift: 'morning',
      teacherId: null,
    },
    { client: trx }
  )

  return findAvailableClass(baseClass, trx)
}
