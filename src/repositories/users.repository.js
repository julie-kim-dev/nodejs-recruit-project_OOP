import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  // 회원가입
  findUserById = async (email) => {
    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    return isExistUser;
  };

  // Users 테이블에 사용자 추가
  createUser = async (data) => {
    await prisma.users.create({
      data,
    });
  };

  // 로그인
  selectOneUserByEmailAndPassword = async (email, password) => {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    return user;
  };
}
