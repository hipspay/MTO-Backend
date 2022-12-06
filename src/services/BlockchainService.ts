import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { Blockchains } from '../entities/Blockchain';
import { ICreateBlockchain } from '../shared/types/blockchain.types';

@Service()
export default class BlockchainService {
    public async createBlockchain(
        createBlockchainData: ICreateBlockchain
    ): Promise<Blockchains> {
        const blockchainRepository = getRepository(Blockchains);
        return await blockchainRepository.save(createBlockchainData);
    }

    public async getBlockchain(filters: Partial<Blockchains>): Promise<Blockchains> {
        console.log(filters);
        return await getRepository(Blockchains).findOne({
            where: filters,
        });
    }

    public async updateBlockchain(
        id: string,
        updateBlockchainData: Partial<ICreateBlockchain>
    ): Promise<any> {
        const blockchainRepository = getRepository(Blockchains);

        const blockchain = await blockchainRepository.findOne({
            where: { id: id },
        });

        if (!blockchain) {
            return null;
        }

        return await blockchainRepository.update(id, updateBlockchainData);
    }
}
