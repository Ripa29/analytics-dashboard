📊 Analytics Dashboard
A fully functional analytics dashboard with comprehensive role-based access control (RBAC), real-time data visualization, and complete CRUD operations. Built with Next.js 14, TypeScript, and modern web technologies.

✨ Live Demo

Deployed Link: https://analytics-dashboard-nu-two.vercel.app

🚀 Features
✅ Authentication & Authorization

    Three-tier Role System: Admin, Manager, User

    Role-Based Routing: Dynamic access control for all pages

    Login/Register System: Full authentication flow

    Persistent Sessions: Zustand + localStorage

    Quick Login: Pre-filled credentials for testing

✅ Dashboard Features

    Real-time Analytics: Live charts and metrics

    Interactive Charts: Revenue, Orders, Users, Traffic

    KPI Cards: Animated metrics with trend indicators

    Filter System: Date range and user type filters

    Export Functionality: Download data as CSV/Excel

    Dark/Light Mode: Full theme support

✅ CRUD Operations

    User Management: Create, Read, Update, Delete users

    Product Management: Full inventory control

    Order Management: Order processing with status tracking

    Report Generation: Dynamic report creation

✅ UI/UX Features

    Responsive Design: Mobile-first approach

    Modern Components: Reusable UI components

    Notifications: Real-time notification system

    Search & Filter: Advanced filtering capabilities

    Loading States: Skeleton loaders and transitions

    Accessibility: Keyboard navigation and ARIA labels

🛠️ Tech Stack
Frontend Framework

    Next.js 14 - React framework with App Router

    TypeScript - Type-safe development

    React 18 - Latest React features

UI & Styling

    Tailwind CSS - Utility-first CSS framework

    Tailwind Merge - Conditional class merging

    Tailwind Animate - Animation utilities

    Lucide React - Beautiful icon library

State Management

    Zustand - Lightweight state management

    Persist Middleware - Local storage persistence

Data Visualization

    Recharts - Composable charting library

    Custom Charts: Revenue, Orders, Users, Traffic

API & Data

    JSON Server - Mock REST API backend

    Axios - HTTP client for API calls

    date-fns - Modern date utilities

    xlsx - Excel/CSV export functionality

UI Components

    Custom Component Library: Button, Card, Input, etc.

    React Hot Toast - Toast notifications

    CLSX - Class name utilities

Development Tools

    Prettier - Code formatting

    Concurrently - Run multiple commands

    Babel React Compiler - Performance optimization

🏗️ Architecture System Design

┌─────────────────────────────────────────────┐
│               User Interface                │
├─────────────────────────────────────────────┤
│   Pages → Components → UI Elements          │
├─────────────────────────────────────────────┤
│       Zustand State Management              │
├─────────────────────────────────────────────┤
│   API Layer (Axios + JSON Server)           │
├─────────────────────────────────────────────┤
│        Mock Data / Static Data              │
└─────────────────────────────────────────────┘

Key Architectural Decisions

    Component-Based Architecture

        Atomic design principles

        Reusable UI components

        Separation of concerns

    State Management Strategy

        Global store for user/auth data

        Local state for component-specific data

        Optimized re-renders with Zustand

    Data Flow

    API → Store → Components → UI
    User Action → Store Update → UI Re-render

    Error Handling

        Toast notifications for user feedback

        Graceful fallback UI

        Error boundaries for critical failures

⚡ Setup Instructions Prerequisites

    Node.js 18.x or higher

    npm package manager

    Git installed

Step-by-Step Setup


# 1. Clone the repository
git clone https://github.com/Ripa29/analytics-dashboard.git
cd analytics-dashboard

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev

# 4. Create environment file
echo "NEXT_PUBLIC_MOCK_API=http://localhost:3001" > .env.local

Environment Variables

NEXT_PUBLIC_MOCK_API=http://localhost:3001

🔐 Test Credentials
Three User Roles for Testing:

