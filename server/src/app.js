import cors from 'cors';
import express from 'express';
import router from './routes/router.js';
import 'dotenv/config';
import { errorHandler } from './middlewares/errorHandler.js';

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: 'GET, POST, PUT, PATCH, DELETE',
  preflightContinue: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(router);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

setInterval(async () => {
  try {
    const res = await fetch(process.env.SELF_URL + '/api/ping');
    console.log(`Self-ping status: ${res.status}`);
  } catch (err) {
    console.error('Self-ping failed:', err);
  }
}, 14 * 60 * 1000);

export default app;
