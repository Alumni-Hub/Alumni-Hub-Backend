# Alumni Hub Backend

A Strapi v5 headless CMS backend for managing engineering alumni data across multiple engineering fields.

## Overview

Alumni Hub Backend is a RESTful API server built with [Strapi v5](https://strapi.io/) that provides:
- Alumni (Batchmate) data management
- User authentication and role-based access control
- Notification system
- Media file uploads for photos

## Prerequisites

- **Node.js**: v20.0.0 - v24.x.x
- **npm**: v6.0.0 or higher
- **Database**: SQLite (development) or PostgreSQL (production)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ojitharajapaksha/Alumni-Hub-Backend.git
   cd Alumni-Hub-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=your-app-key-1,your-app-key-2
   API_TOKEN_SALT=your-api-token-salt
   ADMIN_JWT_SECRET=your-admin-jwt-secret
   TRANSFER_TOKEN_SALT=your-transfer-token-salt
   JWT_SECRET=your-jwt-secret
   
   # Database (PostgreSQL for production)
   DATABASE_CLIENT=postgres
   DATABASE_URL=your-database-url
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=strapi
   DATABASE_USERNAME=strapi
   DATABASE_PASSWORD=strapi
   DATABASE_SSL=false
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run develop
   
   # Production mode
   npm start
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run develop` | Start Strapi with auto-reload enabled |
| `npm run dev` | Alias for `npm run develop` |
| `npm run build` | Build the admin panel |
| `npm start` | Start Strapi in production mode |
| `npm run strapi` | Run Strapi CLI commands |
| `npm run upgrade` | Upgrade to the latest Strapi version |

## Database Configuration

The backend supports multiple database clients:

- **SQLite** (default for development)
- **PostgreSQL** (recommended for production)
- **MySQL**

Configuration is managed in `config/database.ts`.

---

## API Endpoints

Base URL: `http://localhost:1337/api`

### Authentication

Strapi provides built-in authentication endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/local` | Login with email/password |
| `POST` | `/auth/local/register` | Register a new user |
| `GET` | `/users/me` | Get current user info |

**Login Request:**
```json
POST /api/auth/local
{
  "identifier": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com"
  }
}
```

---

### Batchmates (Alumni)

Manage alumni/batchmate records.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/batchmates` | Get all batchmates | No |
| `GET` | `/batchmates/:id` | Get batchmate by ID | No |
| `POST` | `/batchmates` | Create a new batchmate | No |
| `PUT` | `/batchmates/:id` | Update a batchmate | No |
| `DELETE` | `/batchmates/:id` | Delete a batchmate | No |

#### Batchmate Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `callingName` | String | No | Preferred name |
| `fullName` | String | **Yes** | Full legal name |
| `nickName` | String | No | Nickname |
| `field` | Enum | **Yes** | Engineering field (see below) |
| `email` | Email | No | Email address |
| `whatsappMobile` | String | No | WhatsApp number |
| `mobile` | String | No | Mobile phone number |
| `address` | Text | No | Home address |
| `country` | String | No | Country of residence |
| `workingPlace` | String | No | Current workplace |
| `universityPhoto` | Media | No | Photo from university days |
| `currentPhoto` | Media | No | Current photo |

#### Engineering Fields (Enum Values)

- Computer Engineering
- Electrical Engineering
- Electronics Engineering
- Mechanical Engineering
- Civil Engineering
- Chemical Engineering
- Material Engineering
- Mining Engineering
- Textile Engineering
- Biomedical Engineering
- Industrial Engineering
- Environmental Engineering
- Aerospace Engineering
- Software Engineering
- Data Science
- Artificial Intelligence

#### Example Requests

**Get All Batchmates:**
```bash
GET /api/batchmates?populate=*
```

**Get Batchmates with Filters:**
```bash
GET /api/batchmates?filters[field][$eq]=Computer Engineering&filters[country][$eq]=Sri Lanka
```

**Create Batchmate:**
```json
POST /api/batchmates
{
  "data": {
    "fullName": "John Doe",
    "callingName": "John",
    "field": "Computer Engineering",
    "email": "john.doe@example.com",
    "whatsappMobile": "+94771234567",
    "country": "Sri Lanka",
    "workingPlace": "Tech Corp"
  }
}
```

**Update Batchmate:**
```json
PUT /api/batchmates/:id
{
  "data": {
    "workingPlace": "New Tech Corp",
    "country": "Singapore"
  }
}
```

**Delete Batchmate:**
```bash
DELETE /api/batchmates/:id
```

