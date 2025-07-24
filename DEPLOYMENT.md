# Vercel Deployment Guide for MANDLAC-X

This guide will help you deploy your Next.js CCTV monitoring application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - You'll need a PostgreSQL database (SQLite doesn't work on Vercel)

## Database Setup (Required)

Since Vercel is serverless, you need to replace SQLite with PostgreSQL. Here are recommended options:

### Option 1: Neon (Recommended - Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

### Option 2: Supabase (Alternative)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string

### Option 3: PlanetScale (Alternative)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a free account
3. Create a new database
4. Copy the connection string

## Step-by-Step Deployment

### 1. Update Prisma Schema for PostgreSQL

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}

// Rest of your models remain the same
```

### 2. Create GitHub Repository

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Navendu07/cctv-dashboard-app.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (leave as default)

### 4. Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
DATABASE_URL=your-postgresql-connection-string-here
```

### 5. Run Database Migration

After deployment, you need to set up your database:

```bash
# Clone your deployed project locally
git clone https://github.com/yourusername/mandlac-x.git
cd mandlac-x

# Install dependencies
npm install

# Set your DATABASE_URL in .env
echo "DATABASE_URL=your-postgresql-connection-string" > .env

# Run migrations
npx prisma migrate deploy

# Seed the database
npm run db:seed
```

### 6. Redeploy

Push any final changes to trigger a redeployment:

```bash
git add .
git commit -m "Update for production"
git push
```

## Important Notes

### Security
- Never commit your `.env` file
- Use Vercel's environment variables for production
- Your database connection string contains sensitive information

### Database Considerations
- PostgreSQL syntax is slightly different from SQLite
- Your existing data will need to be migrated manually
- Consider using database connection pooling for production

### Monitoring
- Use Vercel's analytics to monitor performance
- Set up error tracking (Sentry recommended)
- Monitor database connection limits

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your DATABASE_URL is correct
   - Ensure the database is accessible from Vercel
   - Check if you need to whitelist Vercel's IP ranges

2. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify TypeScript has no errors
   - Ensure Prisma client is generated during build

3. **API Routes Not Working**
   - Verify your API routes are in the correct `/app/api/` structure
   - Check that environment variables are set in Vercel

## Alternative: Download and Deploy Manually

If you prefer to download the code and deploy manually:

1. Download the project as ZIP
2. Extract and push to your own GitHub repository
3. Follow the steps above starting from step 3

## Support

For deployment issues:
- Check Vercel's documentation: [vercel.com/docs](https://vercel.com/docs)
- Review Next.js deployment guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Database provider documentation for connection issues
