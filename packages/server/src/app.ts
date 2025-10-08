// packages/server/src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// Sẽ tạo sau
import apiRoutes from './routes';

const app: Application = express();

// Middlewares
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Server is healthy!');
});

// API Routes - Sẽ thêm vào sau
app.use('/api/v1', apiRoutes);

export default app;