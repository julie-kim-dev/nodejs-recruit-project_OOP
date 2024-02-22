import jwt from 'jsonwebtoken';
import { ResumesService } from '../services/resumes.service.js';

export class ResumesController {
  resumesService = new ResumesService();

  // 이력서 목록 조회
  getResumes = async (req, res, next) => {
    try {
      // 컨트롤러에서 해야 하는 역할~
      const orderKey = req.query.orderKey ?? 'resumeId';
      const orderValue = req.query.orderValue ?? 'desc';

      // 검증은 컨트롤러 단계에서 진행
      if (!['resumeId', 'state'].includes(orderKey)) {
        return res
          .status(400)
          .json({ message: 'orderKey가 올바르지 않습니다.' });
      }
      if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
        return res
          .status(400)
          .json({ message: 'orderValue가 올바르지 않습니다.' });
      }
      // ~컨트롤러에서 해야 하는 역할

      // 서비스 레이어 함수 호출~
      const resumes = await this.resumesService.findAllResumes({
        orderKey,
        orderValue: orderValue.toLowerCase(),
      });
      // ~서비스 레이어 함수 호출

      // 반환값
      return res.status(200).json({ data: resumes });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 상세 조회
  getResumesById = async (req, res, next) => {
    try {
      // 인자 파싱
      const resumeId = req.params.resumeId;

      if (!resumeId) {
        return res.status(400).json({ message: 'resumeId는 필수값입니다.' });
      }

      // 서비스 코드 호출
      const resume = await this.resumesService.findResumeById(resumeId);

      // 프론트로 반환
      return res.status(200).json({ data: resume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 생성
  // 컨트롤러에서 파싱해온 값을
  createResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;

      if (!title) {
        return res.status(400).json({ message: '이력서 제목은 필수값입니다.' });
      }
      if (!content) {
        return res.status(400).json({ message: '자기소개는 필수값입니다.' });
      }

      // 서비스로 넘겨줌
      const createdResume = await this.resumesService.createResume({
        userId: user.userId,
        title,
        content,
      });

      return res.status(201).json({ data: createdResume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 수정
  // 파싱
  updateResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { resumeId } = req.params.resumeId;
      const { title, content, state } = req.body;

      // 검증
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

      await this.resumesService.updateResume(
        resumeId,
        { title, content, state },
        userId
      );

      return res.status(201).json({ data: updatedResume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 삭제
  deleteResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { resumeId } = req.params.resumeId;

      await this.resumesService.deleteResume(resumeId, byUser);

      return res.status(201).json({ data: deleteResume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };
}
