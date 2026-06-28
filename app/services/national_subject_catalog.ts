export type NationalSubjectDefinition = {
  code: string
  name: string
  description: string
  coefficient: number
  aliases: string[]
}

export const NATIONAL_SUBJECT_CATALOG: NationalSubjectDefinition[] = [
  { code: 'MAT', name: 'Mathématiques', description: 'Mathématiques', coefficient: 2, aliases: ['math', 'mathematique'] },
  { code: 'FRA', name: 'Français', description: 'Langue française', coefficient: 2, aliases: ['francais'] },
  { code: 'ANG', name: 'Anglais', description: 'Langue anglaise', coefficient: 1, aliases: ['anglais', 'english'] },
  { code: 'LIN', name: 'Lingala', description: 'Langue nationale lingala', coefficient: 1, aliases: ['lingala'] },
  { code: 'KIK', name: 'Kikongo', description: 'Langue nationale kikongo', coefficient: 1, aliases: ['kikongo'] },
  { code: 'SWA', name: 'Swahili', description: 'Langue nationale swahili', coefficient: 1, aliases: ['swahili', 'kiswahili'] },
  { code: 'TSH', name: 'Tshiluba', description: 'Langue nationale tshiluba', coefficient: 1, aliases: ['tshiluba'] },
  { code: 'HIS', name: 'Histoire', description: 'Histoire', coefficient: 1, aliases: ['histoire'] },
  { code: 'GEO', name: 'Géographie', description: 'Géographie', coefficient: 1, aliases: ['geographie'] },
  { code: 'ECM', name: 'Éducation civique et morale', description: 'Éducation civique et morale', coefficient: 1, aliases: ['education civique', 'civique', 'morale'] },
  { code: 'REL', name: 'Religion', description: 'Éducation religieuse', coefficient: 1, aliases: ['religion'] },
  { code: 'EPS', name: 'Éducation physique et sportive', description: 'Éducation physique et sportive', coefficient: 1, aliases: ['eps', 'education physique', 'sport'] },
  { code: 'SVT', name: 'Sciences de la vie et de la Terre', description: 'Biologie et sciences de la Terre', coefficient: 2, aliases: ['svt', 'biologie', 'science de la vie'] },
  { code: 'PHY', name: 'Physique', description: 'Sciences physiques', coefficient: 2, aliases: ['physique'] },
  { code: 'CHI', name: 'Chimie', description: 'Chimie', coefficient: 2, aliases: ['chimie'] },
  { code: 'INF', name: 'Informatique', description: 'Informatique et technologies numériques', coefficient: 2, aliases: ['informatique', 'computer'] },
  { code: 'DES', name: 'Dessin', description: 'Dessin et expression artistique', coefficient: 1, aliases: ['dessin', 'arts plastiques'] },
  { code: 'MUS', name: 'Musique', description: 'Éducation musicale', coefficient: 1, aliases: ['musique'] },
  { code: 'PHI', name: 'Philosophie', description: 'Philosophie', coefficient: 2, aliases: ['philosophie', 'philo'] },
  { code: 'SOC', name: 'Sociologie', description: 'Sociologie', coefficient: 1, aliases: ['sociologie'] },
  { code: 'ECO', name: 'Économie', description: 'Économie', coefficient: 2, aliases: ['economie'] },
  { code: 'DRO', name: 'Droit', description: 'Notions de droit', coefficient: 1, aliases: ['droit'] },
  { code: 'COM', name: 'Comptabilité', description: 'Comptabilité', coefficient: 2, aliases: ['comptabilite'] },
  { code: 'GES', name: 'Gestion', description: 'Gestion des organisations', coefficient: 2, aliases: ['gestion'] },
  { code: 'PED', name: 'Pédagogie', description: 'Pédagogie générale', coefficient: 2, aliases: ['pedagogie'] },
  { code: 'PSY', name: 'Psychologie', description: 'Psychologie', coefficient: 1, aliases: ['psychologie'] },
  { code: 'DID', name: 'Didactique', description: 'Didactique générale et spéciale', coefficient: 2, aliases: ['didactique'] },
  { code: 'MEC', name: 'Mécanique', description: 'Mécanique générale', coefficient: 2, aliases: ['mecanique'] },
  { code: 'ELE', name: 'Électricité', description: 'Électricité', coefficient: 2, aliases: ['electricite'] },
  { code: 'ELN', name: 'Électronique', description: 'Électronique', coefficient: 2, aliases: ['electronique'] },
  { code: 'CON', name: 'Construction', description: 'Construction et bâtiment', coefficient: 2, aliases: ['construction', 'batiment'] },
  { code: 'COU', name: 'Coupe et couture', description: 'Coupe et couture', coefficient: 2, aliases: ['coupe et couture', 'couture'] },
  { code: 'HOT', name: 'Hôtellerie et restauration', description: 'Hôtellerie et restauration', coefficient: 2, aliases: ['hotellerie', 'restauration'] },
  { code: 'AGR', name: 'Agriculture', description: 'Agriculture et industrie agricole', coefficient: 2, aliases: ['agriculture', 'industrie agricole'] },
  { code: 'VET', name: 'Sciences vétérinaires', description: 'Sciences vétérinaires', coefficient: 2, aliases: ['veterinaire'] },
  { code: 'NUT', name: 'Nutrition', description: 'Nutrition', coefficient: 2, aliases: ['nutrition'] },
  { code: 'ALG', name: 'Algèbre', description: 'Algèbre', coefficient: 2, aliases: ['algebre'] },
  { code: 'GEO-M', name: 'Géométrie', description: 'Géométrie', coefficient: 2, aliases: ['geometrie'] },
  { code: 'TRI', name: 'Trigonométrie', description: 'Trigonométrie', coefficient: 2, aliases: ['trigonometrie'] },
  { code: 'STA', name: 'Statistique', description: 'Statistique et probabilités', coefficient: 2, aliases: ['statistique', 'probabilite'] },
  { code: 'ANA', name: 'Analyse mathématique', description: 'Analyse mathématique', coefficient: 2, aliases: ['analyse mathematique'] },
  { code: 'BOT', name: 'Botanique', description: 'Botanique', coefficient: 2, aliases: ['botanique'] },
  { code: 'ZOO', name: 'Zoologie', description: 'Zoologie', coefficient: 2, aliases: ['zoologie'] },
  { code: 'ANA-B', name: 'Anatomie', description: 'Anatomie humaine et animale', coefficient: 2, aliases: ['anatomie'] },
  { code: 'PHY-B', name: 'Physiologie', description: 'Physiologie', coefficient: 2, aliases: ['physiologie'] },
  { code: 'MIC', name: 'Microbiologie', description: 'Microbiologie', coefficient: 2, aliases: ['microbiologie'] },
  { code: 'BIOC', name: 'Biochimie', description: 'Biochimie', coefficient: 2, aliases: ['biochimie'] },
  { code: 'ECO-L', name: 'Écologie', description: 'Écologie et environnement', coefficient: 1, aliases: ['ecologie', 'environnement'] },
  { code: 'LAT', name: 'Latin', description: 'Langue latine', coefficient: 2, aliases: ['latin'] },
  { code: 'LIT', name: 'Littérature', description: 'Littérature française et africaine', coefficient: 2, aliases: ['litterature'] },
  { code: 'LOG', name: 'Logique', description: 'Logique', coefficient: 1, aliases: ['logique'] },
  { code: 'EST', name: 'Esthétique', description: 'Esthétique', coefficient: 1, aliases: ['esthetique'] },
  { code: 'SEC', name: 'Secrétariat', description: 'Techniques de secrétariat', coefficient: 2, aliases: ['secretariat'] },
  { code: 'DAC', name: 'Dactylographie', description: 'Dactylographie', coefficient: 2, aliases: ['dactylographie'] },
  { code: 'COR', name: 'Correspondance commerciale', description: 'Correspondance commerciale', coefficient: 2, aliases: ['correspondance commerciale'] },
  { code: 'ORG', name: 'Organisation des entreprises', description: 'Organisation des entreprises', coefficient: 2, aliases: ['organisation des entreprises'] },
  { code: 'MAR', name: 'Marketing', description: 'Marketing', coefficient: 2, aliases: ['marketing'] },
  { code: 'FIS', name: 'Fiscalité', description: 'Fiscalité', coefficient: 2, aliases: ['fiscalite'] },
  { code: 'FIN', name: 'Finance', description: 'Finance d’entreprise', coefficient: 2, aliases: ['finance'] },
  { code: 'BUR', name: 'Bureautique', description: 'Bureautique', coefficient: 2, aliases: ['bureautique'] },
  { code: 'PROG', name: 'Programmation', description: 'Algorithmique et programmation', coefficient: 2, aliases: ['programmation', 'algorithmique'] },
  { code: 'BDD', name: 'Bases de données', description: 'Conception et gestion des bases de données', coefficient: 2, aliases: ['base de donnees'] },
  { code: 'RES', name: 'Réseaux informatiques', description: 'Réseaux informatiques', coefficient: 2, aliases: ['reseau informatique'] },
  { code: 'SYS', name: 'Systèmes informatiques', description: 'Systèmes d’exploitation et architecture', coefficient: 2, aliases: ['systeme informatique'] },
  { code: 'WEB', name: 'Développement web', description: 'Développement des applications web', coefficient: 2, aliases: ['developpement web'] },
  { code: 'DAO', name: 'Dessin assisté par ordinateur', description: 'Dessin assisté par ordinateur', coefficient: 2, aliases: ['dao'] },
  { code: 'DTE', name: 'Dessin technique', description: 'Dessin technique', coefficient: 2, aliases: ['dessin technique'] },
  { code: 'TEC', name: 'Technologie', description: 'Technologie générale et spécialisée', coefficient: 2, aliases: ['technologie'] },
  { code: 'ATE', name: 'Atelier et travaux pratiques', description: 'Atelier et travaux pratiques', coefficient: 3, aliases: ['atelier', 'travaux pratiques'] },
  { code: 'RDM', name: 'Résistance des matériaux', description: 'Résistance des matériaux', coefficient: 2, aliases: ['resistance des materiaux'] },
  { code: 'TOP', name: 'Topographie', description: 'Topographie', coefficient: 2, aliases: ['topographie'] },
  { code: 'MAT-C', name: 'Matériaux de construction', description: 'Matériaux de construction', coefficient: 2, aliases: ['materiaux de construction'] },
  { code: 'BET', name: 'Béton armé', description: 'Béton armé', coefficient: 2, aliases: ['beton arme'] },
  { code: 'MET', name: 'Métré', description: 'Métré et devis', coefficient: 2, aliases: ['metre', 'devis'] },
  { code: 'MAC', name: 'Machines électriques', description: 'Machines électriques', coefficient: 2, aliases: ['machine electrique'] },
  { code: 'INS', name: 'Installations électriques', description: 'Installations électriques', coefficient: 2, aliases: ['installation electrique'] },
  { code: 'AUT', name: 'Automatisme', description: 'Automatisme industriel', coefficient: 2, aliases: ['automatisme'] },
  { code: 'TEL', name: 'Télécommunications', description: 'Télécommunications', coefficient: 2, aliases: ['telecommunication'] },
  { code: 'MOT', name: 'Moteurs thermiques', description: 'Moteurs thermiques', coefficient: 2, aliases: ['moteur thermique'] },
  { code: 'AUT-M', name: 'Automobile', description: 'Technologie automobile', coefficient: 2, aliases: ['automobile'] },
  { code: 'PAT', name: 'Patronage', description: 'Patronage et gradation', coefficient: 2, aliases: ['patronage'] },
  { code: 'MOD', name: 'Modélisme', description: 'Modélisme', coefficient: 2, aliases: ['modelisme'] },
  { code: 'TEX', name: 'Technologie textile', description: 'Textiles et matériaux', coefficient: 2, aliases: ['textile'] },
  { code: 'CUIS', name: 'Cuisine', description: 'Cuisine professionnelle', coefficient: 3, aliases: ['cuisine'] },
  { code: 'RES-H', name: 'Restauration', description: 'Service de restauration', coefficient: 2, aliases: ['service de restauration'] },
  { code: 'HEB', name: 'Hébergement', description: 'Techniques d’hébergement', coefficient: 2, aliases: ['hebergement'] },
  { code: 'TOU', name: 'Tourisme', description: 'Tourisme', coefficient: 2, aliases: ['tourisme'] },
  { code: 'AGR-G', name: 'Agronomie générale', description: 'Agronomie générale', coefficient: 2, aliases: ['agronomie'] },
  { code: 'PHY-V', name: 'Phytotechnie', description: 'Phytotechnie', coefficient: 2, aliases: ['phytotechnie'] },
  { code: 'ZOO-T', name: 'Zootechnie', description: 'Zootechnie', coefficient: 2, aliases: ['zootechnie'] },
  { code: 'SOL', name: 'Pédologie', description: 'Science du sol', coefficient: 2, aliases: ['pedologie', 'science du sol'] },
  { code: 'GEN', name: 'Génie rural', description: 'Génie rural', coefficient: 2, aliases: ['genie rural'] },
  { code: 'PATH', name: 'Pathologie animale', description: 'Pathologie animale', coefficient: 2, aliases: ['pathologie animale'] },
  { code: 'HYG', name: 'Hygiène', description: 'Hygiène et santé', coefficient: 1, aliases: ['hygiene'] },
  { code: 'DIE', name: 'Diététique', description: 'Diététique', coefficient: 2, aliases: ['dietetique'] },
  { code: 'ALI', name: 'Technologie alimentaire', description: 'Technologie et conservation des aliments', coefficient: 2, aliases: ['technologie alimentaire'] },
  { code: 'PSY-E', name: 'Psychologie de l’enfant', description: 'Psychologie de l’enfant', coefficient: 2, aliases: ['psychologie de l enfant'] },
  { code: 'PRA', name: 'Pratique professionnelle', description: 'Pratique professionnelle et stages', coefficient: 3, aliases: ['pratique professionnelle', 'stage'] },
]

