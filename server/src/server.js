import app from './app.js';
import connectDB from './database/connectToDB.js';

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} 🚀`);
});
