import express from 'express';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();
const usersController = new UsersController();

// 회원가입
router.post('/sign-up', usersController.signUp);

// 로그인
router.post('/sign-in', usersController.signIn);

// 유저 상세정보 조회
router.get('/me', authMiddleware, usersController.getMyInfo);

export default router;
