import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';

@Entity('producers')
export class Producer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cpf_cnpj', unique: true })
    cpfCnpj: string;

    @Column({ name: 'producer_name' })
    producerName: string;

    @OneToMany(() => Farm, farm => farm.producer, { cascade: true })
    farms: Farm[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
