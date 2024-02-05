import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

const jwtValidate = async (req, res, next) => {
  try {
    // 헤더에서 accessToken 가져오기
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    // Bearer {jwt} 사이 공백!!! 기준으로 쪼개기
    const [tokenType, tokenValue] = authorization.split(' ');
    // const tokenType = token[0];
    // const tokenValue = token[1];
    if (tokenType !== 'Bearer') {
      throw new Error('토큰 타입이 일치하지 않습니다.');
    }
    if (!tokenValue) {
      throw new Error('토큰 값이 일치하지 않습니다.');
    }

    // 12시간 유효기간 확인
    const decodedToken = jwt.verify(tokenValue, 'custom-secret-key');

    // accessToken 안에 userId 들어있는지 확인
    if (!decodedToken.userId) {
      throw new Error('인증 정보가 올바르지 않습니다.');
    }

    const user = await prisma.users.findFirst({
      where: {
        userId: decodedToken.userId,
      },
    });

    // const user = await prisma.users.findFirst({
    //       where: { userId: +userId },
    //     });

    if (!user) {
      throw new Error('인증 정보가 올바르지 않습니다.');
    }

    // user 정보 담기
    res.locals.user = user;

    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export default jwtValidate;

// export default async function (req, res, next) {
//   try {
//     const { authorization } = req.cookies;
//     if (!authorization) throw new Error('토큰이 존재하지 않습니다.');

//     const [tokenType, token] = authorization.split(' ');

//     if (tokenType !== 'Bearer')
//       throw new Error('토큰 타입이 일치하지 않습니다.');

//     const decodedToken = jwt.verify(token, 'custom-secret-key');
//     const userId = decodedToken.userId;

//     const user = await prisma.users.findFirst({
//       where: { userId: +userId },
//     });

//     if (!user) {
//       res.clearCookie('authorization');
//       throw new Error('토큰 사용자가 존재하지 않습니다.');
//     }

//     req.user = user;
//     // req.locals.user = user;

//     next();
//   } catch (err) {
//     res.clearCookie('authorization');

//     switch (err.name) {
//       case 'TokenExpiredError':
//         return res.status(401).json({ message: '토큰이 만료되었습니다.' });
//       case 'JsonWebTokenError':
//         return res.status(401).json({ message: '토큰이 조작되었습니다.' });
//       default:
//         return res
//           .status(401)
//           .json({ message: err.message ?? '비정상적인 요청입니다.' });
//     }
//   }
// }
