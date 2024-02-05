import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// 회원가입
router.post('/sign-up', async (req, res, next) => {
  const { email, password, passwordConfirm, name, age, gender, profileImage } =
    req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일을 입력해주세요.' });
  }
  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
  }
  if (!passwordConfirm) {
    return res.status(400).json({ message: '비밀번호 확인을 입력해주세요.' });
  }
  if (!name) {
    return res.status(400).json({ message: '이름을 입력해주세요.' });
  }
  if (password.length < 6) {
    return res
      .status(409)
      .json({ message: '비밀번호는 6자리 이상이어야 합니다.' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const isExistUser = await prisma.users.findFirst({
    where: { email },
  });
  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Users 테이블에 사용자 추가
  const user = await prisma.users.create({
    data: { email, password: hashedPassword, name },
  });

  // UserInfos 테이블에 사용자 정보 추가
  const userInfo = await prisma.userInfos.create({
    data: {
      userId: user.userId,
      age,
      gender, //: gender.toUpperCase(),
      profileImage,
    },
  });

  return res
    .status(201)
    .json({ message: '회원가입이 완료되었습니다.', data: userInfo });
});

// 로그인
router.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  const token = jwt.sign({ userId: user.userId }, 'custom-secret-key');

  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인 성공' });
});

// 유저 상세정보 조회
router.get('/', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      userInfos: {
        select: {
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
