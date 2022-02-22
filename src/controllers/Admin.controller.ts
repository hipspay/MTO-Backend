import { Request, Response, NextFunction } from 'express';

import MerchantService from '../services/MerchantService';
import OrderService from '../services/OrderService';
import DisputeService from '../services/DisputeService';
import ProductService from '../services/ProductService';

export class AdminController {
    private merchantService: MerchantService;
    private orderService: OrderService;
    private disputeService: DisputeService;
    private productService: ProductService;
    constructor() {
        this.merchantService = new MerchantService();
        this.orderService = new OrderService();
        this.disputeService = new DisputeService();
        this.productService = new ProductService();
    }

    public stats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const merchants = await this.merchantService.countMerchants();
            const orders = await this.orderService.countOrders();
            const disputes = await this.disputeService.countDisputes();
            const products = await this.productService.countProducts();
            res.json({ merchants, orders, disputes, products });
        } catch (error) {
            next(error);
        }
    };
}

export const adminController = new AdminController();
