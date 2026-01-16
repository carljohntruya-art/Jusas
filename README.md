# 🧃 JUSAS - Tropical Smoothie E-commerce

## 🌴 Overview

JUSAS is a modern tropical smoothie e-commerce website designed for young youths and diet-aware enthusiasts. The platform features a complete shopping experience with user authentication, product management, and order processing.

## 🚀 Live Demo

- **Website:** https://jusas.vercel.app
- **API:** https://jusas.vercel.app/api
- **Admin Demo:** https://jusas.vercel.app/admin

## 👥 Test Accounts

| Role     | Email                | Password  |
| -------- | -------------------- | --------- |
| Customer | user@smoothie.local  | User123!  |
| Admin    | admin@smoothie.local | Admin123! |

## 🏗️ Tech Stack

### Frontend

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- Axios for API calls

### Backend

- Node.js with Express
- Prisma ORM for database
- JWT for authentication
- PostgreSQL database

### Deployment

- Vercel for hosting
- Vercel Postgres for database
- GitHub for version control

## 📁 Project Structure

```
jusas/
├── frontend/           # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Node.js backend API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── docs/              # Documentation
├── scripts/           # Deployment scripts
└── package.json       # Root package.json (monorepo)
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/carljohntruya-art/Jusas.git
cd Jusas

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local

# Edit .env.local files with your configuration

# Set up database
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development servers
npm run dev
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: http://localhost:5555

## 📚 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)

## 🔧 Scripts

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run install:all` - Install all dependencies

## 📈 Features

- ✅ User authentication and authorization
- ✅ Product catalog with search and filter
- ✅ Shopping cart with guest/user support
- ✅ Checkout with GCash and COD payment
- ✅ Order tracking and history
- ✅ Admin dashboard for product/order management
- ✅ Real-time notifications
- ✅ Mobile-responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨💻 Author

**Carl Johntruya Art**

- GitHub: [@carljohntruya-art](https://github.com/carljohntruya-art)
- Project: [JUSAS](https://jusas.vercel.app)

## 🙏 Acknowledgments

- Icons from Lucide React
- Images from Unsplash
- Design inspiration from modern e-commerce platforms
