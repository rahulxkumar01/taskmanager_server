# Team Task Manager

Full-stack web application for teams to manage projects and tasks with role-based access control (RBAC). Admins can oversee all activity while members focus on their assigned work.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, React Router 6, Axios |
| **Backend** | Node.js, Express 4 |
| **Database** | PostgreSQL (via `pg` pool) |
| **Auth** | JWT (`jsonwebtoken`), bcryptjs |
| **Validation** | express-validator |
| **Styling** | Plain CSS (no framework) |

---

## Features

### Authentication
- Signup with name, email, password
- Optional admin registration via secret key
- Login with JWT token (7-day expiry)
- Persistent session via `localStorage`
- Auto-redirect on expired/invalid tokens

### Projects
- Create projects with name and description
- List all projects you belong to
- View project details (members, tasks)
- Update / delete projects
- Creator auto-added as project admin

### Team Management
- Add members to a project by user ID
- Assign project-level roles (Admin / Member)
- Remove members from a project
- View member list per project
- Duplicate membership prevention

### Tasks
- Full CRUD per project
- Title, description, priority (Low / Medium / High)
- Status tracking: Pending → In Progress → Completed
- Due date with overdue detection
- Assign to any project member
- Auto-updates `updated_at` timestamp

### Dashboard
- Per-user task summary (total, pending, in-progress, completed counts)
- Overdue task alerts
- Recent activity (last 10 tasks)
- Project count
- Calendar view with monthly task filtering
- Admin-only: global stats, per-member task breakdown

### Admin Panel
- View all users with project/task counts
- Promote / demote users (Admin / Member)
- Delete users
- Admin secret key required at signup
- Self-role-change prevention
- Self-deletion prevention

### Search
- Global search across projects and tasks
- Case-insensitive matching (ILIKE)
- Admins search everything; members search only their projects/assigned tasks
- Results limited to 20 per category

### Database Auto-Schema Sync
- On every server start, `config/schema.js` reads and runs `migrations/001_initial.sql`
- Uses `CREATE TABLE IF NOT EXISTS` — completely safe on existing data
- No manual migration step needed for fresh databases

---

## Project Structure

```
team-task-manager/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar.jsx         # Monthly calendar view
│   │   │   ├── Layout.jsx           # App shell with navbar
│   │   │   └── Navbar.jsx           # Top navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state + login/signup/logout
│   │   ├── pages/
│   │   │   ├── Admin.jsx            # Admin panel (user mgmt)
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── ProjectDetail.jsx    # Single project view
│   │   │   ├── Projects.jsx         # Project list
│   │   │   ├── SearchResults.jsx    # Search results page
│   │   │   ├── Signup.jsx           # Registration form
│   │   │   └── Tasks.jsx            # All-tasks view
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + interceptors
│   │   ├── App.jsx                  # Route definitions
│   │   ├── index.css                # Global styles
│   │   ├── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                          # Express backend
    ├── config/
    │   ├── db.js                    # PostgreSQL connection pool
    │   └── schema.js                # Auto-schema sync on startup
    ├── controllers/
    │   ├── authController.js        # Signup, login, getMe
    │   ├── dashboardController.js   # Stats, calendar, admin stats
    │   ├── memberController.js      # Project member CRUD
    │   ├── projectController.js     # Project CRUD
    │   ├── searchController.js      # Global search
    │   └── taskController.js        # Task CRUD
    ├── middleware/
    │   └── auth.js                  # JWT authenticate + role authorize
    ├── migrations/
    │   ├── 001_initial.sql          # DDL for all tables
    │   ├── run.js                   # Standalone migration runner
    │   └── seed.js                  # Seeds admin user
    ├── routes/
    │   ├── auth.js                  # Auth endpoints
    │   ├── dashboard.js             # Dashboard + admin endpoints
    │   ├── projects.js              # Project + member endpoints
    │   ├── search.js                # Search endpoint
    │   └── tasks.js                 # Task endpoints
    ├── .env                         # Environment variables
    ├── index.js                     # Server entry point
    └── package.json
```

---

## Local Setup

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally (any version)

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd team-task-manager

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Database

Create a PostgreSQL database manually:

```bash
createdb team_task_manager
```

Or via `psql`:

```sql
CREATE DATABASE team_task_manager;
```

### 3. Configure Environment

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/team_task_manager
JWT_SECRET=your_jwt_secret_key_change_in_production
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated (optional) | `http://localhost:3000, http://localhost:5173` |
| `VITE_API_URL` | (Client) API base URL override for production | `''` (proxied in dev) |

### 4. Seed Admin User (Optional)

```bash
cd server
npm run seed
```

Creates an admin account:
- **Email:** `admin@example.com`
- **Password:** `admin123`

### 5. Start the Application

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 - Frontend (http://localhost:3000)
cd client
npm run dev
```

> On first startup, the server **automatically syncs the database schema** — no manual migration step needed.

---

## Scripts

### Server (`server/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node index.js` | Production start |
| `dev` | `nodemon index.js` | Development with auto-restart |
| `migrate` | `node migrations/run.js` | Run SQL migration standalone |
| `seed` | `node migrations/seed.js` | Seed admin user |

### Client (`client/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Dev server (port 3000, proxies `/api` → `:5000`) |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview production build locally |

---

## API Reference

All endpoints except `/api/auth/signup` and `/api/auth/login` require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |
| GET | `/api/health` | — | Health check |

#### POST `/api/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "member",
  "adminSecret": "Rahul@123"  // required only if role = "admin"
}
```

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/projects` | JWT | Create a project |
| GET | `/api/projects` | JWT | List my projects |
| GET | `/api/projects/:id` | JWT | Get project details |
| PUT | `/api/projects/:id` | JWT | Update project |
| DELETE | `/api/projects/:id` | JWT | Delete project |