export const COMMON_SUBJECT_CODES = [
  'FRA', 'MAT', 'ANG', 'HIS', 'GEO', 'ECM', 'REL', 'EPS', 'INF',
] as const

export const OPTION_SUBJECT_CODES: Record<string, string[]> = {
  'Chimie-biologie': ['SVT', 'PHY', 'CHI', 'BOT', 'ZOO', 'ANA-B', 'PHY-B', 'MIC', 'BIOC', 'ECO-L'],
  'Commerciale et gestion': ['COM', 'GES', 'ECO', 'DRO', 'ORG', 'MAR', 'FIS', 'FIN', 'SEC', 'COR', 'BUR'],
  Construction: ['DTE', 'DAO', 'TEC', 'ATE', 'RDM', 'TOP', 'MAT-C', 'BET', 'MET'],
  'Coupe et couture': ['COU', 'PAT', 'MOD', 'TEX', 'DES', 'ATE', 'PRA'],
  Électricité: ['ELE', 'PHY', 'DTE', 'TEC', 'ATE', 'MAC', 'INS', 'AUT'],
  Électronique: ['ELN', 'PHY', 'DTE', 'TEC', 'ATE', 'AUT', 'TEL'],
  'Hôtellerie et restauration': ['HOT', 'CUIS', 'RES-H', 'HEB', 'TOU', 'HYG', 'NUT', 'PRA'],
  'Industrie agricole': ['AGR', 'AGR-G', 'PHY-V', 'ZOO-T', 'SOL', 'GEN', 'ALI', 'ATE'],
  Informatique: ['INF', 'PROG', 'BDD', 'RES', 'SYS', 'WEB', 'BUR', 'DAO'],
  'Latin-philo': ['LAT', 'LIT', 'PHI', 'LOG', 'EST', 'SOC'],
  Littéraire: ['LIT', 'PHI', 'LAT', 'SOC', 'LOG'],
  'Math-physique': ['ALG', 'GEO-M', 'TRI', 'STA', 'ANA', 'PHY', 'CHI', 'DTE'],
  'Mecanique generale': ['MEC', 'PHY', 'DTE', 'TEC', 'ATE', 'RDM', 'MOT'],
  'Mécanique automobile': ['MEC', 'AUT-M', 'MOT', 'ELE', 'DTE', 'TEC', 'ATE'],
  Nutrition: ['NUT', 'DIE', 'ALI', 'HYG', 'BIOC', 'MIC', 'CUIS'],
  Petrochimie: ['CHI', 'PHY', 'BIOC', 'TEC', 'ATE'],
  Psychopedagogie: ['PED', 'PSY', 'PSY-E', 'DID', 'SOC', 'PRA'],
  'Pédagogie générale': ['PED', 'PSY', 'PSY-E', 'DID', 'SOC', 'PHI', 'PRA'],
  'Pédagogie maternelle': ['PED', 'PSY-E', 'DID', 'MUS', 'DES', 'PRA'],
  'Pédagogie primaire': ['PED', 'PSY-E', 'DID', 'MUS', 'DES', 'PRA'],
  'Secrétariat-administration': ['SEC', 'DAC', 'COR', 'BUR', 'ORG', 'DRO', 'COM', 'GES'],
  Sociale: ['SOC', 'PSY', 'DRO', 'ECO', 'HYG', 'PRA'],
  'Technique commerciale': ['COM', 'GES', 'ECO', 'DRO', 'ORG', 'MAR', 'SEC', 'COR', 'BUR'],
  Vétérinaire: ['VET', 'ANA-B', 'PHY-B', 'MIC', 'PATH', 'ZOO-T', 'HYG', 'PRA'],
}

export function normalizeSubjectText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function findNationalSubject(value: string) {
  const normalized = normalizeSubjectText(value)

  return NATIONAL_SUBJECT_CATALOG.find((subject) =>
    [subject.name, subject.code, ...subject.aliases].some((candidate) => {
      const normalizedCandidate = normalizeSubjectText(candidate)
      return normalized === normalizedCandidate || normalized.startsWith(`${normalizedCandidate} `)
    })
  )
}
