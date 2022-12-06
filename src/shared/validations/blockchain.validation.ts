import * as Joi from 'joi';

const create = {
    body: Joi.object().keys({
        blockchainType: Joi.string().required(),
        gatewayAddress: Joi.string().required(),
        merchant: Joi.object().optional(),
        utilityToken: Joi.number().required(),
        url: Joi.string().optional(),
        chainId: Joi.number().optional(),
        gatewayABI: Joi.string().required(),
        utilityTokenABI: Joi.string().required(),
    }),
};

const update = {
    body: Joi.object().keys({
        id: Joi.number().required(),
        blockchainType: Joi.string().optional(),
        merchant: Joi.object().optional(),
        gatewayAddress: Joi.string().optional(),
        utilityToken: Joi.number().optional(),
        url: Joi.string().optional(),
        chainId: Joi.number().optional(),
        gatewayABI: Joi.string().optional(),
        utilityTokenABI: Joi.string().optional(),
    }),
};

const selectAllorFiltred = {
    query: Joi.object().keys({
        merchant: Joi.object().optional(),
        blockchainType: Joi.string().optional(),
        gatewayAddress: Joi.string().optional(),
        utilityToken: Joi.number().optional(),
        gatewayABI: Joi.string().optional(),
        utilityTokenABI: Joi.string().optional(),
    }),
};

export { create, update, selectAllorFiltred };
