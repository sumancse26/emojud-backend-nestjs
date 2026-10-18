import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { loadJose } from './common/utils/jose-loader.js';
import { AppModule } from './app.module';

// Prisma returns bigint values, while JSON.stringify cannot serialize bigint.
// Configure this once so every API response handles them consistently.
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function () {
    return this.toString();
  },
  enumerable: false,
});

export function configureApp(app: INestApplication) {
  app.use(cookieParser());

  const rawOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    'https://emojud.netlify.app',
  ]
    .filter(Boolean)
    .join(',');

  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      // Allow configured origins
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow Netlify production and deploy preview domains for emojud
      if (/^https:\/\/([a-z0-9-]+--)?emojud\.netlify\.app$/i.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // In non-production or if no explicit origins are set, allow any localhost/127.0.0.1 port
      if (
        allowedOrigins.length === 0 ||
        process.env.NODE_ENV !== 'production'
      ) {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
          return callback(null, true);
        }
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cookie',
      'Set-Cookie',
      'Cache-Control',
      'Pragma',
      'Expires',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['Set-Cookie', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  // Exclude public root routes from the '/api' prefix so they can be accessed directly
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health', 'welcome', 'api'],
  });
}

async function bootstrap() {
  await loadJose();
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Emojud backend is running on: http://localhost:${port}`);
}

// In standard local or container runtime, start server
if (!process.env.VERCEL) {
  bootstrap();
}
