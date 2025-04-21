import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { checkDatabaseConnection } from '../config/database.js';
import { limiter } from './middleware/rateLimiter.js';
import goldRoutes from './routes/gold.js';
import healthRoute from './routes/health.js'

const PORT = process.env.SERVER_PORT || 3000;

// Cấu hình __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Khởi tạo app
const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware & Routes
app.use(bodyParser.json());
app.use(limiter);
app.use('/gold', goldRoutes);
app.use('/health', healthRoute);

// DB
checkDatabaseConnection();

// Start
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
