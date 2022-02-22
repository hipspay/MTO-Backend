import * as Joi from 'joi';

const actById = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};

const list = {
    query: Joi.object().keys({
        fromApprovedCount: Joi.number(),
        toApprovedCount: Joi.number(),
        fromDisapprovedCount: Joi.number(),
        toDisapprovedCount: Joi.number(),
        fromReviewCount: Joi.number(),
        toReviewCount: Joi.number(),
        fromCriteriaCount: Joi.number(),
        toCriteriaCount: Joi.number(),
        status: Joi.string().valid('init', 'waiting', 'review', 'fail', 'win'),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string().valid(
            'id',
            'approvedCount',
            'disapprovedCount',
            'reviewCount',
            'criteriaCount',
            'status'
        ),
        order: Joi.string().valid('DESC', 'ASC'),
    }),
};

export { actById, list };
