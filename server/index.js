import cors from 'cors';
import express from 'express';
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

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} 🚀`);
});
