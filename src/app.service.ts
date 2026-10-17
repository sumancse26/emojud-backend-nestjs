import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealthStatus() {
    return {
      status: 'operational',
      service: 'Emojud Backend REST API',
      version: '1.0.0',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database: {
        provider: 'NeonDB PostgreSQL (Serverless)',
        configured: Boolean(process.env.DATABASE_URL),
        pooler: Boolean(
          process.env.DATABASE_URL &&
            process.env.DATABASE_URL.includes('-pooler'),
        ),
      },
      cors_configured: Boolean(
        process.env.FRONTEND_URL || process.env.CORS_ORIGIN,
      ),
    };
  }

  getWelcomeData() {
    return {
      name: 'Emojud Enterprise Engine API',
      description:
        'Robust multi-tenant enterprise backend built with NestJS 11, Prisma 7, and PostgreSQL.',
      version: '1.0.0',
      status: 'online',
      portal_url: '/',
      health_check: '/health',
      documentation_url: '/api_docs',
      public_endpoints: [
        { method: 'GET', path: '/', description: 'Interactive Welcome Portal' },
        { method: 'GET', path: '/health', description: 'Real-time System Health' },
        { method: 'GET', path: '/welcome', description: 'Public API Metadata JSON' },
        { method: 'POST', path: '/api/auth/login', description: 'User Authentication' },
        { method: 'POST', path: '/api/auth/refresh', description: 'Token Refresh' },
      ],
      protected_modules: [
        { prefix: '/api/dashboard', description: 'Analytics & Management KPIs' },
        { prefix: '/api/products', description: 'Catalog, Barcodes & Pricing' },
        { prefix: '/api/inventory', description: 'Stock, Lots & Warehouses' },
        { prefix: '/api/accounts', description: 'Invoices, Expenses & Ledgers' },
        { prefix: '/api/hr', description: 'Employees, Payroll & Departments' },
        { prefix: '/api/reports', description: 'Business Intelligence & Summaries' },
      ],
    };
  }

  getWelcomeHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emojud API • Enterprise Backend Engine</title>
  <meta name="description" content="Emojud Enterprise Management System API powered by NestJS 11, NeonDB PostgreSQL, and Vercel Serverless.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090e;
      --card-bg: rgba(15, 23, 42, 0.65);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-border-hover: rgba(99, 102, 241, 0.4);
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.25);
      --accent: #06b6d4;
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.2);
      --amber: #f59e0b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.6;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }

    /* Header Nav */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 48px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: var(--text-main);
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px var(--primary-glow);
    }

    .brand-icon svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: white;
      stroke-width: 2.2;
    }

    .brand-text h1 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .brand-text span {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: #34d399;
      box-shadow: 0 0 20px var(--emerald-glow);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* Hero Section */
    .hero {
      text-align: center;
      max-width: 820px;
      margin: 0 auto 56px;
    }

    .hero-tag {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: linear-gradient(90deg, #818cf8, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 20px;
      background: linear-gradient(180deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      margin-bottom: 32px;
      font-weight: 400;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      box-shadow: 0 4px 20px var(--primary-glow);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(8px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Architecture Grid */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 56px;
    }

    .tech-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .tech-card:hover {
      border-color: var(--card-border-hover);
      transform: translateY(-4px);
    }

    .tech-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .tech-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .tech-icon.nest { background: rgba(224, 35, 78, 0.15); color: #ea284e; }
    .tech-icon.neon { background: rgba(0, 229, 153, 0.15); color: #00e599; }
    .tech-icon.vercel { background: rgba(255, 255, 255, 0.15); color: #ffffff; }
    .tech-icon.jwt { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }

    .tech-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 6px;
    }

    .tech-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Live Interactive Console */
    .console-section {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(16px);
      margin-bottom: 56px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .console-title {
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .console-body {
      background: #04060a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      max-height: 280px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Routes Directory */
    .section-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .section-desc {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 24px;
    }

    .routes-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 56px;
    }

    .routes-table th {
      background: rgba(255, 255, 255, 0.02);
      padding: 14px 20px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      border-bottom: 1px solid var(--card-border);
    }

    .routes-table td {
      padding: 16px 20px;
      font-size: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .routes-table tr:last-child td {
      border-bottom: none;
    }

    .method {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
    }

    .method.get { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .method.post { background: rgba(52, 211, 153, 0.15); color: #34d399; }
    .method.put { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .method.delete { background: rgba(248, 113, 113, 0.15); color: #f87171; }

    .route-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #e2e8f0;
      font-weight: 500;
    }

    .badge-auth {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge-auth.public {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .badge-auth.protected {
      background: rgba(139, 92, 246, 0.12);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.25);
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--card-border);
      padding-top: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 13px;
      color: var(--text-dim);
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      margin-left: 20px;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--text-main);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title { font-size: 32px; }
      .container { padding: 24px 16px 48px; }
      .routes-table { display: block; overflow-x: auto; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <a href="/" class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="brand-text">
          <h1>Emojud Backend</h1>
          <span>Enterprise API Engine</span>
        </div>
      </a>
      <div class="status-badge">
        <div class="pulse-dot"></div>
        <span>Operational • Live</span>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-tag">Cloud Native Architecture</div>
      <h2 class="hero-title">High-Performance ERP & Management Engine</h2>
      <p class="hero-subtitle">
        Deployed seamlessly on Vercel Serverless Functions with NeonDB PostgreSQL Connection Pooling and NestJS 11.
      </p>
      <div class="hero-actions">
        <button id="pingBtn" class="btn btn-primary" onclick="pingHealth()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Test Live API Ping
        </button>
        <button class="btn btn-secondary" onclick="copyCurl()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span id="curlBtnText">Copy cURL</span>
        </button>
      </div>
    </section>

    <!-- Architecture Grid -->
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-card-header">
          <div class="tech-icon nest">⚡</div>
          <span class="badge-auth public">v11.0.1</span>
        </div>
        <div class="tech-title">NestJS Platform</div>
        <div class="tech-desc">Enterprise TypeScript backend with dependency injection, global interceptors, and strict typing.</div>
      </div>

      <div class="tech-card">
        <div class="tech-card-header">
          <div class="tech-icon neon">🐘</div>
          <span class="badge-auth public">Serverless</span>
        </div>
        <div class="tech-title">NeonDB Database</div>
        <div class="tech-desc">Managed serverless PostgreSQL with high-concurrency connection pooling via Prisma 7 PG Adapter.</div>
      </div>

      <div class="tech-card">
        <div class="tech-card-header">
          <div class="tech-icon vercel">▲</div>
          <span class="badge-auth public">Edge</span>
        </div>
        <div class="tech-title">Vercel Serverless</div>
        <div class="tech-desc">Distributed edge deployment with optimized serverless function invocation and zero cold-start waste.</div>
      </div>

      <div class="tech-card">
        <div class="tech-card-header">
          <div class="tech-icon jwt">🛡️</div>
          <span class="badge-auth protected">HS256</span>
        </div>
        <div class="tech-title">Security & Guard</div>
        <div class="tech-desc">Granular RBAC authorization with secure Bearer JWT tokens and cookie session state management.</div>
      </div>
    </div>

    <!-- Live Console Ping -->
    <div class="console-section">
      <div class="console-header">
        <div class="console-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          Live Endpoint Inspector: <span style="color:#a5b4fc; font-weight:600;">GET /health</span>
        </div>
        <span id="pingLatency" style="font-size:12px; font-weight:600; color:var(--text-dim); font-family:'JetBrains Mono';">Ready to query</span>
      </div>
      <div id="consoleOutput" class="console-body">// Press "Test Live API Ping" above to inspect real-time response</div>
    </div>

    <!-- API Directory -->
    <div class="section-title">API Endpoint Directory</div>
    <div class="section-desc">Key available services, route paths, and authentication requirements.</div>

    <table class="routes-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Access</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/</td>
          <td><span class="badge-auth public">Public</span></td>
          <td>Web Portal & Interactive Welcome Interface</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/health</td>
          <td><span class="badge-auth public">Public</span></td>
          <td>System Health, Uptime & Database Connectivity Diagnostics</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/welcome</td>
          <td><span class="badge-auth public">Public</span></td>
          <td>Public Metadata & API Service Directory (JSON)</td>
        </tr>
        <tr>
          <td><span class="method post">POST</span></td>
          <td class="route-path">/api/auth/login</td>
          <td><span class="badge-auth public">Public</span></td>
          <td>User Sign-in with username/password & Bearer token generation</td>
        </tr>
        <tr>
          <td><span class="method post">POST</span></td>
          <td class="route-path">/api/auth/refresh</td>
          <td><span class="badge-auth public">Public</span></td>
          <td>Refresh expired session credentials via refresh token</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/api/dashboard</td>
          <td><span class="badge-auth protected">Bearer Token</span></td>
          <td>Executive overview, business KPIs & real-time revenue stats</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/api/products</td>
          <td><span class="badge-auth protected">Bearer Token</span></td>
          <td>Product registry, stock lots, categories & barcodes</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/api/inventory</td>
          <td><span class="badge-auth protected">Bearer Token</span></td>
          <td>Warehouse distribution, current stock levels & lot tracing</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/api/accounts</td>
          <td><span class="badge-auth protected">Bearer Token</span></td>
          <td>Invoices, customer balances, purchases & expense tracking</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td class="route-path">/api/hr</td>
          <td><span class="badge-auth protected">Bearer Token</span></td>
          <td>Staff directories, departments, payroll & designations</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer -->
    <footer>
      <div>&copy; 2026 Emojud System Inc. All rights reserved.</div>
      <div class="footer-links">
        <a href="/health">Health Check</a>
        <a href="/welcome">Metadata JSON</a>
        <a href="https://github.com/sumancse26/emojud-backend-nestjs" target="_blank" rel="noopener">GitHub Repository</a>
      </div>
    </footer>
  </div>

  <script>
    async function pingHealth() {
      const output = document.getElementById('consoleOutput');
      const latencyBadge = document.getElementById('pingLatency');
      const startTime = performance.now();
      
      output.textContent = '// Sending request to /health...';
      latencyBadge.textContent = 'Querying...';
      latencyBadge.style.color = '#38bdf8';

      try {
        const res = await fetch('/health');
        const elapsed = Math.round(performance.now() - startTime);
        const data = await res.json();
        
        output.textContent = JSON.stringify(data, null, 2);
        latencyBadge.textContent = 'HTTP ' + res.status + ' • ' + elapsed + 'ms';
        latencyBadge.style.color = res.ok ? '#34d399' : '#f87171';
      } catch (err) {
        output.textContent = '// Request failed:\\n' + err.message;
        latencyBadge.textContent = 'Connection Error';
        latencyBadge.style.color = '#f87171';
      }
    }

    function copyCurl() {
      const curl = 'curl -X GET ' + window.location.origin + '/health';
      navigator.clipboard.writeText(curl).then(() => {
        const textSpan = document.getElementById('curlBtnText');
        textSpan.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          textSpan.textContent = 'Copy cURL';
        }, 2000);
      });
    }

    // Auto-ping once on load to show fresh status
    window.addEventListener('DOMContentLoaded', () => {
      pingHealth();
    });
  </script>
</body>
</html>`;
  }
}
