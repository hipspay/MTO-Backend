import * as Joi from 'joi';

const getByAddress = {
    query: Joi.object().keys({
        address: Joi.string().required(),
    }),
};

const update = {
    body: Joi.object().keys({
        address: Joi.string(),
        name: Joi.string(),
        shippingAddress: Joi.string(),
        externalLink: Joi.string(),
    }),
};

export { update, getByAddress };
