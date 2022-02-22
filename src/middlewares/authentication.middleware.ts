import { Response, NextFunction } from 'express';

import { IRequest } from '../shared/types/base.types';
import { verify } from '../utils/jwt';
import httpStatus from 'http-status';

export const authenticate =
    (role: 'customer' | 'merchant' | 'agent' | 'admin') =>
    async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            let { authorization } = req.headers as any;
            if (!authorization) {
                return res
                    .status(httpStatus.NETWORK_AUTHENTICATION_REQUIRED)
                    .send({
                        message: 'please provide authentication token',
                    });
            }
            authorization = authorization.split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({ message: 'Invalid JWT' });
            }
            req.headers.authorization = authorization[1];

            return verify(req, res, next, role);
        } catch (e) {
            next(e);
        }
    };
