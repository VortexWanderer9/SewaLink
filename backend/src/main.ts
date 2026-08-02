import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { mkdirSync, existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    logger.log(`Created upload directory: ${uploadDir}`);
  }

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      exposedHeaders: ['Set-Cookie'],
    },
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('SewaLink Nepal API')
    .setDescription('Complete API for SewaLink Nepal home services marketplace')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .addCookieAuth('refresh_token')
    .addTag('Auth', 'Authentication & registration')
    .addTag('Categories', 'Service categories')
    .addTag('Workers', 'Worker profiles & search')
    .addTag('Customers', 'Customer profiles')
    .addTag('Users', 'User management (admin)')
    .addTag('Bookings', 'Booking management')
    .addTag('Payments', 'Payment processing (eSewa, Khalti, IME Pay)')
    .addTag('Reviews', 'Reviews & ratings')
    .addTag('Notifications', 'User notifications')
    .addTag('Chat', 'Real-time messaging')
    .addTag('Addresses', 'User address management')
    .addTag('Documents', 'Document upload & verification')
    .addTag('Earnings', 'Worker earnings & payouts')
    .addTag('Favorites', 'Favorite workers')
    .addTag('Admin', 'Admin dashboard analytics & management')
    .addTag('Audit', 'System audit logs')
    .addServer(`http://localhost:${process.env.PORT || 3001}`, 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
    },
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`SewaLink API running on http://localhost:${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
