import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

import { IsNumber, IsString } from 'class-validator';

import { DisputeStatus } from '../shared/constants/global.constants';

import { Agents } from './Agents';
import { Orders } from './Orders';

@Entity('disputes')
export class Disputes extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders, (order) => order.id)
    order: Orders;

    @IsString()
    @Column()
    description: string;

    @IsNumber()
    @Column()
    disputeId: number;

    
    @IsNumber()
    @Column()
    approvedCount: number;

    @IsNumber()
    @Column()
    disapprovedCount: number;

    @IsNumber()
    @Column()
    reviewCount: number;

    @IsNumber()
    @Column()
    criteriaCount: number;

    @Column({
        type: 'enum',
        enum: DisputeStatus,
    })
    status: DisputeStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Agents, (agent) => agent.dispute)
    agents: Agents[];
}
