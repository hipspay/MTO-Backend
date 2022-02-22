import { Router } from 'express';

import { customerController } from '../controllers/CustomerController';
import { disputeController } from '../controllers/DisputeController';
import { orderController } from '../controllers/OrderController';
import { productController } from '../controllers/ProductController';
import { authenticate } from '../middlewares/authentication.middleware';
import { validate } from '../middlewares/validation.middleware';
import * as customerValidation from '../shared/validations/customer.validation';
import * as disputeValidation from '../shared/validations/dispute.validation';
import * as orderValidation from '../shared/validations/order.validation';
import * as productValidation from '../shared/validations/product.validation';

const customerRoute = Router();
customerRoute.get(
    '/products',
    validate(productValidation.list),
    productController.list
);
customerRoute.get(
    '/products/:id',
    validate(productValidation.actById),
    productController.getById
);

customerRoute.all('*', authenticate('customer'));

customerRoute.put(
    '/profile',
    validate(customerValidation.update),
    customerController.update
);
customerRoute.get(
    '/profile',
    validate(customerValidation.getByAddress),
    customerController.getByAddress
);

customerRoute.get(
    '/myproducts',
    validate(productValidation.list),
    orderController.productList
);
customerRoute.get(
    '/myproducts/:id',
    validate(productValidation.actById),
    orderController.getProductById
);
customerRoute.get(
    '/myorders',
    validate(orderValidation.list),
    orderController.listByAddress
);
customerRoute.get(
    '/completedorders',
    validate(orderValidation.list),
    orderController.listByCompletedAddress
);
customerRoute.get(
    '/myorders/:id',
    validate(orderValidation.actById),
    orderController.getByAddressById
);

customerRoute.get(
    '/disputes',
    validate(disputeValidation.list),
    disputeController.listByAddress
);
customerRoute.get(
    '/disputes/:id',
    validate(disputeValidation.actById),
    disputeController.getByAddressById
);

customerRoute.put(
    '/disputes/:id',
    validate(disputeValidation.actById),
    disputeController.updateDisputeById
);

customerRoute.get(
    '/checkByEscrowId/:escrowId',
    validate(orderValidation.getByEscrowId),
    orderController.getByEscrowId
);
export default customerRoute;
