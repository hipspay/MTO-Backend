import { Router } from 'express';

import { authController } from '../controllers/AuthController';
import * as authenticationValidation from '../shared/validations/Authentication.validation';
import { validate } from '../middlewares/validation.middleware';

const AuthRoute = Router();

AuthRoute.post(
    '/merchant',
    validate(authenticationValidation.authenticate),
    authController.authenticateMerchant
);

AuthRoute.post(
    '/customer',
    validate(authenticationValidation.authenticate),
    authController.authenticateCustomer
);

AuthRoute.post(
    '/agent',
    validate(authenticationValidation.authenticate),
    authController.authenticateAgent
);

AuthRoute.post(
    '/admin',
    validate(authenticationValidation.authenticate),
    authController.authenticateAdmin
);

export default AuthRoute;
