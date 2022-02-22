import { Service } from 'typedi';
import { getRepository, Raw } from 'typeorm';

import { Products } from '../entities/Products';
import { Orders } from '../entities/Orders';
import { Customers } from '../entities/Customers';
import { OrderStatus } from '../shared/constants/global.constants';
import { IProductFilterQuery } from '../shared/types/product.types';
import { IOrderFilterQuery } from '../shared/types/order.types';

@Service()
export default class OrderService {
    private getFilters(query: IOrderFilterQuery) {
        const {
            fromDeliveryTime,
            toDeliveryTime,
            fromEscrowTime,
            toEscrowTime,
        } = query;

        let filter = {};

        if (fromDeliveryTime) {
            filter = {
                ...filter,
                deliveryTime: Raw(
                    (alias) => `${alias} > '${fromDeliveryTime}'`
                ),
            };
        }

        if (toDeliveryTime) {
            if (fromDeliveryTime) {
                filter = {
                    ...filter,
                    deliveryTime: Raw(
                        (alias) =>
                            `${alias} > '${fromDeliveryTime}' AND ${alias} < '${toDeliveryTime}'`
                    ),
                };
            } else {
                filter = {
                    ...filter,
                    deliveryTime: Raw(
                        (alias) => `${alias} < '${toDeliveryTime}'`
                    ),
                };
            }
        }

        if (fromEscrowTime) {
            filter = {
                ...filter,
                escrowTime: Raw((alias) => `${alias} > '${fromEscrowTime}'`),
            };
        }

        if (toEscrowTime) {
            if (fromEscrowTime) {
                filter = {
                    ...filter,
                    escrowTime: Raw(
                        (alias) =>
                            `${alias} > '${fromEscrowTime}' AND ${alias} < '${toEscrowTime}'`
                    ),
                };
            } else {
                filter = {
                    ...filter,
                    deliveryTime: Raw(
                        (alias) => `${alias} < '${toEscrowTime}'`
                    ),
                };
            }
        }

        return filter;
    }

    public async getOrders(query: IOrderFilterQuery): Promise<Orders[]> {
        const orderRepository = getRepository(Orders);

        const { page, limit, sortBy, order, status } = query;

        let filter = this.getFilters(query);

        if (status) {
            filter = { ...filter, status };
        }

        return await orderRepository.find({
            where: filter,
            order: {
                [sortBy ? sortBy : 'id']: order ? order : 'ASC',
            },
            skip: (+page - 1) * +limit,
            take: +limit,
            relations: ['product'],
        });
    }

    public async getOrdersByAddress(
        walletAddress: string,
        query: IOrderFilterQuery
    ): Promise<{ totalCount: number; orders: Orders[] }> {
        const customerRepository = getRepository(Customers);
        const orderRepository = getRepository(Orders);

        const customer = await customerRepository.findOne({
            where: { walletAddress },
        });

        if (!customer) {
            return null;
        }

        const { page, limit, sortBy, order } = query;

        const filter = { customer: customer.id, ...this.getFilters(query) };

        const totalCount = await orderRepository.count({
            where: [
                { ...filter, status: OrderStatus.IN_DELIVERY },
                { ...filter, status: OrderStatus.OVER_DELIVERY },
                { ...filter, status: OrderStatus.IN_DISPUTE },
            ],
        });

        const orders = await orderRepository.find({
            where: [
                { ...filter, status: OrderStatus.IN_DELIVERY },
                { ...filter, status: OrderStatus.OVER_DELIVERY },
                { ...filter, status: OrderStatus.IN_DISPUTE },
            ],
            relations: ['product'],
            order: {
                [sortBy ? sortBy : 'id']: order ? order : 'ASC',
            },
            skip: (+page - 1) * +limit,
            take: +limit,
        });

        return { totalCount, orders };
    }
    public async getOrdersByCompletedAddress(
        walletAddress: string,
        query: IOrderFilterQuery
    ): Promise<{ totalCount: number; orders: Orders[] }> {
        const customerRepository = getRepository(Customers);
        const orderRepository = getRepository(Orders);

        const customer = await customerRepository.findOne({
            where: { walletAddress },
        });

        if (!customer) {
            return null;
        }

        const { page, limit, sortBy, order } = query;

        const filter = { customer: customer.id, ...this.getFilters(query) };

        const totalCount = await orderRepository.count({
            where: [{ ...filter, status: OrderStatus.COMPLETED }],
        });

        const orders = await orderRepository.find({
            where: [{ ...filter, status: OrderStatus.COMPLETED }],
            relations: ['product'],
            order: {
                [sortBy ? sortBy : 'id']: order ? order : 'ASC',
            },
            skip: (+page - 1) * +limit,
            take: +limit,
        });

        return { totalCount, orders };
    }
    public async getOrdersByMerchant(
        merchantId: number,
        query: IOrderFilterQuery
    ): Promise<{ totalCount: number; orders: Orders[] }> {
        const {
            page,
            limit,
            fromDeliveryTime,
            toDeliveryTime,
            fromEscrowTime,
            toEscrowTime,
            sortBy,
            order,
        } = query;

        const total = await getRepository(Orders).manager.query(`
      SELECT orders.* FROM orders
      LEFT JOIN products ON products.id = orders."productId"
      WHERE
        products."merchantId" = ${merchantId}
        ${
            fromDeliveryTime
                ? `AND orders."deliveryTime" >= '${fromDeliveryTime}'`
                : ''
        }
        ${
            toDeliveryTime
                ? `AND orders."deliveryTime" <= '${toDeliveryTime}'`
                : ''
        }
        ${
            fromEscrowTime
                ? `AND orders."deliveryTime" >= '${fromEscrowTime}'`
                : ''
        }
        ${toEscrowTime ? `AND orders."deliveryTime" <= '${toEscrowTime}'` : ''}
      `);

        const orders = await getRepository(Orders).manager.query(`
      SELECT
        orders.*,
        products.image as productImage,
        products.name as productName,
        products.price as productPrice
      FROM orders
      LEFT JOIN products ON products.id = orders."productId"
      WHERE
        products."merchantId" = ${merchantId}
        ${
            fromDeliveryTime
                ? `AND orders."deliveryTime" >= '${fromDeliveryTime}'`
                : ''
        }
        ${
            toDeliveryTime
                ? `AND orders."deliveryTime" <= '${toDeliveryTime}'`
                : ''
        }
        ${
            fromEscrowTime
                ? `AND orders."deliveryTime" >= '${fromEscrowTime}'`
                : ''
        }
        ${toEscrowTime ? `AND orders."deliveryTime" <= '${toEscrowTime}'` : ''}
      ORDER BY orders."${sortBy ? sortBy : 'id'}" ${order ? order : 'ASC'}
      ${limit ? `LIMIT ${limit}` : ''}
      ${page ? `OFFSET ${(+page - 1) * +limit}` : ''}
    `);

        return { totalCount: total.length, orders };
    }

