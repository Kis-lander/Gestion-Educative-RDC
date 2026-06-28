import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'
import Class from '#models/class'
import Student from '#models/student'
import StudentSchoolHistory from '#models/student_school_history'
import TransferAuthorization from '#models/transfer_authorization'

export default class StudentSchoolHistoryService {
  public async archiveTransfer(options: {
    authorization: TransferAuthorization
    student: Student
    sourceClass: Class | null
    destinationClass: Class
    acceptedAt: DateTime
    trx: TransactionClientContract
  }) {
    const { authorization, student, sourceClass, destinationClass, acceptedAt, trx } = options
    const existingHistory = await StudentSchoolHistory.query({ client: trx })
      .where('transferAuthorizationId', authorization.id)
      .first()

    if (existingHistory) {
      return existingHistory
    }

    const [grades, disciplines, payments] = await Promise.all([
      trx
        .from('grades as grade')
        .join('classes as class', 'class.id', 'grade.class_id')
        .leftJoin('subjects as subject', 'subject.id', 'grade.subject_id')
        .where('grade.student_id', student.id)
        .where('class.school_id', authorization.fromSchoolId)
        .select(
          'grade.term',
          'grade.exam_type',
          'grade.score',
          'grade.max_score',
          'grade.percentage',
          'grade.exam_date',
          'grade.teacher_comments',
          'class.name as class_name',
          'class.academic_year',
          'subject.name as subject_name'
        )
        .orderBy('grade.exam_date', 'asc'),
      trx
        .from('disciplines as discipline')
        .join('users as reporter', 'reporter.id', 'discipline.reported_by')
        .where('discipline.student_id', student.id)
        .where('reporter.school_id', authorization.fromSchoolId)
        .select(
          'discipline.incident_type',
          'discipline.description',
          'discipline.severity',
          'discipline.sanction',
          'discipline.incident_date',
          'discipline.action_taken'
        )
        .orderBy('discipline.incident_date', 'asc'),
      trx
        .from('fee_payments as payment')
        .join('school_fees as fee', 'fee.id', 'payment.fee_id')
        .where('payment.student_id', student.id)
        .where('fee.school_id', authorization.fromSchoolId)
        .select(
          'fee.fee_type',
          'fee.academic_year',
          'fee.term',
          'payment.amount_paid',
          'payment.currency',
          'payment.payment_date',
          'payment.payment_method',
          'payment.receipt_number'
        )
        .orderBy('payment.payment_date', 'asc'),
    ])

    const scoredGrades = grades.filter((grade) => Number(grade.max_score) > 0)
    const averagePercentage = scoredGrades.length
      ? scoredGrades.reduce(
          (total, grade) =>
            total +
            Number(
              grade.percentage ??
                (Number(grade.score || 0) / Number(grade.max_score || 20)) * 100
            ),
          0
        ) / scoredGrades.length
      : null

    const history = new StudentSchoolHistory()
    history.useTransaction(trx)
    history.merge({
      studentId: student.id,
      transferAuthorizationId: authorization.id,
      schoolId: authorization.fromSchoolId,
      classId: sourceClass?.id || null,
      destinationSchoolId: authorization.toSchoolId,
      destinationClassId: destinationClass.id,
      studentName: student.user.fullName,
      registrationNumber: student.registrationNumber,
      className: sourceClass?.name || null,
      schoolOption: student.schoolOption,
      academicYear: sourceClass?.academicYear || null,
      enrolledAt: student.enrollmentDate || null,
      leftAt: acceptedAt,
      transferReason: authorization.reason,
      personalSnapshot: {
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        postnom: student.user.postnom,
        email: student.user.email,
        phone: student.user.phone,
        birthDate: student.birthDate?.toISODate() || null,
        birthPlace: student.birthPlace,
        nationality: student.nationality,
        gender: student.gender,
        parentPhone: student.parentPhone,
        address: student.address,
        medicalInfo: student.medicalInfo,
        shift: student.shift,
      },
      academicSnapshot: {
        summary: {
          gradesCount: grades.length,
          averagePercentage,
          incidentsCount: disciplines.length,
          paymentsCount: payments.length,
          totalPaid: payments.reduce(
            (totals: Record<string, number>, payment) => {
              const currency = String(payment.currency || 'USD')
              totals[currency] = (totals[currency] || 0) + Number(payment.amount_paid || 0)
              return totals
            },
            {}
          ),
        },
        grades,
        disciplines,
        payments,
      },
    })
    await history.save()

    return history
  }
}
