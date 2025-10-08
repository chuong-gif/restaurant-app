import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import reservationRouter from './routes/reservations';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('Restaurant API'));
app.use('/api/reservations', reservationRouter);

export default app;
