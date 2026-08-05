import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Exam } from './entities/exam.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamSubmission } from './entities/exam-submission.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(ExamQuestion)
    private examQuestionRepo: Repository<ExamQuestion>,
    @InjectRepository(ExamSubmission)
    private examSubmissionRepo: Repository<ExamSubmission>,
  ) {}

  // QUESTION BANK
  async getQuestions(courseId?: string, currentUser?: any) {
    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (currentUser && !currentUser.isSuperAdmin && currentUser.campusId) {
      where.campusId = currentUser.campusId;
    }
    return this.questionRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getQuestion(id: string) {
    const q = await this.questionRepo.findOne({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async createQuestion(data: any, currentUser?: any) {
    const questionData = { ...data };
    if (currentUser && !currentUser.isSuperAdmin && currentUser.campusId) {
      questionData.campusId = currentUser.campusId;
    }
    const q = this.questionRepo.create(questionData);
    return this.questionRepo.save(q);
  }

  async updateQuestion(id: string, data: any) {
    const q = await this.getQuestion(id);
    Object.assign(q, data);
    return this.questionRepo.save(q);
  }

  async deleteQuestion(id: string) {
    const q = await this.getQuestion(id);
    return this.questionRepo.remove(q);
  }

  // EXAMS
  async getExams(courseId?: string, currentUser?: any) {
    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (currentUser && !currentUser.isSuperAdmin && currentUser.campusId) {
      where.campusId = currentUser.campusId;
    }
    return this.examRepo.find({
      where,
      relations: { examQuestions: { question: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getExam(id: string) {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: { examQuestions: { question: true } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async createExam(data: any, currentUser?: any) {
    const examData = { ...data };
    if (currentUser && !currentUser.isSuperAdmin && currentUser.campusId) {
      examData.campusId = currentUser.campusId;
    }
    const exam = this.examRepo.create(examData);
    return this.examRepo.save(exam);
  }

  async updateExam(id: string, data: any) {
    const exam = await this.getExam(id);
    Object.assign(exam, data);
    return this.examRepo.save(exam);
  }

  async deleteExam(id: string) {
    const exam = await this.getExam(id);
    return this.examRepo.remove(exam);
  }

  async assignQuestionsToExam(examId: string, questionIds: string[]) {
    await this.examQuestionRepo.delete({ examId });

    const toCreate = questionIds.map((questionId) =>
      this.examQuestionRepo.create({ examId, questionId }),
    );
    return this.examQuestionRepo.save(toCreate);
  }

  async submitExam(
    examId: string,
    studentId: string,
    answers: Record<string, string>,
  ) {
    const exam = await this.getExam(examId);

    let score = 0;

    if (exam.examQuestions) {
      exam.examQuestions.forEach((eq) => {
        const q = eq.question;
        if (q) {
          const studentAnswer = answers[q.id];
          if (
            (q.type === 'MCQ' || q.type === 'TRUE_FALSE') &&
            studentAnswer === q.correctAnswer
          ) {
            score += q.marks;
          }
        }
      });
    }

    const submission = this.examSubmissionRepo.create({
      examId,
      studentId,
      answers,
      score,
    });
    return this.examSubmissionRepo.save(submission);
  }
}
