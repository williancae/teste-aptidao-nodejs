import { NestFactory } from '@nestjs/core';
import { DatabaseSeeder } from './database.seed';
import { SeedModule } from './seed.module';

async function bootstrap() {
    console.log('🚀 Iniciando aplicação de seed...');

    try {
        const app = await NestFactory.create(SeedModule, {
            logger: ['log', 'error', 'warn'],
        });

        const seeder = app.get(DatabaseSeeder);

        await seeder.seed();

        console.log('✅ Seed executado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

bootstrap().catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
});
