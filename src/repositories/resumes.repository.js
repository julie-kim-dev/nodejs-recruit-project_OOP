import { prisma } from '../utils/prisma/index.js';

export class ResumesRepository {
  // 이력서 전체 조회
  // 프리즈마 접근 코드만 남아있음
  findAllResumes = async (sort) => {
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
      orderBy: [{ [sort.orderKey]: orderValue }],
    });

    return resumes;
  };

  // 이력서 상세 조회
  findResumeById = async (resumeId) => {
    const resume = await this.prisma.resume.findUnique({
      where: {
        resumeId: +resumeId,
      },
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
    });
    return resume;
  };

  // 이력서 생성
  createResume = async (data) => {
    await this.prisma.resume.create({
      data,
    });
  };

  // 이력서 수정
  updateResume = async (resumeId, data) => {
    await this.prisma.resume.update({
      where: {
        resumeId: +resumeId,
      },
      data,
    });

    // 이력서 삭제
    deleteResume = async (resumeId) => {
      await this.prisma.resume.delete({
        where: {
          resumeId: +resumeId,
        },
      });
    };
  };
}
