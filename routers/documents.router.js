import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// 이력서 생성
router.post('/documents', authMiddleware, async (req, res, next) => {
  const { title, content, state } = req.body;
  const { userId } = req.user;

  const document = await prisma.documents.create({
    data: {
      userId: +userId,
      title,
      content,
      state,
    },
  });
  return res.status(201).json({ data: document });
});

export default router;
