# Wallet Api

Wallet Api helps you control your incomes and expenses.

---

## Environment Variables:

### PostgreSQL Connection String
```
Main Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

Tests Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname-Test"
```

### Server base URL
```
BASE_URL="http://localhost:9000/api/v1"
```

### Ports
```
PORT="9000"
SERVER_DEV_PORT="9000"
```

### JWT Secret
```
JWT_SECRET="supersecretkey"
```

### External API Setup
```
EXCHANGE_RATES_API_URL='https://api.exchangeratesapi.io/latest'
EXCHANGE_RATES_API_KEY=""
```

### Redis Docker Container URL
```
REDIS_URL="redis://localhost:6379"
```

---

## Routes
```
base url: http://localhost:9000/api/v1/

/users: 
  POST - /users/login
  POST - /users/register

/transactions/
  GET  - /
  POST - /
  PUT  - /:id
  DELETE - /:id

/analytics/
  GET - /balance
  GET - /stats
  GET - /monthly

/info/
  GET - /finance-tips
  GET - /average-expenses

/exchange-rates/
  GET - /exchange-rates
  GET - /report
```
/swagger -> [Swagger Route](http://localhost:9000/api/v1/swagger/docs)

---

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/emilmilev1/api-wallet.git
   cd api-wallet
   ```

2. **Create and populate the `.env` file:**
   ```sh
   cp .env.example .env
   ```
   Edit the `.env` file and add your own credentials. I have removed mine in that setup.

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser and navigate to swagger:**
   ```
   http://localhost:9000/api/v1/swagger/docs
   ```

---

### Have fun!