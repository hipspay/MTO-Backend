import * as Joi from 'joi';

const authenticate = {
    headers: Joi.object({
        signature: Joi.string().required(),
    }).options({ allowUnknown: true }),
};

export { authenticate };
