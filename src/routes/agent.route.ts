import { Router } from 'express';

import { agentController } from '../controllers/AgentController';
import { authenticate } from '../middlewares/authentication.middleware';

const agentRoute = Router();

agentRoute.all('*', authenticate('agent'));

agentRoute.get('/check', agentController.getInfo);
agentRoute.get('/check/init', agentController.checkInit);

agentRoute.get('/profile', agentController.getProfile);

export default agentRoute;
