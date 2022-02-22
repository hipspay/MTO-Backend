import { Response, NextFunction } from 'express';

import { IRequest } from '../shared/types/base.types';

export const uploadImage = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Todo: returns the link of image
        req.body.image = 'https://testuser311.s3-us-west-1.amazonaws.com/7.png';
        return next();
    } catch (e) {
        next(e);
    }
};
