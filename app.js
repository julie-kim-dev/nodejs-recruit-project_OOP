import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routers/users.router.js';
import DocumentsRouter from './routers/documents.router.js';
// import AuthRouter from './routers/auth.router.js';

const app = express();
const PORT = 3020;

app.use(express.json());
app.use(cookieParser());

app.use('/api', [UsersRouter, DocumentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
