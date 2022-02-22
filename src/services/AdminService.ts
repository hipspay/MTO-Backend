import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { Admins } from '../entities/Admins';
import { ICreateAdmin } from '../shared/types/admin.types';

@Service()
export default class AdminService {
    public async createAdmin(createAdminData: ICreateAdmin): Promise<Admins> {
        const adminRepository = getRepository(Admins);

        const existSameWallet = await adminRepository.find({
            where: { walletAddress: createAdminData.walletAddress },
        });

        if (existSameWallet?.length > 0) {
            return Promise.reject('WALLET_ALREADY_EXIST');
        }

        return await adminRepository.save(createAdminData);
    }

    public async getAdminByAddress(address: string): Promise<Admins> {
        return await getRepository(Admins).findOne({
            where: { walletAddress: address },
        });
    }
}
