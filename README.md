# Ag Mortgage Bank Loan Management System

A comprehensive loan management system built with React, TypeScript, Node.js, Express, and SQLite.

## Features

### User Features
- **User Registration & Authentication**: Secure registration with password validation and JWT authentication
- **Loan Applications**: Apply for personal, mortgage, business, and auto loans
- **Savings Management**: Open savings accounts and manage transactions
- **Dashboard**: Overview of loans, savings, and account status

### Admin Features
- **Loan Management**: Review, approve, or reject loan applications
- **User Management**: View all registered users and their details
- **Dashboard**: Comprehensive overview of all system activities

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- SQLite database with better-sqlite3
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the backend server**:
   ```bash
   npm run server
   ```
   The server will:
   - Create SQLite database file
   - Create all necessary tables
   - Create a default admin user
   - Start listening on port 3001

3. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Database Schema

The system automatically creates the following tables in SQLite:

### Users Table
- Personal information (name, email, phone, etc.)
- Address details
- Employment information
- Next of kin details
- Authentication data

### Loan Applications Table
- Loan details (amount, type, purpose, duration)
- Guarantor information
- Application status and review data
- Interest rates and payment calculations

### Savings Accounts Table
- Account details (number, type, balance)
- Interest rates
- Account creation data

### Transactions Table
- Transaction history for savings accounts
- Deposit and withdrawal records
- Balance tracking

## Default Admin Account

A default admin account is created automatically:
- **Email**: admin@agmortgagebank.com
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get user profile

### Loans
- `GET /api/loans` - Get loan applications
- `POST /api/loans` - Create loan application
- `PUT /api/loans/:id` - Update loan status (admin only)

### Savings
- `GET /api/savings` - Get savings accounts
- `POST /api/savings` - Create savings account
- `POST /api/savings/:id/transactions` - Add transaction

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries with better-sqlite3
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── context/           # Context providers
│   ├── services/          # API services
│   └── types/             # TypeScript type definitions
├── server/                # Backend Node.js application
│   ├── database/          # Database connection and initialization
│   ├── middleware/        # Express middleware
│   └── routes/            # API route handlers
└── README.md
```

### Adding New Features

1. **Database Changes**: Update `server/database/init.js`
2. **API Routes**: Add new routes in `server/routes/`
3. **Frontend Components**: Create components in `src/components/`
4. **Type Definitions**: Update `src/types/index.ts`

## Database

This application uses SQLite with better-sqlite3, which creates a local database file (`server/database.sqlite`) automatically. No additional database setup is required.

### Benefits of SQLite:
- **Zero Configuration**: No database server setup required
- **Portable**: Single file database that can be easily backed up
- **Fast**: Excellent performance for small to medium applications
- **Reliable**: ACID compliant and battle-tested

## Production Deployment

1. **Environment Variables**: Update `.env` for production
2. **Database**: SQLite file will be created automatically
3. **Build Frontend**: `npm run build`
4. **Process Manager**: Use PM2 or similar for the Node.js server
5. **Reverse Proxy**: Configure Nginx or Apache
6. **SSL Certificate**: Enable HTTPS

## Support

For issues or questions, please check the following:
1. Ensure Node.js is installed and up to date
2. Verify environment variables are correctly set
3. Check server logs for detailed error messages
4. Ensure all dependencies are installed

## License

This project is licensed under the MIT License.