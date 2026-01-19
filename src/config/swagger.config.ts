import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Finance System API')
  .setDescription('API documentation')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
