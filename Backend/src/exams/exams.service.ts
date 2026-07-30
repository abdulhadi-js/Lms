import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ExamsService {
  private prisma = new PrismaClient();

  // QUESTION BANK
  async getQuestions() {
    return this.prisma.question.findMany();
  }

  async getQuestion(id: string) {
    const q = await this.prisma.question.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async createQuestion(data: any) {
    if (data.options && typeof data.options !== 'string') {
      data.options = JSON.stringify(data.options);
    }
    return this.prisma.question.create({ data });
  }

  async updateQuestion(id: string, data: any) {
    if (data.options && typeof data.options !== 'string') {
      data.options = JSON.stringify(data.options);
    }
    return this.prisma.question.update({ where: { id }, data });
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }

  // EXAMS
  async getExams() {
    return this.prisma.exam.findMany({ include: { ExamQuestion: true } });
  }

  async getExam(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { ExamQuestion: { include: { question: true } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async createExam(data: any) {
    return this.prisma.exam.create({ data });
  }

  async updateExam(id: string, data: any) {
    return this.prisma.exam.update({ where: { id }, data });
  }

  async deleteExam(id: string) {
    return this.prisma.exam.delete({ where: { id } });
  }

  async assignQuestionsToExam(examId: string, questionIds: string[]) {
    // Delete existing
    await this.prisma.examQuestion.deleteMany({ where: { examId } });
    
    // Create new
    const toCreate = questionIds.map(questionId => ({
      examId,
      questionId,
    }));
    return this.prisma.examQuestion.createMany({ data: toCreate });
  }

  async submitExam(examId: string, studentId: string, answers: Record<string, string>) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { ExamQuestion: { include: { question: true } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    let score = 0;
    
    exam.ExamQuestion.forEach((eq: any) => {
      const q = eq.question;
      const studentAnswer = answers[q.id];
      if ((q.type === 'MCQ' || q.type === 'TRUE_FALSE') && studentAnswer === q.correctAnswer) {
        score += q.marks;
      }
    });

    return this.prisma.examSubmission.create({
      data: {
        examId,
        studentId,
        answers: JSON.stringify(answers),
        score,
      }
    });
  }
}
