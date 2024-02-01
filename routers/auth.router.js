// import express from 'express';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
// const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

// const tokenStorages = {}; // 리프레시 토큰을 관리할 객체. db 대용

// // Access, Refresh 토큰 발급 api
// router.post('/tokens', async (req, res) => {
//   // id 전달
//   const { id } = req.body;

//   // 엑세스 토큰과 리프레시 토큰을 발급
//   const accessToken = createAccessToken(id);
//   const refreshToken = jwt.sign({ id: id }, REFRESH_TOKEN_SECRET_KEY, {
//     expiresIn: '12h',
//   });

//   tokenStorages[refreshToken] = {
//     id: id,
//     ip: req.ip,
//     userAgent: req.headers['user-agent'],
//   };

//   console.log(tokenStorages);

//   // 클라이언트에게 쿠키(토큰) 할당
//   res.cookie('accessToken', accessToken);
//   res.cookie('refreshToken', refreshToken);

//   return res
//     .status(200)
//     .json({ message: 'Token이 정상적으로 발급되었습니다.' });
// });

// // access token 검증 api
// router.get('/tokens/validate', async (req, res) => {
//   const { accessToken } = req.cookies;

//   // 엑세스 토큰이 존재하는지 확인
//   if (!accessToken) {
//     return res
//       .status(400)
//       .json({ message: 'Access Token이 존재하지 않습니다.' });
//   }

//   const payload = validateToken(accessToken, ACCESS_TOKEN_SECRET_KEY);
//   if (!payload) {
//     return res
//       .status(401)
//       .json({ errorMessage: 'Access Token이 정상적이지 않습니다.' });
//   }

//   const { id } = payload;
//   return res.status(200).json({
//     message: `${id}의 Payload를 가진 Token이 정상적으로 인증되었습니다.`,
//   });
// });

// // Token을 검증하고 payload를 조회하기 위한 함수
// function validateToken(token, secretKey) {
//   try {
//     return jwt.verify(token, secretKey);
//   } catch (err) {
//     return null;
//   }
// }

// function createAccessToken(id) {
//   return jwt.sign({ id: id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10s' });
// }

// // 리프레시 토큰을 이용해서 액세스 토큰을 재발급하는 api
// router.post('/tokens/refresh', async (req, res) => {
//   const { refreshToken } = req.cookies;

//   if (!refreshToken) {
//     return res
//       .status(400)
//       .json({ message: 'Refresh Token이 존재하지 않습니다.' });
//   }

//   const payload = validateToken(refreshToken, REFRESH_TOKEN_SECRET_KEY);
//   if (!payload) {
//     return res
//       .status(401)
//       .json({ errorMessage: 'Refresh Token이 정상적이지 않습니다.' });
//   }

//   const userInfo = tokenStorages[refreshToken];
//   if (!userInfo) {
//     return res.status(419).json({
//       errorMessage: 'Refresh Token의 정보가 서버에 존재하지 않습니다.',
//     });
//   }

//   const newAccessToken = createAccessToken(userInfo.id);

//   res.cookie('accessToken', newAccessToken);
//   return res
//     .status(200)
//     .json({ message: 'Access Token을 정상적으로 새롭게 발급했습니다.' });
// });

// export default router;
