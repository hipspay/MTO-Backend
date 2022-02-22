import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IRequest } from '../shared/types/base.types';
import { Payload } from '../shared/types/auth.types';
import httpStatus from 'http-status';

interface IJwtData {
    id: number;
    role: 'customer' | 'merchant' | 'agent' | 'admin';
    address: string;
}

export const sign = (data: IJwtData) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const verify = (
    req: IRequest,
    res: Response,
    next: NextFunction,
    role: 'customer' | 'merchant' | 'agent' | 'admin'
) => {
    try {
        let { authorization } = req.headers as any;

        const payload = jwt.verify(
            authorization,
            process.env.JWT_SECRET
        ) as Payload;
        if (payload.role !== role) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .send({ message: 'invalid JWT' });
        }

        req.address = payload.address;
        req.id = payload.id;
        req.role = payload.role;

        return next();
    } catch (e) {
        next(e);
    }
};
