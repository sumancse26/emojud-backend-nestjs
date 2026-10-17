import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/main';

let cachedServer: Express | null = null;

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

export default async function handler(req: any, res: any) {
  // If Vercel rewrote the URL, preserve the original path from x-matched-path
  const matchedPath = req.headers['x-matched-path'] as string;
  if (matchedPath) {
    const queryIndex = req.url ? req.url.indexOf('?') : -1;
    const query = queryIndex !== -1 ? req.url.substring(queryIndex) : '';
    req.url = matchedPath + query;
  }

  const server = await bootstrapServer();
  return server(req, res);
}
