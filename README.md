#Expense Tracker App

A full-stack expense tracking application built with MongoDB, Express.js, React, and Node.js. Track your income and expenses, visualize data with charts, generate monthly reports, and export data to CSV.

## Features

- 🔐 **User Authentication**: Secure login/signup with JWT
- 💰 **Transaction Management**: Add, edit, delete income/expenses with categories
- 📊 **Data Visualization**: Interactive charts (Pie charts for categories, Line charts for trends) using Chart.js
- 🔍 **Advanced Filtering**: Filter by date range, category, type (income/expense), and amount
- 💾 **Local Storage Fallback**: Store transactions locally for offline access and quick loading
- 📈 **Monthly Reports**: Generate detailed monthly summaries with category breakdowns
- 📥 **CSV Export**: Download transactions or reports as CSV files
- 📱 **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- 🤖 **AI-Powered Features**:
  - **Smart Categorization**: Automatically categorize transactions based on description
  - **Spending Insights**: AI-generated insights and recommendations
  - **Anomaly Detection**: Detect unusual spending patterns automatically
  - **Budget Recommendations**: AI-suggested budgets based on your spending patterns
  - **Natural Language Entry**: Add transactions using plain English (e.g., "spent $50 on groceries yesterday")

## Tech Stack

### Frontend
- React.js 18
- Redux Toolkit (State Management)
- React Router (Routing)
- Chart.js & react-chartjs-2 (Data Visualization)
- Axios (API Calls)
- Tailwind CSS (Styling)
- json2csv (CSV Export)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- bcryptjs (Password Hashing)
- express-validator (Input Validation)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "Expense Tracker App"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Add Transactions**: Click "Add Transaction" to record income or expenses
3. **View Transactions**: Browse all your transactions in the list view
4. **Filter Data**: Use the filter panel to find specific transactions
5. **View Charts**: Switch to the Charts tab to see visualizations
6. **Generate Reports**: Go to Reports tab to view monthly summaries
7. **Export Data**: Export transactions or reports as CSV files

## Project Structure

```
Expense Tracker App/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── charts/
│   │   │   │   └── Charts.js
│   │   │   ├── dashboard/
│   │   │   │   └── SummaryCards.js
│   │   │   ├── filters/
│   │   │   │   └── FilterPanel.js
│   │   │   ├── layout/
│   │   │   │   └── Navbar.js
│   │   │   ├── reports/
│   │   │   │   └── MonthlyReport.js
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionForm.js
│   │   │   │   └── TransactionList.js
│   │   │   ├── Dashboard.js
│   │   │   └── PrivateRoute.js
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── transactionSlice.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── exportCSV.js
│   │   │   └── localStorage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Transactions
- `GET /api/transactions` - Get all transactions (Protected, supports filters)
- `GET /api/transactions/:id` - Get a single transaction (Protected)
- `POST /api/transactions` - Create a new transaction (Protected)
- `PUT /api/transactions/:id` - Update a transaction (Protected)
- `DELETE /api/transactions/:id` - Delete a transaction (Protected)
- `GET /api/transactions/stats/summary` - Get summary statistics (Protected)

### Reports
- `GET /api/reports/monthly` - Get monthly report (Protected)
- `GET /api/reports/category-breakdown` - Get category breakdown (Protected)
- `GET /api/reports/trends` - Get trends over time (Protected)

## Local Storage

The app uses browser localStorage as a fallback mechanism:
- Transactions are automatically saved to localStorage when created/updated/deleted
- If the API is unavailable, the app can load data from localStorage
- Data syncs with the backend when online

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # Runs on http://localhost:3000
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## AI Features

The application includes several AI-powered features to enhance your expense tracking experience:

1. **Smart Categorization**: Automatically suggests categories based on transaction descriptions using pattern matching and keyword analysis.

2. **Spending Insights**: Provides intelligent insights such as:
   - Top spending categories
   - Budget health indicators
   - Daily spending averages
   - Spending diversity metrics

3. **Anomaly Detection**: Identifies unusual spending patterns:
   - Unusually large transactions
   - Spending spikes compared to historical data
   - Patterns that deviate from your normal behavior

4. **Budget Recommendations**: Suggests appropriate budgets for each category based on your historical spending patterns.

5. **Natural Language Entry**: Add transactions using conversational language. Examples:
   - "spent $50 on groceries yesterday"
   - "paid $25 for lunch today"
   - "earned $1000 from freelance work"

**Note**: The current implementation uses rule-based AI and pattern matching. For production use, consider integrating with OpenAI API or similar services for more advanced natural language processing.

## Future Enhancements

- [ ] Recurring transactions
- [ ] Advanced budget management with AI suggestions
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Email notifications
- [ ] Data backup/restore
- [ ] Receipt OCR (Optical Character Recognition)
- [ ] Integration with OpenAI API for advanced NLP
- [ ] Predictive spending forecasts
- [ ] Smart alerts and reminders

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, email sasanthasanju1111@gmail.com or create an issue in the repository.


