import { Router } from 'express';

import authRoute from './authentication.route';
import adminRoute from './admin.route';
import agentRoute from './agent.route';
import customerRoute from './customer.route';
import merchantRoute from './merchant.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/customer', customerRoute);
router.use('/merchant', merchantRoute);
router.use('/admin', adminRoute);
router.use('/agent', agentRoute);

export default router;
