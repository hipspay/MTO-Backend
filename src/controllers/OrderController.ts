import { Response, NextFunction } from 'express';

import OrderService from '../services/OrderService';
import { IProductFilterQuery } from '../shared/types/product.types';
import { IOrderFilterQuery } from '../shared/types/order.types';
import { IRequest } from '../shared/types/base.types';
import MerchantService from '../services/MerchantService';
import httpStatus from 'http-status';

export class OrderController {
    private orderService: OrderService;
    private merchantService: MerchantService;

    constructor() {
        this.orderService = new OrderService();
        this.merchantService = new MerchantService();
    }

    public list = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const orders = await this.orderService.getOrders(
                req.query as IOrderFilterQuery
            );

            if (orders?.length > 0) {
                res.json(orders);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
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
            const result = await this.orderService.getOrdersByAddress(
                req.address,
                req.query as IOrderFilterQuery
            );

            if (result.totalCount > 0) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public listByCompletedAddress = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await this.orderService.getOrdersByCompletedAddress(
                req.address,
                req.query as IOrderFilterQuery
            );

            if (result.totalCount > 0) {
                res.json(result);
            } else {
                res.status(404).json({
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
            console.log(req.headers.walletaddress);
            const merchant = await this.merchantService.getMerchantByAddress(
                req.headers.walletaddress as string
            );
            const result = await this.orderService.getOrdersByMerchant(
                merchant.id,
                req.query as IOrderFilterQuery
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

    public productList = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const products = await this.orderService.getMyProducts(
                req.address,
                req.query as IProductFilterQuery
            );

            if (products?.totalCount > 0) {
                res.json(products);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
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
            const order = await this.orderService.getOrderById(+id);

            if (order) {
                res.json(order);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
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
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrderByAddressById(
                req.address,
                +id
            );

            if (order) {
                res.json(order);
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
            const order = await this.orderService.getOrderByMerchantById(
                merchant.id,
                +id
            );

            if (order) {
                res.json(order);
            } else {
                res.status(404).json({
                    message: 'No data found',
                });
            }
        } catch (err) {
            next(err);
        }
    };

    public getProductById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const product = await this.orderService.getMyProductById(
                req.address,
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

    public getByEscrowId = async (req: IRequest, res: Response) => {
        try {
            const { escrowId } = req.params;
            const order = await this.orderService.getMyProductByEscrowId(
                parseInt(escrowId)
            );
            if (!order) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .send({ message: 'order not found' });
            }
            return res.send(order);
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: 'Something went wrong, please try again.' });
        }
    };
}

export const orderController = new OrderController();
