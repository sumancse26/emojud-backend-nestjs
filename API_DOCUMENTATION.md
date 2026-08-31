# Emojud Backend API Documentation

This document outlines the complete REST API endpoints, authentication mechanisms, request/response formats, and parameters available in the application.

---

## 1. Authentication & Authorization

### Overview
- **Global Auth Guard**: All endpoints require a `Bearer <access_token>` in the `Authorization` header by default, unless marked as `@Public()`.
- **JWT Tokens**:
  - `accessToken`: Short-lived token stored in memory by client.
  - `refreshToken`: Long-lived token sent as HTTP-only cookie (`refresh_token`) or request body.

---

## 2. Auth Module (`/api/auth`)

### 2.1 Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```
- **Response**: `200 OK` (Sets HTTP-only `refresh_token` cookie)
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### 2.2 Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Access**: Public
- **Cookie / Body**: `refreshToken` (read from cookie or body fallback)
- **Response**: `200 OK` (Rotates session and sets new cookie)
```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### 2.3 Logout
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Authenticated (Bearer token)
- **Response**: `200 OK` (Invalidates session and clears cookie)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2.4 User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Access**: Authenticated
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "admin",
    "status": 1,
    "employee": {
      "id": "1",
      "employee_code": "EMP001",
      "full_name": "Admin User",
      "email": "admin@example.com",
      "department": { "id": 1, "department_name": "Management" },
      "designation": { "id": 1, "designation_name": "Manager" }
    },
    "userRoles": [...],
    "userShopPermissions": [...]
  }
}
```

### 2.5 Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Access**: Authenticated (Requires valid refresh token cookie)
- **Request Body**:
```json
{
  "old_password": "current_password",
  "new_password": "new_password"
}
```

### 2.6 Navigation Menu
- **Endpoint**: `GET /api/auth/nav-menu/:userId/:roleId`
- **Access**: Authenticated
- **Response**: `200 OK` (Hierarchical tree of features/menu items)

---

## 3. HR Module (`/api/employee`)

### 3.1 Create Employee
- **Endpoint**: `POST /api/employee/create`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "employee_code": "EMP-001",
  "full_name": "John Doe",
  "phone": "01700000000",
  "email": "john@example.com",
  "address": "Dhaka, Bangladesh",
  "join_date": "2026-01-01",
  "department_id": 1,
  "designation_id": 1,
  "gender": 1,
  "blood_group": 1,
  "nid": "1234567890",
  "basic_salary": 50000,
  "username": "johndoe",
  "password": "password123",
  "default_role_id": 2,
  "company_id": 1
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Employee, user, and session created successfully",
  "data": {
    "employee": { ... },
    "user": { ... },
    "session": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

## 4. Catalog Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List / search products (supports query parameters) |
| `POST` | `/api/products` | Create or update product |
| `GET` | `/api/product-category` | Get root product categories |
| `GET` | `/api/product-subcategory/:id` | Get subcategories by parent category ID |
| `GET` | `/api/product-category-subcategory` | List categories and subcategories |
| `POST` | `/api/product-category-subcategory` | Create category / subcategory |
| `GET` | `/api/lookup/:id` | Lookup metadata by ID |

---

## 5. Organization Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shop` | List shops |
| `GET` | `/api/user-wise-shop` | Get user-wise shop permissions |
| `GET` | `/api/departments` | List departments |
| `POST` | `/api/departments` | Create department |
| `GET` | `/api/designation` | List designations |
| `POST` | `/api/designation` | Create designation |
| `GET` | `/api/role` | List roles |
| `POST` | `/api/role` | Create role |
| `GET` | `/api/warehouse` | List warehouses |
| `POST` | `/api/warehouse` | Create warehouse |

---

## 6. Transactions Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/purchase` | List purchase records |
| `GET` | `/api/purchase/:id` | Get purchase details with item breakdown |
| `POST` | `/api/purchase` | Create purchase master with item details |
| `GET` | `/api/invoice` | List sales invoices |
| `GET` | `/api/invoice/:id` | Get invoice details with item breakdown |
| `POST` | `/api/invoice` | Create invoice master with item details |

---

## 7. Parties Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/suppliers` | List suppliers |
| `GET` | `/api/suppliers/:phone` | Find supplier by phone number |
| `POST` | `/api/suppliers` | Create supplier |
| `GET` | `/api/customers` | List customers |
| `GET` | `/api/customers/:phone` | Find customer by phone number |
| `POST` | `/api/customers` | Create customer |
| `GET` | `/api/customer-due` | List customer due records |
| `GET` | `/api/customer-due/pending` | Get customer due records with positive balance |
| `POST` | `/api/customer-due` | Record customer due |
| `GET` | `/api/supplier-payment` | List supplier payments |
| `GET` | `/api/supplier-payment/due` | Get supplier due records |
| `POST` | `/api/supplier-payment` | Record supplier payment |

---

## 8. Operations Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stock-summary` | List stock summary master records |
| `GET` | `/api/stock-summary/:id` | Get stock summary details with breakdown |
| `GET` | `/api/shop-wise-products` | List shop-wise products |
| `GET` | `/api/shop-wise-commission-profit` | List commission & profit records |
| `POST` | `/api/shop-wise-commission-profit` | Create commission & profit record |
| `GET` | `/api/expense` | List expense master records |
| `GET` | `/api/expense/:id` | Get expense details by ID |
| `POST` | `/api/expense` | Create expense master with details |

---

## 9. Permissions Module (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user-wise-permission` | List user shop permissions |
| `POST` | `/api/user-wise-permission` | Bulk save user permissions array (`{ data: [...] }`) |

---

## 10. Dashboard Module (`/api/dashboard`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Main dashboard summary metrics |
| `GET` | `/api/dashboard/recent-operations` | Recent operations feed |
| `GET` | `/api/dashboard/overview` | High-level sales/invoice overview |
| `GET` | `/api/dashboard/stock-overview` | Real-time stock overview |

---

## 11. Reports Module (`/api/report`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/report/:type` | Generate report by type (e.g. `sales`, `stock`, `purchase`) |
