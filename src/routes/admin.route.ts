import { Router } from 'express';

import { merchantController } from '../controllers/MerchantController';
import { productController } from '../controllers/ProductController';
import { orderController } from '../controllers/OrderController';
import { disputeController } from '../controllers/DisputeController';
import { agentController } from '../controllers/AgentController';
import { adminController } from '../controllers/Admin.controller';

import { validate } from '../middlewares/validation.middleware';
import * as merchantValidation from '../shared/validations/merchant.validation';
import * as productValidation from '../shared/validations/product.validation';
import * as orderValidation from '../shared/validations/order.validation';
import * as disputeValidation from '../shared/validations/dispute.validation';
import * as agentValidation from '../shared/validations/agent.validation';

const adminRoute = Router();

adminRoute.get('/stats', adminController.stats);

adminRoute.get(
    '/products',
    validate(productValidation.list),
    productController.list
);

adminRoute.get(
    '/products/:id',
    validate(productValidation.actById),
    productController.getById
);

adminRoute.get(
    '/merchants',
    validate(merchantValidation.list),
    merchantController.list
);
adminRoute.get(
    '/merchants/:id',
    validate(merchantValidation.actById),
    merchantController.getById
);

adminRoute.get(
    '/merchants/products/:merchantId',
    validate(merchantValidation.getMerchantProducts),
    merchantController.getProducts
);

adminRoute.get('/orders', validate(orderValidation.list), orderController.list);
adminRoute.get(
    '/orders/:id',
    validate(orderValidation.actById),
    orderController.getById
);

adminRoute.get(
    '/disputes',
    validate(disputeValidation.list),
    disputeController.list
);
adminRoute.get(
    '/disputes/:id',
    validate(disputeValidation.actById),
    disputeController.getById
);

adminRoute.get(
    '/disputesById/:id',
    validate(disputeValidation.actById),
    disputeController.getByDisputeId
);

adminRoute.get('/agents', validate(agentValidation.list), agentController.list);

export default adminRoute;
