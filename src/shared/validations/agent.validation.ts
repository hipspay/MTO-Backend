import * as Joi from 'joi';

const list = {
    query: Joi.object().keys({
        walletAddress: Joi.string(),
        status: Joi.string().valid(
            'init',
            'waiting',
            'review',
            'pending_approved',
            'pending_disapproved',
            'earned',
            'lost',
            'ban'
        ),
        fromScore: Joi.string(),
        toScore: Joi.string(),
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

export { list };
