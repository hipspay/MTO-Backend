import { Request, Response, NextFunction } from 'express';

import AgentService from '../services/AgentService';
import { IAgentFilterQuery } from '../shared/types/agent.types';
import { IRequest } from '../shared/types/base.types';
import { AgentStatus } from '../shared/constants/global.constants';
export class AgentController {
    private agentService: AgentService;

    constructor() {
        this.agentService = new AgentService();
    }

    public list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const agents = await this.agentService.getAgents(
                req.query as IAgentFilterQuery
            );

            res.json(agents);
        } catch (error) {
            next(error);
        }
    };

    public getInfo = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req;
            const agent = await this.agentService.getInfo(id);
            if (!agent) {
                res.status(404).json({
                    message: 'No data found',
                });
            }
            if (agent.score === 0 || agent.status !== AgentStatus.WAITING) {
                return res.send(false);
            }
            return res.send(true);
        } catch (error) {
            next(error);
        }
    };

    public checkInit = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req;
            const agent = await this.agentService.getInfo(id);
            if (!agent) {
                res.status(404).json({
                    message: 'No data found',
                });
            }
            if (agent.status === AgentStatus.INIT) {
                return res.send(true);
            }
            return res.send(false);
        } catch (error) {
            next(error);
        }
    };

    public getProfile = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req;
            const agent = await this.agentService.getProfile(id);
            if (!agent) {
                res.status(404).json({
                    message: 'No data found',
                });
            }

            return res.send(agent);
        } catch (error) {
            next(error);
        }
    };
}

export const agentController = new AgentController();
