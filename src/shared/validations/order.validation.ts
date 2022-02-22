import * as Joi from 'joi';

const actById = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};

const list = {
    query: Joi.object().keys({
        fromDeliveryTime: Joi.string(),
        toDeliveryTime: Joi.string(),
        fromEscrowTime: Joi.string(),
        toEscrowTime: Joi.string(),
        status: Joi.string().valid('in_delivery', 'over_delivery', 'completed'),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string().valid(
            'id',
            'deliveryTime',
            'escrowTime',
            'status'
        ),
        order: Joi.string().valid('DESC', 'ASC'),
    }),
};

const getByEscrowId = {
    params: Joi.object().keys({
        escrowId: Joi.string().required(),
    }),
};
export { actById, list, getByEscrowId };
