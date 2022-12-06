import { Response, NextFunction } from 'express';

import DisputeService from '../services/DisputeService';
import MerchantService from '../services/MerchantService';
import { IRequest } from '../shared/types/base.types';
import { IDisputeFilterQuery } from '../shared/types/dispute.types';

export class DisputeController {
    private disputeService: DisputeService;
    private merchantService: MerchantService;

    constructor() {
        this.disputeService = new DisputeService();
        this.merchantService = new MerchantService();
    }

    public list = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const disputes = await this.disputeService.getDisputes(
                req.query as IDisputeFilterQuery,
                ['order', 'order.product']
            );

            if (disputes?.length > 0) {
                res.json(disputes);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    };

    public listByAddress = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await this.disputeService.getDisputesByAddress(
                req.address,
                req.query as IDisputeFilterQuery
            );
            if (result?.totalCount > 0) {
                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    };

    public listAgentDisputes = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await this.disputeService.getAgentDisputes(
                req.query as IDisputeFilterQuery
            );
            // if (result?.totalCount > 0) {
                res.json(result);
            // } else {
            //     res.json([]);
            // }
        } catch (err) {
            next(err);
        }
    };

    public listByMerchant = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log(req.headers.walletaddress);
            const merchant = await this.merchantService.getMerchantByAddress(
                req.headers.walletaddress as string
            );
            const result = await this.disputeService.getDisputesByMerchant(
                merchant.id,
                req.query as IDisputeFilterQuery
            );

            if (result.totalCount > 0) {
                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    };

    public getById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const dispute = await this.disputeService.getDisputeById(+id, [
                'order',
                'order.product',
                'order.product.merchant',
            ]);

            if (dispute) {
                res.json(dispute);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public getByDisputeId = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const dispute = await this.disputeService.getDisputeByDisputeId(
                +id
            );

            if (dispute) {
                res.json(dispute);
            } else {
                res.json({});
            }
        } catch (err) {
            next(err);
        }
    };

    public getByAddressById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        console.log('333');
        try {
            const { id } = req.params;
            const dispute = await this.disputeService.getDisputeByAddressById(
                req.address,
                +id
            );
            if (dispute) {
                res.json(dispute);
            } else {
                res.json({});
            }
        } catch (err) {
            next(err);
        }
    };

    public getByMerchantById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const merchant = await this.merchantService.getMerchantByAddress(
                req.address
            );
            const dispute = await this.disputeService.getDisputeByMerchantById(
                merchant.id,
                +id
            );

            if (dispute) {
                res.json(dispute);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public updateDisputeById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;

            console.log(req.body);
            const { description } = req.body;
            const result =
                await this.disputeService.updateDisputeDescriptionById(
                    +id,
                    description
                );
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'Update error',
                });
            }
        } catch (err) {
            next(err);
        }
    };
}

export const disputeController = new DisputeController();
