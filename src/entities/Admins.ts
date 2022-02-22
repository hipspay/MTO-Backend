import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

@Entity('admins')
export class Admins extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column({ nullable: true })
    name: string;

    @IsString()
    @Column()
    walletAddress: string;
}
