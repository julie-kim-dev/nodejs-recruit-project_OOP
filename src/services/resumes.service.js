import { ResumesRepository } from '../repositories/resumes.repository.js';

export class ResumesService {
  resumesRepository = new ResumesRepository();

  // 이력서 목록 조회
  findAllResumes = async (sort) => {
    // 리포지토리 코드 호출 후 종료
    const resumes = await this.postsRepository.findAllResumes(sort);
  };

  // 이력서 상세 조회
  getResumesById = async (resumeId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청
    const resume = await this.resumesRepository.findResumeById(resumeId);
  };

  // 이력서 생성
  createResume = async (userId, title, content) => {
    await this.resumesRepository.createResume({
      userId,
      title,
      content,
      state: 'APPLY',
      // state 기본값은 여기 서비스의 비즈니스 로직에서 결정
    });
  };

  // 이력서 수정
  updateResume = async (resumeId, data, byUser) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);

    // res는 컨트롤러에서 사용하는 것이기 때문에 throw로 변경
    if (!resume) {
      throw {
        code: 401,
        message: '존재하지 않는 이력서입니다.',
      };
    }

    if (resume.userId !== byUser.userId) {
      throw {
        code: 401,
        message: '올바르지 않은 요청입니다..',
      };
    }

    const { title, content, state } = data;
    await this.resumesRepository.updateResume(resumeId, {
      title,
      content,
      state,
    });

    // 이력서 삭제
    deleteResume = async (resumeId, byUser) => {
      const resume = await this.resumesRepository.findResumeById(resumeId);

      if (!resumeId) {
        throw {
          code: 400,
          message: 'resumeId는 필수값입니다.',
        };
      }
      if (!resume) {
        throw {
          code: 400,
          message: '이력서 조회에 실패했습니다.',
        };
      }

      if (resume.userId !== byUser.userId) {
        throw {
          code: 400,
          message: '올바르지 않은 요청입니다.',
        };
      }

      await this.resumesRepository.deleteResume(resumeId);
    };
  };
}