1. Admin User (Full Access)
Email: admin@example.com
Password: admin123
Permissions:
- Full system access
- User management (CRUD)
- Product/Order management
- Analytics & Reports
- System settings
- Export all data

2. Manager User (Limited Access)

Email: manager@example.com
Password: manager123
Permissions:
- Dashboard access
- View users (no delete)
- Manage products/orders
- View analytics
- Generate reports
- Export limited data

3. Regular User (Basic Access)

Email: user@example.com
Password: user123
Permissions:
- Dashboard viewing
- View own profile
- Basic order management
- Account settings
- Help & support

📁 Project Structure
analytics-dashboard/
│
├── app/                          # Next.js App Router 
│   ├── account/                  # Account settings
│   │   └── page.tsx             # Account settings page
│   ├── analytics/                # Analytics dashboard
│   │   └── page.tsx             # Analytics page
│   ├── help/                     # Help & support
│   │   └── page.tsx             # Help page
│   ├── orders/                   # Order management
│   │   └── page.tsx             # Orders page
│   ├── products/                 # Product management
│   │   └── page.tsx             # Products page
│   ├── profile/                  # User profile
│   │   └── page.tsx             # Profile page
│   ├── reports/                  # Report generation
│   │   └── page.tsx             # Reports page
│   ├── users/                    # User management
│   │   └── page.tsx             # Users page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard
│
├── components/                   # React components
│   ├── auth/                     # Auth components
│   │   ├── Login.tsx            # Login component
│   │   └── Register.tsx         # Registration component
│   │
│   ├── charts/                   # Chart components
│   │   ├── OrdersChart.tsx      # Orders chart
│   │   ├── RevenueChart.tsx     # Revenue chart
│   │   ├── TrafficChart.tsx     # Traffic chart
│   │   └── UsersChart.tsx       # Users chart
│   │
│   ├── dashboard/                # Dashboard components
│   │   ├── FilterBar.tsx        # Filter controls
│   │   ├── KPICard.tsx          # KPI metric cards
│   │   └── RecentActivity.tsx   # Activity feed
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx           # Top navigation
│   │   └── Sidebar.tsx          # Side navigation
│   │
│   └── ui/                       # UI components
│       ├── Button.tsx           # Custom button
│       └──  Card.tsx            # Card component
│        
│
├── data/                         # Static data
│   └── db.json                  # JSON Server database
│
├── lib/                          # Utilities & stores
│   ├── api/                     # API clients
│   │   └── mockApi.ts          # Mock API service
│   │
│   ├── store/                   # Zustand stores
│   │   └── dashboardStore.ts    # Main application store
│   │
│   ├── data.ts                  # Static data definitions
│   └── utils.ts                 # Utility functions
│
├── types/                        # TypeScript types
│   └── index.ts                 # Type definitions
│
├── public/                       # Static assets
│
├── config/                       # Configuration files
│   └── tailwind.config.ts       # Tailwind config
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js               # Next.js config
├── postcss.config.js            # PostCSS config
├── README.md                    # This file
└── ...                          # Other config files

🔒 Security Implementation
Role-Based Access Control
Permission Matrix:

┌─────────────┬──────────┬──────────┬──────────┐
│   Feature   │  Admin   │ Manager  │  User    │
├─────────────┼──────────┼──────────┼──────────┤
│ Dashboard   │    ✅    │    ✅    │    ✅    │
│ Users       │    ✅    │   View   │    ❌    │
│ Products    │    ✅    │   Edit   │   View   │
│ Orders      │    ✅    │   Edit   │   View   │
│ Analytics   │    ✅    │   View   │    ❌    │
│ Reports     │    ✅    │   View   │    ❌    │
│ Settings    │    ✅    │    ❌    │    ❌    │
└─────────────┴──────────┴──────────┴──────────┘
🔮 Future Enhancements

    Real database integration

    JWT authentication

    Real-time WebSocket updates

    Advanced filtering

    Multi-language support

    Mobile app version

👤 Author

Rokiya Ripa - Full Stack Developer