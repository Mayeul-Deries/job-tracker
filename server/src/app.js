import cors from 'cors';
import express from 'express';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const port = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:5173/',
  credentials: true,
  methods: 'GET, POST, PUT, DELETE',
  preflightContinue: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
