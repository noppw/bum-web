# Manufacturing Traceback System

A comprehensive web application for managing manufacturing traceability with supplier management, product tracking, access control, and lot control features.

## Features

- **Login System**: Secure authentication with username/password
- **Dashboard**: Overview with summary statistics and recent activity
- **Suppliers Management**: CRUD operations for supplier information
- **Product Management**: Product catalog with specifications and pricing
- **Access Management**: User roles and permissions management
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React 18 with TypeScript
- Material-UI (MUI) for modern UI components
- React Router for navigation
- Emotion for styled components

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

- **Username**: admin
- **Password**: admin123

## Application Structure

```
src/
├── components/
│   ├── Login.tsx              # Authentication page
│   ├── Layout.tsx             # Main layout with navigation
│   ├── Dashboard.tsx          # Dashboard with summaries
│   ├── Suppliers.tsx          # Supplier management
│   ├── Products.tsx           # Product management
│   ├── AccessManagement.tsx   # User access control
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
└── index.css                  # Global styles
```

## Features Overview

### Dashboard
- Summary cards showing counts for each section
- System overview with key metrics
- Recent activity feed
- Trend indicators for data changes

### Suppliers Management
- Add, edit, and delete suppliers
- Search functionality
- Contact information tracking
- Status management (active/inactive)

### Product Management
- Product catalog with SKU tracking
- Category and supplier associations
- Price and stock management
- Status tracking (active/inactive/discontinued)

### Access Management
- User account management
- Role-based access control
- Permission management
- User status tracking


## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Customization

The application uses Material-UI theming. You can customize the theme by modifying the `theme` object in `App.tsx`.

## Deployment

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## Future Enhancements

- Backend API integration
- Real-time data updates
- Advanced reporting and analytics
- Barcode/QR code scanning
- Export functionality
- Audit logging
- Multi-language support 