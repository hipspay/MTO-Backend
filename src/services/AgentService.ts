import { Service } from 'typedi';
import {
    Between,
    getRepository,
    ILike,
    LessThanOrEqual,
    MoreThanOrEqual,
} from 'typeorm';

import { Agents } from '../entities/Agents';
import { IAgentFilterQuery, ICreateAgent } from '../shared/types/agent.types';

@Service()
export default class AgentService {
    public async getAgents(query: IAgentFilterQuery): Promise<Agents[]> {
        const {
            walletAddress,
            status,
            fromScore,
            toScore,
            page,
            limit,
            sortBy,
            order,
        } = query;

        let filter = {};

        if (walletAddress) {
            filter = { walletAddress: ILike(`%${walletAddress}%`) };
        }

        if (status) {
            filter = { ...filter, status: status };
        }

        if (fromScore && toScore) {
            filter = { ...filter, score: Between(+fromScore, +toScore) };
        } else if (toScore) {
            filter = { ...filter, score: LessThanOrEqual(+toScore) };
        } else if (fromScore) {
            filter = { ...filter, score: MoreThanOrEqual(+fromScore) };
        }

        return await getRepository(Agents).find({
            where: filter,
            order: {
                [sortBy ? sortBy : 'id']: order ? order : 'ASC',
            },
            skip: (+page - 1) * +limit,
            take: +limit,
        });
    }

    public async getInfo(id: number): Promise<Agents> {
        return await getRepository(Agents).findOne({
            select: ['status', 'score'],
            where: { id },
        });
    }

    public async getProfile(id: number): Promise<Agents> {
        return await getRepository(Agents).findOne({
            where: { id },
            relations: [
                'dispute',
                'dispute.order',
                'dispute.order.product',
                'dispute.order.product.merchant',
            ],
        });
    }

    public async createAgent(createAgentData: ICreateAgent): Promise<Agents> {
        const agentRepository = getRepository(Agents);

        const existSameWallet = await agentRepository.find({
            where: { walletAddress: createAgentData.walletAddress },
        });

        if (existSameWallet?.length > 0) {
            return Promise.reject('WALLET_ALREADY_EXIST');
        }

        return agentRepository.save(createAgentData);
    }

    public async getAgentByAddress(address: string): Promise<Agents> {
        return await getRepository(Agents).findOne({
            where: { walletAddress: address },
        });
    }
}
