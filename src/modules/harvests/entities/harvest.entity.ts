import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FarmCrop } from '../../farm-crops/entities/farm-crop.entity';

@Entity('harvests')
export class Harvest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'harvest_name', unique: true })
    harvestName: string;

    @Column({ name: 'harvest_year', type: 'int' })
    harvestYear: number;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate?: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate?: Date;

    @OneToMany(() => FarmCrop, farmCrop => farmCrop.harvest)
    farmCrops: FarmCrop[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
