import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// 이력서 생성
router.post('/', authMiddleware, async (req, res, next) => {
  const { title, content, state } = req.body;
  const { userId } = req.user;

  const document = await prisma.documents.create({
    data: {
      userId: +userId,
      title,
      content,
      state: state,
    },
  });
  return res.status(201).json({ data: document });
});

// 이력서 목록 조회
router.get('/', async (req, res, next) => {
  const { name } = req.body;

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

// 이력서 상세 조회
router.get('/:documentId', async (req, res, next) => {
  const { documentId } = req.params;

  const document = await prisma.documents.findFirst({
    where: { documentId: +documentId },
    select: {
      documentId: true,
      userId: true,
      title: true,
      state: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: document });
});

// 이력서 수정
router.patch('/:documentId', authMiddleware, async (req, res, next) => {
  const { documentId } = req.params;
  const { title, content, state } = req.body;

  const editDocument = await prisma.documents.findById(documentId).exec();
  if (!editDocument) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 이력서 데이터입니다.' });
    if (title) {
      const targetDocument = await prisma.documents.findOne({ title }).exec();
      if (targetDocument) {
        targetDocument.title = editDocument.title;
        await targetDocument.save();
      }
      currentTodo.order = order;
    }
  }
});

// 이력서 삭제
router.delete('/:documentId', authMiddleware, async (req, res) => {
  const { documentId } = req.params;

  const deleteDocuments = await prisma.documents.findById(documentId).exec();
  if (!deleteDocuments) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 이력서입니다.' });
  }

  await prisma.documents.deleteOne({ documentId: documentId }).exec();

  return res.status(200).json({});
});

export default router;
