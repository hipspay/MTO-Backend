import { Response } from 'express';
import httpStatus from 'http-status';
import Web3 from 'web3';

import CustomerService from '../services/CustomerService';
import MerchantService from '../services/MerchantService';
import AgentService from '../services/AgentService';
import AdminService from '../services/AdminService';

import { IRequest } from '../shared/types/base.types';
import { sign } from '../utils';
import { AgentStatus } from '../shared/constants/global.constants';
import {Role} from '../shared/types/auth.types';
import { NextFunction } from 'express';

const web3 = new Web3(process.env.INFURA_URL);
export class AuthController {
    private customerService: CustomerService;
    private merchantService: MerchantService;
    private agentService: AgentService;
    private adminService: AdminService;
    constructor() {
        this.customerService = new CustomerService();
        this.merchantService = new MerchantService();
        this.agentService = new AgentService();
        this.adminService = new AdminService();
    }
    public authenticateUser = async (req: IRequest, res: Response,  next: NextFunction, role: Role) => {
        const { signature, challenge, appkey } = req.headers;
        const recovered = web3.eth.accounts.recover(
            challenge as string,
            signature as string
        );
        let user;
        switch(role){
            case 'customer':
                user = await this.customerService.getCustomerByAddress(recovered);
                if (!user) {
                    user = await this.customerService.createCustomer({
                        walletAddress: recovered,
                    });
                }
                break;
            case 'admin':
                    user = await this.adminService.getAdminByAddress(recovered);
                    if (!user) {
                        user = await this.adminService.createAdmin({
                            walletAddress: recovered,
                        });
                    }
                    break;
            case 'agent':
                user = await this.agentService.getAgentByAddress(recovered);
                if (!user) {
                    user = await this.agentService.createAgent({
                        name: 'recovered',
                        score:100,
                        status: AgentStatus.INIT,
                        walletAddress: recovered
                    });
                }
                break;
            case 'merchant':
                    user = await this.merchantService.getMerchantByAddress(recovered)
                    if (!user) {
                        user = await await this.merchantService.createMerchant({
                            walletAddress: recovered,
                            appKey: appkey as string
                        });
                    }
                    break;    
            default:
                res.json({ error: 'Role/User Not found' });    
        }
        req.address = recovered;
        req.id = user.id;
        req.role = role;
        return  next();
    }
    public authenticateMerchant = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { signature, appsecret, appkey, challenge } = req.headers;
            const recovered = web3.eth.accounts.recover(
                challenge as string,
                signature as string
            );
            let merchant = await this.merchantService.getMerchantByAddressAndApp(
                recovered,
                appkey as string
            );
            if (!merchant) {
                merchant = await this.merchantService.createMerchant({
                    walletAddress: recovered,
                    appKey: appkey as string,
                    appSecret: appsecret as string
                });
            }
            req.address = recovered;
            req.id = merchant.id;
            req.role = 'merchant';
            return  next();
        } catch (error) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: 'something went wrong on server.' });
        }
    };

    public authenticateCustomer = async (req: IRequest, res: Response) => {
        try {
            const { signature } = req.headers;
            const recovered = web3.eth.accounts.recover(
                process.env.SIGNED_STRING,
                signature as string
            );

            let customer = await this.customerService.getCustomerByAddress(
                recovered
            );
            if (!customer) {
                customer = await this.customerService.createCustomer({
                    walletAddress: recovered,
                });
            }
            return res.json({
                token: sign({
                    id: customer.id,
                    role: 'customer',
                    address: recovered,
                }),
            });
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: 'something went wrong on server.' });
        }
    };

    public authenticateAgent = async (req: IRequest, res: Response) => {
        try {
            const { signature } = req.headers;
            const recovered = web3.eth.accounts.recover(
                process.env.SIGNED_STRING,
                signature as string
            );

            let agent = await this.agentService.getAgentByAddress(recovered);
            if (!agent) {
                agent = await this.agentService.createAgent({
                    walletAddress: recovered,
                    score: 100,
                    status: AgentStatus.INIT,
                });
            }

            return res.json({
                token: sign({
                    id: agent.id,
                    role: 'agent',
                    address: recovered,
                }),
            });
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: 'something went wrong on server.' });
        }
    };

    public authenticateAdmin = async (req: IRequest, res: Response) => {
        try {
            const { signature } = req.headers;
            const recovered = web3.eth.accounts.recover(
                process.env.SIGNED_STRING,
                signature as string
            );
            let admin = await this.adminService.getAdminByAddress(recovered);
            if (!admin) {
                admin = await this.adminService.createAdmin({
                    walletAddress: recovered,
                });
            }
            return res.json({
                token: sign({
                    id: admin.id,
                    role: 'admin',
                    address: recovered,
                }),
            });
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: 'something went wrong on server.' });
        }
    };
}

export const authController = new AuthController();
