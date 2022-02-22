import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface IRequest extends Request {
    address: string;
    id: number;
    role: 'customer' | 'merchant' | 'agent' | 'admin';
}

export interface IBaseFilterQuery extends ParsedQs {
    page: string;
    limit: string;
    order: 'DESC' | 'ASC';
    sortBy: string;
}
