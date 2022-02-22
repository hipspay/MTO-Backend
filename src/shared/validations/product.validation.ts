import * as Joi from 'joi';

const actById = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
        shopAddress: Joi.string().required(),
    }),
};

const update = {
    body: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        image: Joi.string(),
        price: Joi.number(),
        shopAddress: Joi.string(),
    }),
};

const list = {
    query: Joi.object().keys({
        name: Joi.string(),
        fromPrice: Joi.number().min(0),
        toPrice: Joi.number().min(0),
        shopAddress: Joi.string(),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string().valid(
            'id',
            'name',
            'description',
            'price',
            'shopAddress'
        ),
        order: Joi.string().valid('DESC', 'ASC'),
    }),
};

export { actById, create, update, list };
