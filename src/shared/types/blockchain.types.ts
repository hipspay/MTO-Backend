import { Merchants } from "../../entities/Merchant";

export interface ICreateBlockchain {
    id: number;
    merchant?: Merchants;
    blockchainType?: string;
    gatewayAddress?: string;
    utilityToken?: string;
    url?: string;
    chainId?: number;
    gatewayABI?: string;
    utilityTokenABI?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
