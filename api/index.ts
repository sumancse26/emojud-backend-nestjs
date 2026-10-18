import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
// @ts-ignore
import { AppModule } from '../dist/src/app.module.js';
// @ts-ignore
import { loadJose } from '../dist/src/common/utils/jose-loader.js';

let cachedServer: Express | null = null;

// Prisma returns bigint values, while JSON.stringify cannot serialize bigint.
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function () {
    return this.toString();
  },
  enumerable: false,
});

function configureApp(app: any) {
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
    origin: (origin: string, callback: any) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (/^https:\/\/([a-z0-9-]+--)?emojud\.netlify\.app$/i.test(normalizedOrigin)) {
        return callback(null, true);
      }

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

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    await loadJose();
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    configureApp(app);
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  try {
    // If Vercel rewrote the URL, preserve the original path from x-matched-path
    const matchedPath = req.headers['x-matched-path'];
    if (matchedPath && typeof matchedPath === 'string') {
      const queryIndex = req.url ? req.url.indexOf('?') : -1;
      const query = queryIndex !== -1 ? req.url.substring(queryIndex) : '';
      req.url = matchedPath + query;
    }

    const server = await bootstrapServer();
    return server(req, res);
  } catch (error: any) {
    console.error('CRITICAL SERVERLESS HANDLER ERROR:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        success: false,
        error: 'SERVERLESS_INITIALIZATION_ERROR',
        message: error.message || 'Server initialization failed',
        stack: error.stack,
      }),
    );
  }
}
