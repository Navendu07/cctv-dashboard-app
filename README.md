# MANDLAC-X | CCTV Monitoring System

A professional CCTV monitoring and incident management system built with Next.js 15, featuring real-time incident tracking, camera management, and comprehensive security monitoring.

## 🚀 Features

### Core Functionality
- **Real-time Incident Monitoring** - Track and manage security incidents as they occur
- **Multi-camera Support** - Monitor up to 3 CCTV feeds simultaneously  
- **AI-powered Detection** - Automated detection of unauthorized access, threats, and suspicious activity
- **Incident Resolution Workflow** - Complete incident lifecycle management
- **Professional Dashboard** - Clean, intuitive interface for security personnel

### Technical Features
- **Next.js 15 App Router** - Modern React framework with server components
- **Prisma ORM** - Type-safe database operations
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Modern, responsive styling
- **Real-time Updates** - Live incident status updates
- **Optimistic UI** - Smooth user interactions with instant feedback

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 18** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma** ORM for database operations
- **PostgreSQL** (production) / SQLite (development)
- **RESTful API** design

### Database Schema
- **Cameras** - Camera configuration and status
- **Incidents** - Security incident records with full lifecycle tracking

## 🎯 Mandatory Deliverables (Technical Assessment)

This project implements all required technical assessment deliverables:

### ✅ Data Model
- **Camera**: `id`, `name`, `location`
- **Incident**: `id`, `cameraId → Camera`, `type`, `tsStart`, `tsEnd`, `thumbnailUrl`, `resolved`

### ✅ API Routes
- `GET /api/incidents?resolved=false` - Fetch unresolved incidents (newest first)
- `PATCH /api/incidents/:id/resolve` - Toggle incident resolution status

### ✅ Frontend Components
- **Incident Player** (Left) - Video playback with camera controls and incident details
- **Incident List** (Right) - Scrollable list with resolve functionality and optimistic UI
- **Camera Thumbnails** - Additional camera views for comprehensive monitoring

### ✅ Database
- Production-ready PostgreSQL schema
- Comprehensive seed data with realistic incident scenarios
- 24-hour timestamp coverage across multiple threat types

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (production) or SQLite (development)

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/mandlac-x.git
cd mandlac-x

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```bash
DATABASE_URL="your-database-connection-string"
```

## 🚀 Deployment

Ready for deployment on **Vercel**, **Netlify**, or any Node.js hosting platform.

### Quick Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set `DATABASE_URL` environment variable
4. Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Performance

- **Server-side Rendering** for optimal SEO and performance
- **Optimistic UI Updates** for smooth user experience
- **Efficient Database Queries** with Prisma optimization
- **Responsive Design** for desktop and mobile devices

## 🔒 Security Features

- **Role-based Access Control** ready for implementation
- **Secure API Routes** with proper error handling
- **Input Validation** and sanitization
- **Professional Security Workflows**

## 🎨 Design System

- **Professional Dark Theme** optimized for security monitoring
- **MANDLAC Brand Identity** with consistent styling
- **Responsive Layout** that works on all screen sizes
- **Accessibility-first** component design

## 📖 API Documentation

### Incidents API
- `GET /api/incidents` - List all incidents with filtering
- `GET /api/incidents?resolved=false` - Get unresolved incidents  
- `PATCH /api/incidents/:id/resolve` - Toggle incident resolution

### Cameras API
- `GET /api/cameras` - List all configured cameras

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📝 License

This project is part of a technical assessment for SecureSight CCTV monitoring systems.

## 🤝 Contributing

This is a technical assessment project. For production use, consider:
- Adding comprehensive test coverage
- Implementing authentication and authorization
- Adding real-time WebSocket connections
- Integrating with actual CCTV camera systems
- Adding comprehensive logging and monitoring

---

**Built with Next.js 15 | Deployed on Vercel | Monitored with Pride**
