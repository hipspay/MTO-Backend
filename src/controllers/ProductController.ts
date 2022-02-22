import { Request, Response, NextFunction } from 'express';

import MerchantService from '../services/MerchantService';
import ProductService from '../services/ProductService';
import { IRequest } from '../shared/types/base.types';
import { IProductFilterQuery } from '../shared/types/product.types';

export class ProductController {
    private productService: ProductService;
    private merchantService: MerchantService;

    constructor() {
        this.productService = new ProductService();
        this.merchantService = new MerchantService();
    }

    public list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.productService.getProducts(
                req.query as IProductFilterQuery
            );

            if (result?.totalCount > 0) {
                return res.json(result);
            } else {
                return res.status(404).json({
                    message: 'No data found',
                });
            }
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
            const merchant = await this.merchantService.getMerchantByAddress(
                req.address
            );
            const result = await this.productService.getProductsByMerchant(
                merchant.id,
                req.query as IProductFilterQuery
            );

            if (result?.totalCount > 0) {
                return res.json(result);
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
            const product = await this.productService.getProductById(+id);

            if (product) {
                res.json(product);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
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
            const product = await this.productService.getProductByMerchantById(
                merchant.id,
                +id
            );

            if (product) {
                res.json(product);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
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
            const merchant = await this.merchantService.getMerchantByAddress(req.address);
            const product = await this.productService.createProduct({
                merchant: merchant,
                ...req.body,
            });

            res.json(product);
        } catch (err) {
            next(err);
        }
    };

    public update = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const merchant = await this.merchantService.getMerchantByAddress(
                req.address
            );
            req.body.merchant = merchant.id;
            const product = await this.productService.updateProduct(
                +id,
                req.body
            );

            if (product) {
                res.json(product);
            } else {
                res.status(404).json({
                    message: 'Cannot find the data to update',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public remove = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const merchant = await this.merchantService.getMerchantByAddress(
                req.address
            );

            const result = await this.productService.removeProduct(
                merchant.id,
                +id
            );

            if (result.affected === 0) {
                res.status(400).json({
                    message: 'Cannot find the data to delete',
                });
            } else {
                res.status(200).json({
                    message: 'Product removed successfully',
                });
            }
        } catch (err) {
            next(err);
        }
    };
}

export const productController = new ProductController();
