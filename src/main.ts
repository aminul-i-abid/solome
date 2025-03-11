import { ValidationPipe } from '@nestjs/common'; // Add BadRequestException import
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import helmet from 'helmet';
import { load } from 'js-yaml';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './app.module';
import { doubleCsrfProtection } from './common/config/csrf.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { ResponseUtil } from './utils/response.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());

  // Apply global pipes, filters, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        const error = errors[0];
        let message = '';

        if (error.constraints?.isNotEmpty) {
          message = `${error.property} field is required`;
        } else {
          message = Object.values(error.constraints ?? {})[0];
        }

        ResponseUtil.error(message); // Use BadRequestException instead of Error
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());

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
