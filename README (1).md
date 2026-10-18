# Shopverse – Full-Stack E-commerce App

A full-stack e-commerce store built with React, Redux Toolkit and Tailwind CSS on the frontend and Node.js, Express and MongoDB on the backend. Users can browse and filter products, manage a cart, and check out with Stripe card payments.

This repository contains the frontend. The backend is a separate Express REST API (see [Backend](#backend)).

**Live demo:** https://ecommerce-website-ouxu.onrender.com

> Hosted on Render's free tier, so the first load after a period of inactivity can take up to a minute while the server wakes up.

## Features

- **Product catalog** with search, category filter, min/max price range, sorting (newest, price low→high, price high→low) and server-side pagination
- **Debounced search** so the API isn't called on every keystroke
- **Authentication**: register and log in with JWT; the token is kept in `localStorage` so sessions survive a page refresh
- **Cart** stored on the server per user: add items, remove items and see a running total
- **Protected actions**: adding to the cart redirects guests to the login page
- **Checkout with Stripe**: shipping details form, card payment through Stripe Elements, then order creation once the payment succeeds
- **Home page** with an image carousel and content loaded from the API
- **Responsive layout** with a mobile menu

## Tech Stack

**Frontend**

| Area | Tools |
| --- | --- |
| UI | React 19, React Router 7, Tailwind CSS, React Feather icons, React Slick |
| State | Redux Toolkit (`createSlice`, `createAsyncThunk`) |
| HTTP | Axios with a shared base instance |
| Payments | Stripe.js, `@stripe/react-stripe-js` |
| Tooling | Vite, ESLint, PostCSS |

**Backend**

| Area | Tools |
| --- | --- |
| Runtime and framework | Node.js, Express |
| Database | MongoDB |
| Auth | JWT, sent as a Bearer token |
| Payments | Stripe (server-side PaymentIntents) |

**Hosting:** Render

## How It Works

```
React + Redux (Vite)  ──Axios──▶  Express REST API  ──▶  MongoDB
        │                               │
        └──── Stripe.js (card) ──▶  Stripe  ◀── PaymentIntent
```

The frontend talks to the Express API, whose URL comes from `VITE_BACKEND_SERVICE_URL`. All requests go through one Axios instance (`src/api/index.js`). Each feature has its own Redux slice that handles loading, success and error states. The backend stores users, products, carts and orders in MongoDB and checks the JWT on protected routes.

Checkout flow:

1. The frontend asks the backend to create a Stripe PaymentIntent for the cart total.
2. The card is confirmed in the browser with `stripe.confirmCardPayment`, so card details never reach the backend.
3. When the payment succeeds, the order is saved through `POST /orders` with the items and shipping address.

### API endpoints used

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create an account | – |
| POST | `/auth/login` | Log in, returns token and user | – |
| GET | `/homepage` | Home page content | – |
| GET | `/products` | Product list with `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` | – |
| GET | `/products/categories` | Category list for the filter | – |
| GET | `/cart` | Current user's cart | Bearer |
| POST | `/cart` | Add an item (`productId`, `quantity`) | Bearer |
| DELETE | `/cart/:productId` | Remove an item | Bearer |
| POST | `/payment/create-payment-intent` | Create a Stripe PaymentIntent | – |
| POST | `/orders` | Place an order | Bearer |

## Project Structure

```
src/
├── api/            # Axios instance (base URL from env)
├── components/     # Header, Footer, HeroCarousel
├── features/       # Redux slices: auth, cart, products, homepage
├── pages/          # Home, Products, Cart, Checkout, Login, Register
├── store/          # Redux store setup
├── App.jsx         # Layout and routes
└── main.jsx        # Entry point, Redux Provider
```

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB database (local or MongoDB Atlas), and a Stripe account in test mode.

### 1. Run the backend

Clone the backend repository, install dependencies, and create its `.env`. The backend needs:

- the MongoDB connection string
- a JWT secret used to sign login tokens
- your Stripe secret key (test mode)
- the port to run on

Then start the server and note the API's base URL.

### 2. Run the frontend

```bash
git clone https://github.com/nikhilfiction/ecommerce-website.git
cd ecommerce-website
npm install
```

Create a `.env` file in the project root:

```env
VITE_BACKEND_SERVICE_URL=http://localhost:5000/api
```

Then start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Testing Payments

Stripe runs in test mode, so no real money is charged. Use Stripe's test card:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

## Backend

The backend is a REST API built with Node.js, Express and MongoDB. It handles:

- user registration and login, issuing a JWT on login
- the product catalog, with search, category and price filters, sorting and pagination
- per-user carts stored in the database
- creating Stripe PaymentIntents, so the secret key stays on the server
- saving orders with their items, shipping address and total

Backend repository: <!-- add backend repo link here -->

## Author

Nikhil Sahu · [GitHub](https://github.com/nikhilfiction) · [LinkedIn](https://www.linkedin.com/in/nikhilsahu12300/)
