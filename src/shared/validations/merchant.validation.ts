import * as Joi from 'joi';

const actById = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};

const getMerchantProducts = {
    params: Joi.object().keys({
        merchantId: Joi.number().required(),
    }),
};

const list = {
    query: Joi.object().keys({
        name: Joi.string(),
        shopAddress: Joi.string(),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string().valid(
            'id',
            'name',
            'walletAddress',
            'shippingAddress',
            'externalLink'
        ),
        order: Joi.string().valid('DESC', 'ASC'),
    }),
};

const update = {
    body: Joi.object().keys({
        name: Joi.string(),
        shippingAddress: Joi.string(),
        externalLink: Joi.string(),
    }),
};

export { list, update, actById, getMerchantProducts };
