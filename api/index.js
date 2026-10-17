const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// Prisma returns bigint values, while JSON.stringify cannot serialize bigint.
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function () {
    return this.toString();
  },
  enumerable: false,
});

function loadAppModule() {
  const candidates = [
    path.join(__dirname, '../dist/src/app.module.js'),
    path.join(__dirname, '../dist/src/app.module'),
    path.join(__dirname, './dist/src/app.module.js'),
    path.join(__dirname, '../dist/app.module.js'),
    path.join(process.cwd(), 'dist/src/app.module.js'),
  ];

  for (const candidate of candidates) {
    try {
      const mod = require(candidate);
      if (mod && mod.AppModule) {
        return mod.AppModule;
      }
    } catch (e) {
      // Continue trying next candidate
    }
  }

  // Fallback direct require
  return require('../dist/src/app.module').AppModule;
}

let cachedServer = null;

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
    const AppModule = loadAppModule();
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
  } catch (error) {
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
};
