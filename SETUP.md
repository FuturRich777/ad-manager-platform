# Ad Manager Platform - Setup & Getting Started

## ✅ What We've Built (Phase 1 Complete)

### Foundation Setup
- ✅ **Project Structure**: Monorepo with backend (Express) and frontend (React) workspaces
- ✅ **Database Schema**: Complete Prisma schema with 13 models for comprehensive ad management
- ✅ **Authentication**: JWT-based auth system with signup/login/logout
- ✅ **Client Management**: Full CRUD operations for managing multiple clients
- ✅ **Dashboard UI**: Modern React UI with Tailwind CSS, navigation, and layout
- ✅ **Type Safety**: TypeScript throughout frontend and backend

### Database Models
```
User → UserClient → Client → PlatformAccount
                            ↓
                          Campaign → Ad → AdMetric
                          
ClientAssets: ContentAsset, ScheduledJob, AuditLog
```

### API Endpoints Ready
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/clients` - List user's clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get specific client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Docker & Docker Compose (for PostgreSQL + Redis)
- Git

### Step 1: Install Dependencies

```bash
cd /Volumes/One\ Touch
npm install
```

This will install both backend and frontend dependencies (npm workspaces).

### Step 2: Start Database & Redis

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379

### Step 3: Configure Environment

**Backend:**
```bash
cp backend/.env.example backend/.env
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

### Step 4: Initialize Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

This:
- Creates database tables
- Generates Prisma client

### Step 5: Start Development Servers

**Open 2 terminals:**

```bash
# Terminal 1 - Backend (runs on http://localhost:5000)
npm run dev --workspace=backend
```

```bash
# Terminal 2 - Frontend (runs on http://localhost:3000)
npm run dev --workspace=frontend
```

---

## 🧪 Testing the System

### Test API Endpoints

1. **Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Create Client**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1234567890"
  }'
```

### Test Frontend

1. Open http://localhost:3000
2. You'll see the dashboard with:
   - Sidebar navigation
   - Sample stats
   - Mock data for campaigns, analytics, and clients

---

## 📊 Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── auth/          (JWT, password hashing, routes)
│   │   ├── clients/       (Client management routes)
│   │   ├── middleware/    (Auth, error handling)
│   │   ├── types/         (TypeScript definitions)
│   │   └── index.ts       (Express app)
│   ├── prisma/
│   │   └── schema.prisma  (Database models)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    (Layout, UI components)
│   │   ├── pages/         (Dashboard, Campaigns, Analytics, etc.)
│   │   ├── api/           (API client - to be built)
│   │   ├── store/         (State management - to be built)
│   │   └── App.tsx        (Main app)
│   └── package.json
│
└── docker-compose.yml     (PostgreSQL + Redis)
```

---

## 🔗 Next Steps (Phase 2 & Beyond)

### Phase 2: Platform Integrations
- [ ] Facebook Graph API integration
- [ ] Google Ads API integration
- [ ] LinkedIn Campaign Manager API
- [ ] OAuth flows for each platform
- [ ] Encrypted credential storage

### Phase 3: Campaign Management
- [ ] Campaign CRUD endpoints
- [ ] Ad creation and scheduling
- [ ] Bulk ad operations
- [ ] Scheduler/Job queue setup

### Phase 4: Analytics
- [ ] Metrics aggregation from platforms
- [ ] Analytics dashboard charts
- [ ] Report generation
- [ ] Export functionality

### Phase 5: Advanced Features
- [ ] Client management workflows
- [ ] Approval pipelines
- [ ] Multi-user collaboration
- [ ] AI-powered content generation

---

## 🛠️ Development Notes

### Database Migrations

After modifying `schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

### Reset Database (if needed)

```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
```

### View Database (Prisma Studio)

```bash
cd backend
npx prisma studio  # Opens http://localhost:5555
```

### Running Tests

```bash
npm run test --workspaces
```

### Building for Production

```bash
npm run build --workspaces

# Backend
npm run start --workspace=backend

# Frontend
npm run build --workspace=frontend
# Then serve the build/ folder
```

---

## 🔐 Security Notes

- JWT secret is in `.env` - change it in production
- Passwords are hashed with bcrypt (10 rounds)
- All API routes are protected with JWT middleware
- Database credentials should be changed from defaults
- CORS is enabled for development - configure for production

---

## 📞 Support

For issues or questions:
1. Check the README.md for overview
2. Review type definitions in `backend/src/types/index.ts`
3. Check database schema in `backend/prisma/schema.prisma`
4. Review auth implementation in `backend/src/auth/`

---

**Status**: Phase 1 (Foundation) ✅ Complete
**Ready for**: Phase 2 (Platform Integrations)
**Next Milestone**: Facebook + Google Ads integration with OAuth
