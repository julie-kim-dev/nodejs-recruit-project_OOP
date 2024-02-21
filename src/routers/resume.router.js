import express from 'express';
import { prisma } from '../src/utils/prisma/index.js';
import authMiddleware from '../src/middlewares/need-signin.middleware.js';
import { ResumesController } from '../controllers/resumes.controller.js';

const router = express.Router();
const resumesController = new ResumesController();

// 이력서 목록 조회
router.get('/', resumesController.getResumes);

// 이력서 상세 조회
router.get('/:resumeId', resumesController.getResumesById);

// 이력서 생성
router.post('/', authMiddleware, resumesController.createResume);

// 이력서 수정
router.patch('/:resumeId', authMiddleware, resumesController.updateResume);

// 이력서 삭제
router.delete('/:resumeId', authMiddleware, resumesController.deleteResume);

export default router;
