import { Request, Response, NextFunction } from 'express';

import MerchantService from '../services/MerchantService';
import { IRequest } from '../shared/types/base.types';
import { IMerchantFilterQuery } from '../shared/types/merchant.types';

export class MerchantController {
    private merchantService: MerchantService;

    constructor() {
        this.merchantService = new MerchantService();
    }

    public list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const merchants = await this.merchantService.getMerchants(
                req.query as IMerchantFilterQuery
            );

            if (merchants?.length > 0) {
                return res.json(merchants);
            } else {
                return res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const merchant = await this.merchantService.getMerchantById(+id);

            if (merchant) {
                res.json(merchant);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public getProducts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { merchantId } = req.params;
            const merchant = await this.merchantService.getProducts(
                +merchantId
            );

            if (merchant) {
                res.json(merchant);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public getProfile = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { walletaddress } = req.headers;
            const merchant = await this.merchantService.getMerchantByAddress(
                walletaddress as string
            );

            if (merchant) {
                res.json(merchant);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const updateData = req.body;
            const { address } = req;
            const merchant = await this.merchantService.updateMerchant(
                address,
                updateData
            );

            if (merchant) {
                res.json(merchant);
            } else {
                res.status(404).json({
                    message: 'Cannot find the data to update',
                });
            }
        } catch (error) {
            next(error);
        }
    };
}

export const merchantController = new MerchantController();
