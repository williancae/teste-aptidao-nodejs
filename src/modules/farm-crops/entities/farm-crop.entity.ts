import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Crop } from '../../crops/entities/crop.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { Harvest } from '../../harvests/entities/harvest.entity';

@Entity('farm_crops')
@Unique('farm_crop_harvest_unique', ['farmId', 'cropId', 'harvestId'])
export class FarmCrop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'planted_area',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    plantedArea?: number;

    @Column({
        name: 'expected_yield',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    expectedYield?: number;

    @Column({
        name: 'actual_yield',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    actualYield?: number;

    @Column({ name: 'farm_id' })
    farmId: string;

    @Column({ name: 'crop_id' })
    cropId: string;

    @Column({ name: 'harvest_id' })
    harvestId: string;

    @ManyToOne(() => Farm, farm => farm.farmCrops, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;

    @ManyToOne(() => Crop, crop => crop.farmCrops, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'crop_id' })
    crop: Crop;

    @ManyToOne(() => Harvest, harvest => harvest.farmCrops, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'harvest_id' })
    harvest: Harvest;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
