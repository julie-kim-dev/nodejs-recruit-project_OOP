import { UsersService } from '../services/users.service.js';

export class UsersController {
  usersService = new UsersService();

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const {
        email,
        password,
        passwordConfirm,
        name,
        age,
        gender,
        profileImage,
      } = req.body;

      if (!email) {
        return res.status(400).json({ message: '이메일을 입력해주세요.' });
      }
      if (!password) {
        return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
      }
      if (!passwordConfirm) {
        return res
          .status(400)
          .json({ message: '비밀번호 확인을 입력해주세요.' });
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
        return res
          .status(400)
          .json({ message: '비밀번호가 일치하지 않습니다.' });
      }

      await this.usersService.signUp({
        email,
        password,
        name,
        age,
        gender,
        profileImage,
      });

      return res
        .status(201)
        .json({ message: '회원가입이 완료되었습니다.', email, name });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 로그인
  signIn = async () => {
    try {
      const { email, password } = req.body;

      const token = await this.usersService.signIn(email, password);

      return res.status(200).json({ message: '로그인 성공', token });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  // 사용자 정보 조회
  getMyInfo = (req, res, next) => {
    const user = res.locals.user;

    return res.status(200).json({ email: user.email, name: user.name });
  };
}
