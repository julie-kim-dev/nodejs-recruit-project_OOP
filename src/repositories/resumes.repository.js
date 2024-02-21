import { prisma } from '../utils/prisma/index.js';

export class ResumesRepository {
  // 이력서 전체 조회
  findAllResumes = async (orderKey, orderValue) => {
    const resumes = await prisma.resume.findMany({
      select: {
        resumeId: true,
        title: true,
        content: true,
        state: true,
        user: {
          select: { name: true },
        },
        createdAt: true,
      },
      orderBy: [{ [orderKey]: orderValue.toLowerCase() }],
    });

    return resumes;
  };

  // 이력서 상세 조회
  findResumeById = async (resumeId) => {
    const resume = await this.prisma.resume.findUnique({
      where: {
        resumeId: Number(resumeId),
      },
    });
    return resume;
  };

  // 이력서 생성
  createResume = async (userId, title, content, state) => {
    const createdResume = await this.prisma.resume.create({
      data: {
        title,
        content,
        state: 'APPLY',
        userId,
      },
    });

    return createdResume;
  };

  // 이력서 수정

  updateResume = async (userId, resumeId, title, content, state) => {
    const updatedResume = await this.prisma.resume.update({
      where: {
        resumeId: +resumeId,
      },
      data: {
        title,
        content,
        state,
      },
    });

    return updatedResume;
  };

  // 이력서 삭제
  deleteResume = async (resumeId) => {
    const deletedResume = await this.prisma.resume.delete({
      where: {
        resumeId: +resumeId,
      },
    });

    return deletedResume;
  };
}
