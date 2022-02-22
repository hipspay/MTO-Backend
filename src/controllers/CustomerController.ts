import { Response, NextFunction } from 'express';

import CustomerService from '../services/CustomerService';
import { IRequest } from '../shared/types/base.types';

export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    public getByAddress = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { address } = req.query;
            const customer = await this.customerService.getCustomerByAddress(
                address as string
            );

            if (customer) {
                res.json(customer);
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
            const { address, ...updateData } = req.body;
            console.log(address);
            const customer = await this.customerService.updateCustomer(
                address,
                updateData
            );

            if (customer) {
                res.json(customer);
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

export const customerController = new CustomerController();
