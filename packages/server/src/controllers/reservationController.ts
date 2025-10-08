import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getReservations = async (_req: Request, res: Response) => {
    const list = await prisma.reservation.findMany();
    res.json(list);
};

export const createReservation = async (req: Request, res: Response) => {
    const data = req.body;
    const created = await prisma.reservation.create({ data });
    res.status(201).json(created);
};
