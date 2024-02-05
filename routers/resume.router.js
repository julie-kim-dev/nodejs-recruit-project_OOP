import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// 이력서 목록 조회
router.get('/', async (req, res, next) => {
  const orderKey = req.query.orderKey ?? 'resumeId';
  const orderValue = req.query.orderValue ?? 'desc';

  if (!['resumeId', 'state'].includes(orderKey)) {
    return res.status(400).json({ message: 'orderKey가 올바르지 않습니다.' });
  }
  if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
    return res.status(400).json({ message: 'orderValue가 올바르지 않습니다.' });
  }

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

  return res.json({ data: resumes });
});

// 이력서 상세 조회
router.get('/:resumeId', async (req, res, next) => {
  const resumeId = req.params.resumeId;
  if (!resumeId) {
    return res.status(400).json({ message: 'resumeId는 필수값입니다.' });
  }
  const resume = await prisma.resume.findFirst({
    where: {
      resumeId: Number(resumeId),
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

  if (!resume) {
    return res.json({ data: {} });
  }

  return res.json({ data: resume });
});

// 이력서 생성
router.post('/', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ message: '이력서 제목은 필수값입니다.' });
  }
  if (!content) {
    return res.status(400).json({ message: '자기소개는 필수값입니다.' });
  }
  await prisma.resume.create({
    data: {
      title,
      content,
      state: 'APPLY',
      userId: user.userId,
    },
  });

  return res.status(201).json({ message: '이력서 작성이 완료되었습니다.' });
});

// 이력서 수정
router.patch('/:resumeId', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  const resumeId = req.params.resumeId;
  const { title, content, state } = req.body;

  if (!resumeId) {
    return res.status(400).json({
      message: 'resumeId는 필수값입니다.',
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

  const resume = await prisma.resume.findFirst({
    where: {
      resumeId: +resumeId,
    },
  });
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

  await prisma.resume.update({
    where: {
      resumeId: +resumeId,
    },
    data: {
      title,
      content,
      state,
    },
  });
  return res.status(201).json({ message: '이력서 수정이 완료되었습니다.' });
});

// 이력서 삭제
router.delete('/:resumeId', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  const resumeId = req.params.resumeId;

  if (!resumeId) {
    return res.status(400).json({
      message: 'resumeId는 필수값입니다.',
    });
  }
  const resume = await prisma.resume.findFirst({
    where: {
      resumeId: +resumeId,
    },
  });
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
  await prisma.resume.delete({
    where: {
      resumeId: +resumeId,
    },
  });

  return res.status(201).end();
});

export default router;
