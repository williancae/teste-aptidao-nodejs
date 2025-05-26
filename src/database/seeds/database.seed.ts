import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from '../../modules/crops/entities/crop.entity';
import { FarmCrop } from '../../modules/farm-crops/entities/farm-crop.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { Producer } from '../../modules/producers/entities/producer.entity';

interface FarmCropData {
    farmId: string;
    cropId: string;
    harvestId: string;
    plantedArea: number;
    expectedYield: number;
    actualYield?: number;
}

@Injectable()
export class DatabaseSeeder {
    constructor(
        @InjectRepository(Producer)
        private producerRepository: Repository<Producer>,
        @InjectRepository(Farm)
        private farmRepository: Repository<Farm>,
        @InjectRepository(Crop)
        private cropRepository: Repository<Crop>,
        @InjectRepository(Harvest)
        private harvestRepository: Repository<Harvest>,
        @InjectRepository(FarmCrop)
        private farmCropRepository: Repository<FarmCrop>,
    ) {}

    async seed(force: boolean = false) {
        console.log('🌱 Iniciando seed do banco de dados...');

        try {
            const existingProducers = await this.producerRepository.count();

            if (existingProducers > 0) {
                console.log('🧹 Limpando dados existentes...');
                await this.clearAllData();
            }

            console.log('📝 Criando novos dados...');

            const producers = await this.createProducers();
            console.log(`✅ ${producers.length} produtores criados`);

            const crops = await this.createCrops();
            console.log(`✅ ${crops.length} culturas criadas`);

            const harvests = await this.createHarvests();
            console.log(`✅ ${harvests.length} safras criadas`);

            const farms = await this.createFarms(producers);
            console.log(`✅ ${farms.length} fazendas criadas`);

            const farmCrops = await this.createFarmCrops(farms, crops, harvests);
            console.log(`✅ ${farmCrops.length} plantios criados`);

            console.log('🎉 Seed finalizado com sucesso!');

            await this.showStats();
        } catch (error) {
            console.error('💥 Erro durante o seed:', error);
            throw error;
        }
    }

    private async clearAllData() {
        console.log('  🗑️  Limpando dados com método seguro...');

        try {
            console.log('    - Deletando farm_crops...');
            await this.farmCropRepository.query('DELETE FROM farm_crops');

            console.log('    - Deletando farms...');
            await this.farmRepository.query('DELETE FROM farms');

            console.log('    - Deletando harvests...');
            await this.harvestRepository.query('DELETE FROM harvests');

            console.log('    - Deletando crops...');
            await this.cropRepository.query('DELETE FROM crops');

            console.log('    - Deletando producers...');
            await this.producerRepository.query('DELETE FROM producers');

            console.log('  ✅ Dados limpos com sucesso!');
        } catch (error) {
            console.log('  ⚠️  DELETE falhou, tentando método alternativo...');

            await this.clearDataWithORM();
        }
    }

    private async clearDataWithORM() {
        console.log('  🗑️  Limpando com ORM (método lento mas seguro)...');

        const farmCrops = await this.farmCropRepository.find();
        if (farmCrops.length > 0) {
            console.log(`    - Removendo ${farmCrops.length} farm_crops...`);
            await this.farmCropRepository.remove(farmCrops);
        }

        const farms = await this.farmRepository.find();
        if (farms.length > 0) {
            console.log(`    - Removendo ${farms.length} farms...`);
            await this.farmRepository.remove(farms);
        }

        const harvests = await this.harvestRepository.find();
        if (harvests.length > 0) {
            console.log(`    - Removendo ${harvests.length} harvests...`);
            await this.harvestRepository.remove(harvests);
        }

        const crops = await this.cropRepository.find();
        if (crops.length > 0) {
            console.log(`    - Removendo ${crops.length} crops...`);
            await this.cropRepository.remove(crops);
        }

        const producers = await this.producerRepository.find();
        if (producers.length > 0) {
            console.log(`    - Removendo ${producers.length} producers...`);
            await this.producerRepository.remove(producers);
        }

        console.log('  ✅ Limpeza com ORM concluída!');
    }

    private async showStats() {
        const stats = {
            produtores: await this.producerRepository.count(),
            fazendas: await this.farmRepository.count(),
            culturas: await this.cropRepository.count(),
            safras: await this.harvestRepository.count(),
            plantios: await this.farmCropRepository.count(),
        };

        console.log('\n📊 Estatísticas finais:');
        console.table(stats);
    }

    private async createProducers(): Promise<Producer[]> {
        const producersData = [
            { cpfCnpj: '12345678901', producerName: 'João Silva dos Santos' },
            { cpfCnpj: '98765432100', producerName: 'Maria Oliveira Costa' },
            { cpfCnpj: '11223344556', producerName: 'Carlos Eduardo Pereira' },
            { cpfCnpj: '12345678000195', producerName: 'Agropecuária Brasil Ltda' },
            { cpfCnpj: '98765432000123', producerName: 'Fazendas Unidas S.A.' },
            { cpfCnpj: '55566677788', producerName: 'Ana Paula Rodrigues' },
            { cpfCnpj: '44455566677', producerName: 'Roberto Carlos Lima' },
            { cpfCnpj: '11111111000111', producerName: 'Cooperativa Agrícola Vale Verde' },
        ];

        const producers = this.producerRepository.create(producersData);
        return this.producerRepository.save(producers);
    }

