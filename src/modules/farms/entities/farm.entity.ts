import {
    Check,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FarmCrop } from '../../farm-crops/entities/farm-crop.entity';
import { Producer } from '../../producers/entities/producer.entity';

@Entity('farms')
@Check('total_area_check', '"total_area" > 0')
@Check('agriculturable_area_check', '"agriculturable_area" >= 0')
@Check('vegetation_area_check', '"vegetation_area" >= 0')
@Check('area_sum_check', '"agriculturable_area" + "vegetation_area" <= "total_area"')
export class Farm {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'farm_name' })
    farmName: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ name: 'total_area', type: 'decimal', precision: 10, scale: 2 })
    totalArea: number;

    @Column({ name: 'agriculturable_area', type: 'decimal', precision: 10, scale: 2 })
    agriculturableArea: number;

    @Column({ name: 'vegetation_area', type: 'decimal', precision: 10, scale: 2 })
    vegetationArea: number;

    @Column({ name: 'producer_id' })
    producerId: string;

    @ManyToOne(() => Producer, producer => producer.farms, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producer_id' })
    producer: Producer;

    @OneToMany(() => FarmCrop, farmCrop => farmCrop.farm, { cascade: true })
    farmCrops: FarmCrop[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
