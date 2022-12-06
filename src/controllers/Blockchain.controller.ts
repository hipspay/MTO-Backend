import { Response, NextFunction } from 'express';
import { Blockchains } from '../entities/Blockchain';

import BlockchainService from '../services/BlockchainService';
import { IRequest } from '../shared/types/base.types';

export class BlockchainsController {
    private BlockchainService: BlockchainService;

    constructor() {
        this.BlockchainService = new BlockchainService();
    }   

    public update = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id, ...updateData } = req.body;
            const blockchain = await this.BlockchainService.updateBlockchain(
                id,
                updateData
            );

            if (blockchain) {
                res.json(blockchain);
            } else {
                res.status(404).json({
                    message: 'Cannot find the data to update',
                });
            }
        } catch (error) {
            next(error);
        }
    };
    public getBlockchains = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await this.BlockchainService.getBlockchain(
                req.query
            );
            if (result) {
                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    };
    public create = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const blockchain = await this.BlockchainService.createBlockchain({
                ...req.body,
            });

            res.json(blockchain);
        } catch (err) {
            next(err);
        }
    };
}

export const blockchainController = new BlockchainsController();