    public async getOrderByMerchantById(
        merchantId: number,
        id: number
    ): Promise<Orders> {
        const order = await getRepository(Orders).findOne(id, {
            relations: ['product', 'product.merchant'],
        });

        if (order.product.merchant.id === merchantId) {
            return order;
        }

        return null;
    }

    public async getOrderById(id: number): Promise<Orders> {
        return await getRepository(Orders).findOne({
            where: { id },
            relations: ['product', 'product.merchant', 'customer'],
        });
    }

    public async getOrderByAddressById(
        walletAddress: string,
        id: number
    ): Promise<Orders> {
        const customerRepository = getRepository(Customers);
        const orderRepository = getRepository(Orders);

        const customer = await customerRepository.findOne({
            where: { walletAddress },
        });

        if (!customer) {
            return null;
        }

        return await orderRepository.findOne({
            where: [
                { id, customer: customer.id, status: OrderStatus.IN_DELIVERY },
                {
                    id,
                    customer: customer.id,
                    status: OrderStatus.OVER_DELIVERY,
                },
                {
                    id,
                    customer: customer.id,
                    status: OrderStatus.IN_DISPUTE,
                },
            ],
            relations: ['product', 'product.merchant'],
        });
    }

    public async getMyProducts(
        walletAddress: string,
        query: IProductFilterQuery
    ): Promise<{ totalCount: number; products: Products[] }> {
        const customerRepository = getRepository(Customers);
        const orderRepository = getRepository(Orders);

        const customer = await customerRepository.findOne({
            where: { walletAddress },
        });

        if (!customer) {
            return null;
        }

        const {
            page,
            limit,
            fromPrice,
            toPrice,
            shopAddress,
            name,
            sortBy,
            order,
        } = query;

        const count = await orderRepository.manager.query(`
        SELECT products.* FROM "orders"
        LEFT JOIN products on orders."productId" = products.id
        WHERE
          orders."customerId" = ${customer.id}
          AND orders."status" = 'completed'
          AND products."name" ILIKE '%${name ? name : ''}%'
          AND products."shopAddress" ILIKE '%${shopAddress ? shopAddress : ''}%'
          AND products."price" >= ${fromPrice ? fromPrice : '0'}
          ${toPrice ? `AND products."price" <= ${toPrice}` : ''}
        ORDER BY products."${sortBy ? sortBy : 'id'}" ${order ? order : 'ASC'}
      `);
        const totalCount = count.length;
        const products = await orderRepository.manager.query(`
      SELECT products.* FROM "orders"
      LEFT JOIN products on orders."productId" = products.id
      WHERE
        orders."customerId" = ${customer.id}
        AND orders."status" = 'completed'
        AND products."name" ILIKE '%${name ? name : ''}%'
        AND products."shopAddress" ILIKE '%${shopAddress ? shopAddress : ''}%'
        AND products."price" >= ${fromPrice ? fromPrice : '0'}
        ${toPrice ? `AND products."price" <= ${toPrice}` : ''}
      ORDER BY products."${sortBy ? sortBy : 'id'}" ${order ? order : 'ASC'}
      ${limit ? `LIMIT ${limit}` : ''}
      ${page ? `OFFSET ${(+page - 1) * +limit}` : ''}
    `);
        return { totalCount, products };
    }

    public async getMyProductById(
        walletAddress: string,
        id: number
    ): Promise<Products> {
        const customerRepository = getRepository(Customers);
        const orderRepository = getRepository(Orders);

        const customer = await customerRepository.findOne({
            where: { walletAddress },
        });

        const order = await orderRepository.findOne({
            where: { id, customer: customer.id, status: OrderStatus.COMPLETED },
            relations: ['product'],
        });

        return order?.product;
    }

    public async getMyProductByEscrowId(escrowId: number): Promise<Orders> {
        const orderRepository = getRepository(Orders);

        const order = await orderRepository.findOne({
            where: { escrowId },
            relations: ['product'],
        });

        return order;
    }

    public async countOrders(): Promise<number> {
        return getRepository(Orders).count();
    }
}
