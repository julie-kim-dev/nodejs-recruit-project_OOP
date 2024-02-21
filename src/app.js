import express from 'express';
import UsersRouter from '../routers/users.router.js';
import ResumeRouter from '../routers/resume.router.js';

const app = express();
const PORT = 3021;

app.use(express.json());

app.use('/users', UsersRouter);
app.use('/resume', ResumeRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
