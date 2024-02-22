import { UsersRepository } from '../repositories/users.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UsersService {
  usersRepository = new UsersRepository();

  // 회원가입
  signUp = async (data) => {
    const { email, password, name, age, gender, profileImage } = data;
    // passwordConfirm은 컨트롤러에서 처리하고 넘어옴

    // const user = await this.usersRepository.selectOneUserByEmail(email);

    if (isExistUser) {
      throw {
        code: 409,
        message: '이미 존재하는 이메일입니다.',
      };
    }

    await usersRepository.createUser({ email, password: hashedPassword, name });

    const hashedPassword = await bcrypt.hash(password, 10);
  };

  // 로그인
  signIn = async () => {
    if (!email) {
      throw {
        code: 400,
        message: '이메일을 입력해주세요.',
      };
    }
    if (!password) {
      throw {
        code: 400,
        message: '비밀번호를 입력해주세요.',
      };
    }

    const user = await this.usersRepository.selectOneUserByEmailAndPassword({
      email,
      password,
    });

    if (!user) {
      throw {
        code: 401,
        message: '존재하지 않는 이메일입니다.',
      };
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw {
        code: 401,
        message: '비밀번호가 일치하지 않습니다.',
      };
    }

    const accessToken = jwt.sign({ userId: user.userId }, 'custom-secret-key', {
      expiresIn: '12h',
    });
    return { accessToken };
  };
}
