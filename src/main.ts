import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: true,
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Brain Agriculture API')
        .setDescription('Sistema de gestão de lavouras e fazendas')
        .setVersion('1.0')
        .addTag('producers', 'Produtores rurais')
        .addTag('farms', 'Lavouras e Fazendas')
        .addTag('crops', 'Culturas e Plantios')
        .addTag('harvests', 'Colheitas e Safras')
        .addTag('farm-crops', 'Culturas das Fazendas')
        .addTag('dashboard', 'Painel de estatísticas')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`API 🚀 : http://localhost:${port}/api`);
    logger.log(`Swagger 📚 : http://localhost:${port}/api/docs`);
}

bootstrap();
