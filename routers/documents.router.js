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

// 이력서 목록 조회
router.get('/documents', async (req, res, next) => {
  //   const { name } = req.body;

  const documents = await prisma.documents.findMany({
    select: {
      documentId: true,
      userId: true,
      title: true,
      content: true,
      state: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({ data: documents });
});

export default router;