    private async createCrops(): Promise<Crop[]> {
        const cropsData = [
            { cropName: 'Soja', description: 'Soja transgênica para grãos' },
            { cropName: 'Milho', description: 'Milho híbrido para silagem e grãos' },
            { cropName: 'Algodão', description: 'Algodão de fibra longa' },
            { cropName: 'Café', description: 'Café arábica premium' },
            { cropName: 'Cana-de-açúcar', description: 'Cana para produção de etanol' },
            { cropName: 'Trigo', description: 'Trigo para panificação' },
            { cropName: 'Arroz', description: 'Arroz irrigado' },
            { cropName: 'Feijão', description: 'Feijão carioca' },
        ];

        const crops = this.cropRepository.create(cropsData);
        return this.cropRepository.save(crops);
    }

    private async createHarvests(): Promise<Harvest[]> {
        const harvestsData = [
            {
                harvestName: 'Safra 2022/2023',
                harvestYear: 2022,
                startDate: new Date('2022-09-01'),
                endDate: new Date('2023-08-31'),
            },
            {
                harvestName: 'Safra 2023/2024',
                harvestYear: 2023,
                startDate: new Date('2023-09-01'),
                endDate: new Date('2024-08-31'),
            },
            {
                harvestName: 'Safra 2024/2025',
                harvestYear: 2024,
                startDate: new Date('2024-09-01'),
                endDate: new Date('2025-08-31'),
            },
        ];

        const harvests = this.harvestRepository.create(harvestsData);
        return this.harvestRepository.save(harvests);
    }

    private async createFarms(producers: Producer[]): Promise<Farm[]> {
        const farmsData = [
            {
                farmName: 'Fazenda Santa Maria',
                city: 'Sorriso',
                state: 'MT',
                totalArea: 2500.0,
                agriculturableArea: 2000.0,
                vegetationArea: 500.0,
                producerId: producers[0].id,
            },
            {
                farmName: 'Fazenda Boa Vista',
                city: 'Campo Grande',
                state: 'MS',
                totalArea: 1800.5,
                agriculturableArea: 1400.0,
                vegetationArea: 400.5,
                producerId: producers[1].id,
            },
            {
                farmName: 'Fazenda São José',
                city: 'Uberlândia',
                state: 'MG',
                totalArea: 3200.75,
                agriculturableArea: 2800.0,
                vegetationArea: 400.75,
                producerId: producers[2].id,
            },
            {
                farmName: 'Fazenda Esperança',
                city: 'Cascavel',
                state: 'PR',
                totalArea: 1500.25,
                agriculturableArea: 1200.0,
                vegetationArea: 300.25,
                producerId: producers[3].id,
            },
            {
                farmName: 'Fazenda Progresso',
                city: 'Rio Verde',
                state: 'GO',
                totalArea: 4000.0,
                agriculturableArea: 3500.0,
                vegetationArea: 500.0,
                producerId: producers[4].id,
            },
            {
                farmName: 'Fazenda Três Irmãos',
                city: 'Barreiras',
                state: 'BA',
                totalArea: 2200.3,
                agriculturableArea: 1800.0,
                vegetationArea: 400.3,
                producerId: producers[0].id,
            },
            {
                farmName: 'Fazenda Nova Era',
                city: 'Dourados',
                state: 'MS',
                totalArea: 1900.0,
                agriculturableArea: 1500.0,
                vegetationArea: 400.0,
                producerId: producers[1].id,
            },
        ];

        const farms = this.farmRepository.create(farmsData);
        return this.farmRepository.save(farms);
    }

    private async createFarmCrops(
        farms: Farm[],
        crops: Crop[],
        harvests: Harvest[],
    ): Promise<FarmCrop[]> {
        const farmCropsData: FarmCropData[] = [];

        farms.forEach((farm, farmIndex) => {
            harvests.forEach((harvest, harvestIndex) => {
                const cropsPerFarm = Math.floor(Math.random() * 3) + 2;
                const selectedCrops = crops.slice(0, cropsPerFarm);

                const totalPlantingArea = farm.agriculturableArea * 0.9;

                selectedCrops.forEach((crop, cropIndex) => {
                    const areaPercentage = Math.random() * 0.4 + 0.2;
                    const plantedArea = Number(
                        ((totalPlantingArea * areaPercentage) / selectedCrops.length).toFixed(2),
                    );

                    const finalPlantedArea = Math.min(
                        plantedArea,
                        farm.agriculturableArea / selectedCrops.length,
                    );

                    farmCropsData.push({
                        farmId: farm.id,
                        cropId: crop.id,
                        harvestId: harvest.id,
                        plantedArea: finalPlantedArea,
                        expectedYield: Number(
                            (finalPlantedArea * (2 + Math.random() * 3)).toFixed(2),
                        ),
                        actualYield:
                            harvestIndex === 0
                                ? Number((finalPlantedArea * (1.5 + Math.random() * 3)).toFixed(2))
                                : undefined,
                    });
                });
            });
        });

        const farmCrops = this.farmCropRepository.create(farmCropsData);
        return this.farmCropRepository.save(farmCrops);
    }
}
