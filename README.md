# Store Hub - E-Commerce Web Application

Modern, full-featured e-commerce web application built with Next.js, offering authentication, notifications, localization, and comprehensive order management features.

## 🚀 Features

- **Authentication & Authorization**: Secure token-based authentication with role-based access control (Admin/User)
- **Real-time Notifications**: Notification system for order updates and role changes
- **Multi-language Support**: Internationalization (i18n) with support for English, Dutch, and Italian
- **Order Management**: Complete order management system for fitness products
- **User Management**: Admin dashboard for managing users and their roles
- **Shopping Cart**: Add items to cart and place orders
- **Dark Mode**: Theme switching with dark/light mode support
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Type Safety**: Full TypeScript support for type-safe development

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Internationalization**: next-intl
- **HTTP Client**: Axios
- **Form Validation**: Zod
- **Theme**: next-themes

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/username/StoreHub.git
cd StoreHub
```

### Install Dependencies

```bash
npm install
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

#### Production Build

```bash
npm run build
npm start
```

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run deploy` - Deploy to GitHub Pages (builds and deploys)
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run lint:next` - Run Next.js ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## 💻 Usage

### Authentication

1. Navigate to the login page (`/`)
2. Use the default credentials or register a new account
3. On successful login, you'll be redirected to the home page
4. JWT tokens are stored in cookies for authentication

### User Management (Admin Only)

1. Log in with an admin account
2. Navigate to "Users Management" in the navbar
3. Search and manage users
4. Update user roles (Admin/User)

### Order Management

#### For Users:
1. Browse products and add them to cart
2. View cart and proceed to checkout
3. Place orders and track order status
4. View order history in "My Orders"

#### For Admins:
1. Navigate to "Orders Management" in the navbar
2. View all orders with filtering options
3. Update order status (Pending, Processing, Shipping, Delivered)
4. View order statistics

### Notifications

- Users receive notifications for:
  - Order status updates
  - Role changes (admin actions)
- Notifications are displayed in the notification dropdown
- Mark notifications as read when viewed

### Localization

- Switch between languages using the language dropdown
- Supported languages:
  - English (en)
  - Dutch (nl)
  - Italian (it)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API services and client
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── cart/         # Shopping cart components
│   │   ├── dropdowns/    # Dropdown components
│   │   ├── navbar/       # Navigation components
│   │   ├── orders/       # Order components
│   │   └── users/        # User management components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
│       └── mock/         # Mock services (localStorage)
├── messages/             # i18n translation files
└── public/               # Static assets
```

## 🔧 Development

### Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code
npm run format
```

## 🚀 Deployment

### GitHub Pages

This project is configured for deployment to GitHub Pages using the `gh-pages` package.

#### Prerequisites

1. Ensure your repository is hosted on GitHub
2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose the `gh-pages` branch as the source
   - Select the `/ (root)` folder

#### Deployment Steps

1. **Set the base path** (if your repository is not at the root):
   ```bash
   # Replace 'your-repo-name' with your actual repository name
   export NEXT_PUBLIC_BASE_PATH=/your-repo-name
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

   This will:
   - Build the application for static export
   - Deploy the `out` folder to the `gh-pages` branch
   - Make your site available at `https://username.github.io/repo-name`

#### Custom Domain

If you're using a custom domain, you can set `NEXT_PUBLIC_BASE_PATH` to an empty string:
```bash
NEXT_PUBLIC_BASE_PATH= npm run deploy
```

#### Manual Deployment

If you need to build and deploy separately:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Deploy manually
npx gh-pages -d out
```

Built with ❤️ using Next.js and TypeScript