---

### User Management

Manage system users (admins).

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/user-management/all` | Get all users | No |
| `GET` | `/user-management/roles` | Get all roles | No |
| `GET` | `/user-management/:id` | Get user by ID | No |
| `POST` | `/user-management/create` | Create a new user | No |
| `PUT` | `/user-management/update/:id` | Update a user | No |
| `DELETE` | `/user-management/delete/:id` | Delete a user | No |

#### User Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | String | **Yes** | Username |
| `email` | Email | **Yes** | Email address |
| `password` | String | **Yes** | Password (for create) |
| `role` | Number | No | Role ID |
| `assignedField` | String | No | Assigned engineering field |
| `confirmed` | Boolean | No | Email confirmed status |
| `blocked` | Boolean | No | Account blocked status |

#### Example Requests

**Get All Users:**
```bash
GET /api/user-management/all
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "assignedField": null,
    "role": {
      "id": 1,
      "name": "Super Admin",
      "type": "super_admin"
    }
  }
]
```

**Get All Roles:**
```bash
GET /api/user-management/roles
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Super Admin",
    "description": "Full access to all features",
    "type": "super_admin"
  },
  {
    "id": 2,
    "name": "Field Admin",
    "description": "Access to assigned field only",
    "type": "field_admin"
  }
]
```

**Create User:**
```json
POST /api/user-management/create
{
  "username": "fieldadmin",
  "email": "fieldadmin@example.com",
  "password": "securePassword123",
  "role": 2,
  "assignedField": "Computer Engineering"
}
```

**Update User:**
```json
PUT /api/user-management/update/:id
{
  "username": "updatedUsername",
  "assignedField": "Electrical Engineering",
  "blocked": false
}
```

**Delete User:**
```bash
DELETE /api/user-management/delete/:id
```

---

### Notifications

System notifications for users.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | Get all notifications |
| `GET` | `/notifications/:id` | Get notification by ID |
| `POST` | `/notifications` | Create a notification |
| `PUT` | `/notifications/:id` | Update a notification |
| `DELETE` | `/notifications/:id` | Delete a notification |

#### Notification Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | Enum | **Yes** | `new_user`, `new_batchmate`, `update`, `system` |
| `title` | String | **Yes** | Notification title |
| `message` | Text | **Yes** | Notification message |
| `read` | Boolean | **Yes** | Read status (default: false) |
| `actionUrl` | String | No | URL for action button |
| `metadata` | JSON | No | Additional data |

#### Example Requests

**Get All Notifications:**
```bash
GET /api/notifications?sort=createdAt:desc
```

**Create Notification:**
```json
POST /api/notifications
{
  "data": {
    "type": "new_batchmate",
    "title": "New Alumni Added",
    "message": "John Doe from Computer Engineering has been added.",
    "read": false,
    "actionUrl": "/dashboard/batchmates/123"
  }
}
```

**Mark as Read:**
```json
PUT /api/notifications/:id
{
  "data": {
    "read": true
  }
}
```

---

### Media Upload

Upload photos for batchmates.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload a file |
| `GET` | `/upload/files` | Get all files |
| `GET` | `/upload/files/:id` | Get file by ID |
| `DELETE` | `/upload/files/:id` | Delete a file |

**Upload Request:**
```bash
POST /api/upload
Content-Type: multipart/form-data

files: <file>
ref: api::batchmate.batchmate
refId: <batchmate_id>
field: universityPhoto
```

---

## Project Structure

```
backend/
├── config/
│   ├── admin.ts          # Admin panel configuration
│   ├── api.ts            # API configuration
│   ├── database.ts       # Database configuration
│   ├── middlewares.ts    # Middleware configuration
│   ├── plugins.ts        # Plugin configuration
│   └── server.ts         # Server configuration
├── src/
│   ├── api/
│   │   ├── batchmate/    # Batchmate API
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── notification/ # Notification API
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   └── user-management/ # User Management API
│   │       ├── controllers/
│   │       └── routes/
│   └── extensions/       # Strapi extensions
├── public/
│   └── uploads/          # Uploaded files
├── database/
│   └── migrations/       # Database migrations
├── types/                # TypeScript types
├── package.json
├── tsconfig.json
└── .env
```

## Configuration

### Server Configuration (`config/server.ts`)
- Default port: `1337`
- Host: `0.0.0.0`

### CORS Settings
Configure allowed origins in `config/middlewares.ts` for production.

## Deployment

### Render.com
A `render.yaml` file is included for easy deployment to Render.

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
```
