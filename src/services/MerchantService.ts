import { Service } from 'typedi';
import { getRepository, ILike } from 'typeorm';

import { Merchants } from '../entities/Merchant';
import { Products } from '../entities/Products';

import {
    ICreateMerchant,
    IMerchantFilterQuery,
} from '../shared/types/merchant.types';

@Service()
export default class MerchantService {
    public async createMerchant(
        createMerchantData: ICreateMerchant
    ): Promise<Merchants> {
        const merchantRepository = getRepository(Merchants);

        const existSameWallet = await merchantRepository.find({
            where: { walletAddress: createMerchantData.walletAddress },
        });

        if (existSameWallet?.length > 0) {
            return Promise.reject('MERCHANT_WALLET_ALREADY_EXIST');
        }
        return await merchantRepository.save(createMerchantData);
    }

    public async getMerchants(
        query: IMerchantFilterQuery
    ): Promise<Merchants[]> {
        const {
            name,
            walletAddress,
            shippingAddress,
            externalLink,
            page,
            limit,
            sortBy,
            order,
        } = query;

        let filter;

        filter = Object.entries({
            name,
            walletAddress,
            shippingAddress,
            externalLink,
        }).reduce((obj, value) => {
            if (value[1]) {
                return {
                    ...obj,
                    [value[0]]: ILike(`%${value[1]}%`),
                };
            }
            return obj;
        }, {});

        return await getRepository(Merchants).find({
            where: filter,
            order: {
                [sortBy ? sortBy : 'id']: order ? order : 'ASC',
            },
            skip: (+page - 1) * +limit,
            take: +limit,
        });
    }

    public async getMerchantByAddress(address: string): Promise<Merchants> {
        return await getRepository(Merchants).findOne({
            where: { walletAddress: address },
        });
    }
    public async getMerchantByAddressAndApp(address: string, appKey): Promise<Merchants> {
        return await getRepository(Merchants).findOne({
            where: { 
                walletAddress: address,
                appKey: appKey
            },
        });
    }

    public async getMerchantById(id: number): Promise<Merchants> {
        return await getRepository(Merchants).findOne(id);
    }

    public async updateMerchant(
        address: string,
        updateMerchantData: Merchants
    ): Promise<Merchants> {
        const merchantRepository = getRepository(Merchants);

        const merchant = await merchantRepository.findOne({
            where: { walletAddress: address },
        });

        if (!merchant) {
            return null;
        }

        const { name, shippingAddress, externalLink, image} = updateMerchantData;

        if (name) {
            merchant.name = name;
        }

        if (shippingAddress) {
            merchant.shippingAddress = shippingAddress;
        }

        if (externalLink) {
            merchant.externalLink = externalLink;
        }

        if (image) {
            merchant.image = image;
        }



        return await merchantRepository.save(merchant);
    }

    public async getProducts(merchantId: number): Promise<Products[]> {
        const productRepository = getRepository(Products);
        const products = await productRepository.find({
            where: {
                merchant: { id: merchantId },
            },
            relations: ['merchant'],
        });
        return products;
    }

    public async countMerchants(): Promise<Number> {
        return getRepository(Merchants).count();
    }
}
