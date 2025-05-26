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

@Entity('crops')
export class Crop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'crop_name', unique: true })
    cropName: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => FarmCrop, farmCrop => farmCrop.crop)
    farmCrops: FarmCrop[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
