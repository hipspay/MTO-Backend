import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { Orders } from './Orders';
import { Merchants } from './Merchant';

@Entity('blockchains')
export class Blockchains extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column({ nullable: true })
    name?: string;

    @ManyToOne(() => Merchants, (merchant) => merchant.id)
    merchant?: Merchants;

    @IsString()
    @Column()
    blockchainType?: string;

    @IsString()
    @Column({ nullable: true })
    url?: string;

    @IsString()
    @Column({ nullable: true })
    chainId?: number;

    @IsString()
    @Column()
    gatewayAddress?: string;

    @IsString()
    @Column()
    utilityToken?: string;

    @IsString()
    @Column()
    gatewayABI?: string;

    @IsString()
    @Column()
    utilityTokenABI?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

}
