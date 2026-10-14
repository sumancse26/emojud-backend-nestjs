# Emojud Backend

Production-grade REST API for the **Emojud ERP** platform — an inventory, sales, HR, and accounting management system built for multi-shop retail businesses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES2023) |
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5 (strict null checks) |
| **ORM** | Prisma ORM 7 with `@prisma/adapter-pg` driver |
| **Database** | PostgreSQL |
| **Auth** | JWT (HS256) via `jose` — access + refresh token rotation |
| **Validation** | Zod 4 |
| **Password Hashing** | bcrypt |

---

## Project Structure

```
src/
├── main.ts                        # Bootstrap, CORS, global prefix
├── app.module.ts                  # Root module with global guard & interceptor
├── common/
│   ├── decorators/                # @Public(), custom param decorators
│   ├── interceptor/               # ResponseInterceptor (uniform API envelope)
│   ├── interfaces/                # Shared TypeScript interfaces
│   ├── pipes/                     # Validation pipes
│   └── utils/                     # Cookie helpers, utility functions
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts          # PrismaClient with pg driver adapter
└── modules/
    ├── auth/                      # JWT service, cookie config, login/logout/refresh
    ├── guard/                     # Global AuthGuard (Bearer token verification)
    ├── dashboard/                 # Dashboard summary & metrics
    ├── configuration/             # Shops, departments, designations, roles, warehouses
    ├── hr/                        # Employee CRUD with user+session provisioning
    ├── products/                  # Product & category management
    ├── inventory/                 # Stock summaries, shop-wise products
    ├── stock-management/          # Purchase & sales invoice processing
    ├── accounts/                  # Suppliers, customers, dues, payments, expenses
    ├── reports/                   # Parameterized reporting engine
    └── lookup/                    # Lookup/metadata tables
```

---

## Authentication & Authorization

The API uses a **dual-token** architecture with automatic token rotation:

| Token | Purpose | Lifetime | Storage |
|---|---|---|---|
| **Access Token** | Authenticates API requests | **15 minutes** | Client memory (Authorization header) |
| **Refresh Token** | Issues new access tokens | **7 days** | HTTP-only secure cookie |

### Flow

1. **Login** — `POST /api/auth/login` validates credentials, creates a server-side session, and returns an `accessToken` in the body + sets the `refresh_token` HTTP-only cookie.
2. **API Requests** — Send `Authorization: Bearer <accessToken>` header. The global `AuthGuard` verifies the token on every request (except `@Public()` routes).
3. **Token Refresh** — `POST /api/auth/refresh` reads the cookie, rotates the session, and issues a new token pair.
4. **Logout** — `POST /api/auth/logout` invalidates the session and clears the cookie.

### Security Measures

- HTTP-only, Secure (production), SameSite=Strict cookies prevent XSS/CSRF
- Short-lived access tokens (15m) minimize the blast radius of token theft
- Session-based refresh tokens with server-side invalidation
- bcrypt password hashing with salt rounds
- JWT payload validation with type + integer safety checks
- CORS whitelist with explicit origin validation

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd emojud-backend-nestjs

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"

# JWT Secrets — use strong, unique values in production (min 32 chars)
JWT_ACCESS_SECRET="<generate-a-secure-random-string>"
JWT_REFRESH_SECRET="<generate-a-different-secure-random-string>"

# Token Expiration
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS — comma-separated list of allowed frontend origins
FRONTEND_URL="https://yourdomain.com"

# Server
PORT=3000
NODE_ENV=production
```

> [!IMPORTANT]
> Never commit `.env` to version control. The JWT secrets in the repository are **development-only placeholders** and must be replaced with cryptographically random strings in production.

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Development only) Open Prisma Studio
npx prisma studio
```

### Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

---

## API Overview

All endpoints are prefixed with `/api`. Protected endpoints require a `Bearer <accessToken>` in the `Authorization` header.

| Module | Base Path | Description |
|---|---|---|
| **Auth** | `/api/auth` | Login, logout, refresh, profile, change password, nav menu |
| **HR** | `/api/employee` | Employee lifecycle with auto user + session creation |
| **Products** | `/api/products` | Product CRUD with category/subcategory hierarchy |
| **Configuration** | `/api/shop`, `/api/departments`, `/api/designation`, `/api/role`, `/api/warehouse` | Organization entities |
| **Transactions** | `/api/purchase`, `/api/invoice` | Purchase orders & sales invoices with line items |
| **Parties** | `/api/suppliers`, `/api/customers` | Supplier/customer management with dues & payments |
| **Inventory** | `/api/stock-summary`, `/api/shop-wise-products` | Stock tracking & shop-level product views |
| **Accounts** | `/api/expense`, `/api/shop-wise-commission-profit` | Expense tracking & profitability |
| **Dashboard** | `/api/dashboard` | Aggregated metrics, recent ops, stock overview |
| **Reports** | `/api/report/:type` | Parameterized report generation |
| **Permissions** | `/api/user-wise-permission` | Bulk user shop permission management |

For complete endpoint documentation with request/response examples, see [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

## API Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "statusCode": 401
}
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode (development) |
| `npm run start:debug` | Start in debug + watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled production build |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage report |

---

## Production Deployment

### Build

```bash
npm run build
```

This compiles TypeScript to the `dist/` directory with source maps.

### Environment Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (≥ 32 characters)
- [ ] `DATABASE_URL` pointing to production PostgreSQL with SSL
- [ ] `FRONTEND_URL` set to exact production origin(s) for CORS
- [ ] Run `npx prisma migrate deploy` before first start
- [ ] Configure reverse proxy (nginx/Caddy) with HTTPS termination

### Run

```bash
# Direct
node dist/main.js

# With process manager (recommended)
pm2 start dist/main.js --name emojud-api

# With Docker
docker build -t emojud-api .
docker run -p 3000:3000 --env-file .env emojud-api
```

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
