import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { doubleCsrf } from 'csrf-csrf';
import * as fs from 'fs';
import helmet from 'helmet';
import { load } from 'js-yaml';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  // Apply global pipes, filters, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  // CSRF Protection setup
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET as string,
    cookieName: 'x-csrf-token',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  });

  app.use(doubleCsrfProtection);

  // Load the Swagger YAML file
  const swaggerDocument = load(
    fs.readFileSync(join(__dirname, '..', 'docs/swagger.yaml'), 'utf8'),
  ) as swaggerUi.SwaggerUiOptions;

  // Serve Swagger UI at /docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Set the global prefix for all routes
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
