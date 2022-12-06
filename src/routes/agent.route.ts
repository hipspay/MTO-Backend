import { Router } from 'express';

import { agentController } from '../controllers/AgentController';
import { authenticate } from '../middlewares/authentication.middleware';
import { disputeController } from '../controllers/DisputeController';

const agentRoute = Router();

agentRoute.all('*', authenticate('agent'));

agentRoute.get('/check', agentController.getInfo);
agentRoute.get('/check/init', agentController.checkInit);

agentRoute.get('/profile', agentController.getProfile);
agentRoute.get('/disputes', disputeController.listAgentDisputes);

export default agentRoute;
