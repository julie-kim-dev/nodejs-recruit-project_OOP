import { ResumesService } from '../services/resumes.service.js';

export class ResumesController {
  resumesService = new ResumesService();

  // 이력서 목록 조회
  getResumes = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey ?? 'resumeId';
      const orderValue = req.query.orderValue ?? 'desc';

      const resumes = await this.resumesService.findAllResumes(
        orderKey,
        orderValue
      );

      return res.status(200).json({ data: resumes });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 상세 조회
  getResumesById = async (req, res, next) => {
    try {
      const resumeId = req.params.resumeId;

      const resume = await this.resumesService.findResumeById(resumeId);

      return res.status(200).json({ data: resume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 생성
  createResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { title, content, state } = req.body;

      const createdResume = await this.resumesService.createResume(
        userId,
        title,
        content,
        state
      );

      return res.status(201).json({ data: createdResume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 이력서 수정
  updateResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { resumeId } = req.params.resumeId;
      const { title, content, state } = req.body;

      const updatedResume = await this.resumesService.updateResume(
        userId,
        resumeId,
        title,
        content,
        state
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

      const deletedResume = await this.resumesService.deleteResume(
        userId,
        resumeId
      );

      return res.status(201).json({ data: deletedResume });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };
}
