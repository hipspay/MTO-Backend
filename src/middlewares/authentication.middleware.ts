import { Response, NextFunction } from 'express';

import { IRequest } from '../shared/types/base.types';
import { verify } from '../utils/jwt';
import httpStatus from 'http-status';
import { authController } from '../controllers/AuthController';
import Web3 from 'web3';
const web3 = new Web3();
import { Role } from '../shared/types/auth.types';
/*
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
            req.headers.authorization = authorization[1]
            return verify(req, res, next, role);
        } catch (e) {
            next(e);
        }
    };
*/
export const authenticate = (role: Role) => async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        try {
            return await authController.authenticateUser(req, res, next, role);
        } catch (e) {
            next(e);
        }
    } catch (e) {
        next(e);
    }
};

export const customAuthenticate = (role: 'merchant') => async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const result = await authController.authenticateMerchant(req, res, next);
        if(result){
            return next();
        }else{
            return res.status(httpStatus.UNAUTHORIZED).send({ message: 'unauthorized connection' });
        }
    } catch (e) {
        next(e);
    }
};
