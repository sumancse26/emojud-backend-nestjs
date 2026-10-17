const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const cookieParser = require('cookie-parser');

// Import the precompiled NestJS application module from dist
const { AppModule } = require('../dist/src/app.module');

let cachedServer = null;

// Prisma returns bigint values, while JSON.stringify cannot serialize bigint.
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function () {
    return this.toString();
  },
  enumerable: false,
});

function configureApp(app) {
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
    origin: (origin, callback) => {
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

async function bootstrapServer() {
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

module.exports = async function handler(req, res) {
  // If Vercel rewrote the URL, preserve the original path from x-matched-path
  const matchedPath = req.headers['x-matched-path'];
  if (matchedPath && typeof matchedPath === 'string') {
    const queryIndex = req.url ? req.url.indexOf('?') : -1;
    const query = queryIndex !== -1 ? req.url.substring(queryIndex) : '';
    req.url = matchedPath + query;
  }

  const server = await bootstrapServer();
  return server(req, res);
};
