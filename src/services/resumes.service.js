import { ResumesRepository } from '../repositories/resumes.repository.js';

export class ResumesService {
  resumesRepository = new ResumesRepository();

  // 이력서 목록 조회
  findAllResumes = async (orderKey, orderValue) => {
    const resumes = await this.postsRepository.findAllResumes(
      orderKey,
      orderValue
    );

    if (!['resumeId', 'state'].includes(orderKey)) {
      return res.status(400).json({ message: 'orderKey가 올바르지 않습니다.' });
    }
    if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
      return res
        .status(400)
        .json({ message: 'orderValue가 올바르지 않습니다.' });
    }

    return resumes.map((resume) => {
      return {
        resumeId: resume.resumeId,
        title: resume.title,
        content: resume.content,
        state: resume.state,
        name: resume.name,
        createdAt: resume.createdAt,
      };
    });
  };

  // 이력서 상세 조회
  getResumesById = async (resumeId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청
    const resume = await this.resumesRepository.findResumeById(resumeId);

    if (!resumeId) {
      return res.status(400).json({ message: 'resumeId는 필수값입니다.' });
    }

    return {
      resumeId: resume.resumeId,
      userId: resume.userId,
      title: resume.title,
      content: resume.content,
      state: resume.state,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  };

  // 이력서 생성
  createResume = async (userId, title, content, state) => {
    const createdResume = await this.resumesRepository.createResume(
      userId,
      title,
      content,
      state
    );

    if (!title) {
      return res.status(400).json({ message: '이력서 제목은 필수값입니다.' });
    }
    if (!content) {
      return res.status(400).json({ message: '자기소개는 필수값입니다.' });
    }

    return createResume;
  };

  // 이력서 수정
  updateResume = async (userId, resumeId, title, content, state) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resumeId) {
      return res.status(400).json({
        message: 'resumeId는 필수값입니다.',
      });
    }
    if (!userId) {
      return res.status(400).json({
        message: 'userId는 필수값입니다.',
      });
    }
    if (!title) {
      return res.status(400).json({
        message: '이력서 제목은 필수값입니다.',
      });
    }
    if (!content) {
      return res.status(400).json({
        message: '자기소개는 필수값입니다.',
      });
    }
    if (!state) {
      return res.status(400).json({
        message: '이력서 상태는 필수값입니다.',
      });
    }

    const updatedResume = await this.resumesRepository.updateResume(
      resumeId,
      title,
      content,
      state
    );

    if (!resume) {
      return res.status(400).json({
        message: '이력서 조회에 실패하였습니다.',
      });
    }

    if (resume.userId !== user.userId) {
      return res.status(400).json({
        message: '올바르지 않은 요청입니다.',
      });
    }

    return {
      resumeId: updatedResume.resumeId,
      title: updatedResume.title,
      content: updatedResume.content,
      userId: updatedResume.userId,
      state: updatedResume.state,
      createdAt: updatedResume.createdAt,
    };
  };

  // 이력서 삭제
  deleteResume = async (userId, resumeId) => {
    const resume = await this.resumesRepository.findResumeById(
      userId,
      resumeId
    );
    if (!resumeId) {
      return res.status(400).json({
        message: 'resumeId는 필수값입니다.',
      });
    }
    if (!resume) {
      return res.status(400).json({
        message: '이력서 조회에 실패하였습니다.',
      });
    }

    if (resume.userId !== user.userId) {
      return res.status(400).json({
        message: '올바르지 않은 요청입니다.',
      });
    }

    await this.resumesRepository.deleteResume(userId, resumeId);

    return {
      resumeId: resume.resumeId,
      title: resume.title,
      content: resume.content,
      state: resume.state,
      createdAt: resume.createdAt,
    };
  };
}
