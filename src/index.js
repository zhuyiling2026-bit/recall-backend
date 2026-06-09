import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contentRouter from './routes/content.js';
import categoriesRouter from './routes/categories.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/content', authMiddleware, contentRouter);
app.use('/categories', authMiddleware, categoriesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
