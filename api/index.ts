import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { AppModule } from '../src/app.module';

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

  const allowedOrigins = (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    ''
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string, callback: any) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (
        allowedOrigins.length === 0 ||
        process.env.NODE_ENV !== 'production'
      ) {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
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
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  // Exclude public root routes from the '/api' prefix so they can be accessed directly
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health', 'welcome', 'api'],
  });
}

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
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
