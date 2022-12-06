import { Router } from 'express';

import { merchantController } from '../controllers/MerchantController';
import { productController } from '../controllers/ProductController';
import { blockchainController } from '../controllers/Blockchain.controller';
import { orderController } from '../controllers/OrderController';
import { disputeController } from '../controllers/DisputeController';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, customAuthenticate } from '../middlewares/authentication.middleware';
import { uploadImage } from '../middlewares/upload.middleware';
import * as merchantValidation from '../shared/validations/merchant.validation';
import * as productValidation from '../shared/validations/product.validation';
import * as blockchainValidation from '../shared/validations/blockchain.validation';
import * as orderValidation from '../shared/validations/order.validation';
import * as disputeValidation from '../shared/validations/dispute.validation';

const merchantRoute = Router();

merchantRoute.all('*', authenticate('merchant')); // todo

merchantRoute.put(
    '/profile',
    validate(merchantValidation.update),
    merchantController.update
);
merchantRoute.get('/profile', merchantController.getProfile);

merchantRoute.get(
    '/products',
    validate(productValidation.list),
    productController.listByMerchant
);
merchantRoute.post(
    '/products',
    validate(productValidation.create),
    productController.create
);
merchantRoute.post(
    "/blockchain",
    validate(blockchainValidation.create),
    blockchainController.create
);

merchantRoute.put(
    "/blockchain",
    validate(blockchainValidation.update),
    blockchainController.update
);
merchantRoute.get(
    "/blockchain",
    validate(blockchainValidation.selectAllorFiltred),
    blockchainController.getBlockchains
);
merchantRoute.get(
    '/products/:id',
    validate(productValidation.actById),
    productController.getByMerchantById
);
merchantRoute.put(
    '/products/:id',
    validate(productValidation.update),
    productController.update
);
merchantRoute.delete(
    '/products/:id',
    validate(productValidation.actById),
    productController.remove
);

merchantRoute.get(
    '/orders',
    validate(orderValidation.list),
    orderController.listByMerchant
);
merchantRoute.get(
    '/orders/:id',
    validate(orderValidation.actById),
    orderController.getByMerchantById
);

merchantRoute.get(
    '/disputes',
    validate(disputeValidation.list),
    disputeController.listByMerchant
);
merchantRoute.get(
    '/disputes/:id',
    validate(disputeValidation.actById),
    disputeController.getByMerchantById
);

export default merchantRoute;