### Project Members

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects/:projectId/members` | JWT | List project members |
| POST | `/api/projects/:projectId/members` | JWT | Add a member |
| DELETE | `/api/projects/:projectId/members/:memberId` | JWT | Remove a member |

#### POST `/api/projects/:projectId/members`

```json
{
  "userId": 2,
  "role": "member"
}
```

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks/project/:projectId` | JWT | Create task in project |
| GET | `/api/tasks/project/:projectId` | JWT | List project tasks |
| PUT | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |

#### POST `/api/tasks/project/:projectId`

```json
{
  "title": "Design landing page",
  "description": "Create mockups for the homepage",
  "priority": "high",
  "due_date": "2026-06-01",
  "assigned_to": 3
}
```

#### Updatable task fields (PUT)

Any combination of: `title`, `description`, `status`, `priority`, `due_date`, `assigned_to`.

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | JWT | User dashboard stats |
| GET | `/api/dashboard/users` | JWT | List all users (with counts) |
| GET | `/api/dashboard/calendar` | JWT | Calendar tasks by month |
| GET | `/api/dashboard/admin/stats` | Admin | Global platform stats |
| GET | `/api/dashboard/admin/member-tasks` | Admin | Per-member task breakdown |
| PUT | `/api/dashboard/admin/users/:id/role` | Admin | Change user role |
| DELETE | `/api/dashboard/admin/users/:id` | Admin | Delete a user |

#### GET `/api/dashboard/calendar?month=5&year=2026`

Returns tasks with `due_date` in the given month. Members see only their assigned tasks; admins see all project tasks.

### Search

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/search?q=keyword` | JWT | Search projects and tasks |

---

## Database Schema

### `users`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `name` | `VARCHAR(100)` | `NOT NULL` |
| `email` | `VARCHAR(255)` | `UNIQUE NOT NULL` |
| `password` | `VARCHAR(255)` | `NOT NULL` |
| `role` | `VARCHAR(10)` | `DEFAULT 'member'`, CHECK `'admin' | 'member'` |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |

### `projects`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `name` | `VARCHAR(200)` | `NOT NULL` |
| `description` | `TEXT` | |
| `created_by` | `INTEGER` | `REFERENCES users(id) ON DELETE SET NULL` |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |

### `project_members`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `project_id` | `INTEGER` | `REFERENCES projects(id) ON DELETE CASCADE` |
| `user_id` | `INTEGER` | `REFERENCES users(id) ON DELETE CASCADE` |
| `role` | `VARCHAR(10)` | `DEFAULT 'member'`, CHECK `'admin' | 'member'` |
| | | `UNIQUE(project_id, user_id)` |

### `tasks`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `title` | `VARCHAR(300)` | `NOT NULL` |
| `description` | `TEXT` | |
| `status` | `VARCHAR(20)` | `DEFAULT 'pending'`, CHECK `'pending' \| 'in_progress' \| 'completed'` |
| `priority` | `VARCHAR(10)` | `DEFAULT 'medium'`, CHECK `'low' \| 'medium' \| 'high'` |
| `due_date` | `DATE` | |
| `project_id` | `INTEGER` | `REFERENCES projects(id) ON DELETE CASCADE` |
| `assigned_to` | `INTEGER` | `REFERENCES users(id) ON DELETE SET NULL` |
| `created_by` | `INTEGER` | `REFERENCES users(id) ON DELETE SET NULL` |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` |

---

## Authentication & Authorization

### Flow

1. User signs up or logs in → server returns `{ user, token }`
2. Token is stored in `localStorage` by the client
3. Every API request includes `Authorization: Bearer <token>`
4. The `authenticate` middleware decodes the JWT, loads the user from DB, and attaches `req.user`
5. The `authorize` middleware checks `req.user.role` against allowed roles

### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Access everything: all projects, tasks, global stats, user management |
| **Member** | Own projects (via membership), own assigned tasks only |

### Admin Secret

When signing up as `admin`, a hardcoded admin secret key (`Rahul@123`) is required to prevent unauthorized admin registrations. Change this in `controllers/authController.js` for production.

---

## Deployment (Railway)

### Prerequisites

- Code pushed to a GitHub repository

### Steps

1. Go to [railway.app](https://railway.app) and create a new project
2. Add a **PostgreSQL** database service (Railway provides the connection string)
3. Add a **backend service**:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables:
     - `DATABASE_URL` — from Railway Postgres
     - `JWT_SECRET` — a strong random string
     - `FRONTEND_URL` — your frontend domain
4. Add a **frontend service**:
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Start command: `npx serve dist`
   - Environment variables:
     - `VITE_API_URL` — your backend domain (e.g. `https://backend.up.railway.app`)

> The auto-schema sync runs on every server start, so no manual migration step on Railway.

---

## License

MIT
