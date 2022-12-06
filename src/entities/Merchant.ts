import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { Products } from './Products';
import { Blockchains } from './Blockchain';

@Entity('merchants')
export class Merchants extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column({ nullable: true })
    name: string;

    @IsString()
    @Column({ nullable: true })
    image: string;

    @IsString()
    @Column()
    walletAddress: string;

    @IsString()
    @Column({ nullable: true })
    shippingAddress: string;

    @IsString()
    @Column({ nullable: true })
    appKey: string;

    @IsString()
    @Column({ nullable: true })
    appSecret: string;

    @IsString()
    @Column({ nullable: true })
    externalLink: string;

    @OneToMany(() => Products, (product) => product.merchant)
    products: Products[];

    @OneToMany(() => Blockchains, (blockchain) => blockchain.merchant)
    blockchains: Blockchains[];
}
