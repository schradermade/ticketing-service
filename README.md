# Ticketing Service

A modern, microservices-based ticketing platform that enables users to list and purchase event tickets in a secure, scalable environment.

## 🌟 Features

- **User Authentication**: Secure signup and signin functionality
- **Ticket Management**: Create, update, and list tickets for events
- **Order Processing**: Reserve and purchase tickets with expiration handling
- **Payment Integration**: Secure payment processing with Stripe
- **Real-time Updates**: Event-driven architecture for immediate data consistency

## 🏗️ Technical Architecture

The application is built using a microservices architecture with the following services:

- **Auth Service**: Handles user authentication and authorization
- **Tickets Service**: Manages ticket creation and updates
- **Orders Service**: Handles order creation and management
- **Expiration Service**: Manages ticket reservation timeouts
- **Payments Service**: Processes payments through Stripe
- **Client Service**: Next.js frontend application

### Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js, React, Bootstrap
- **Database**: MongoDB
- **Message Broker**: NATS Streaming Server
- **Container Orchestration**: Kubernetes
- **Payment Processing**: Stripe
- **Testing**: Jest, Supertest

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker
- Kubernetes (with kubectl configured)
- Skaffold
- Stripe Account

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ticketing-service.git
cd ticketing-service
```

2. Create Kubernetes secrets:

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_key
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret_key
```

3. Add the following to your hosts file:

```bash
127.0.0.1 ticketing.dev
```

### Development Environment

1. Install dependencies in each service:

```bash
cd auth && npm install
cd ../client && npm install
cd ../tickets && npm install
cd ../orders && npm install
cd ../expiration && npm install
cd ../payments && npm install
```

2. Start the development environment:

```bash
skaffold dev
```

The application will be available at https://ticketing.dev

## 🧪 Testing

Each service includes a comprehensive test suite. To run tests:

```bash
cd [service-name]
npm test
```

## 🏛️ Project Structure

```
├── auth/           # Authentication service
├── client/         # Next.js frontend
├── tickets/        # Ticket management service
├── orders/         # Order processing service
├── expiration/     # Ticket expiration service
├── payments/       # Payment processing service
├── infra/         # Kubernetes configurations
└── common/         # Shared library
```

## 🔑 Environment Variables

Each service requires specific environment variables:

- `JWT_KEY`: Secret key for JWT signing
- `MONGO_URI`: MongoDB connection string
- `NATS_CLIENT_ID`: NATS client identifier
- `NATS_URL`: NATS server URL
- `NATS_CLUSTER_ID`: NATS cluster identifier
- `STRIPE_KEY`: Stripe secret key (Payments service only)

## 📝 API Documentation

### Auth Service

- `POST /api/users/signup`: Create new user account
- `POST /api/users/signin`: Sign in to existing account
- `POST /api/users/signout`: Sign out current user
- `GET /api/users/currentuser`: Get current user information

### Tickets Service

- `POST /api/tickets`: Create new ticket
- `GET /api/tickets`: List all tickets
- `GET /api/tickets/:id`: Get ticket by ID
- `PUT /api/tickets/:id`: Update ticket

### Orders Service

- `POST /api/orders`: Create new order
- `GET /api/orders`: List user's orders
- `GET /api/orders/:id`: Get order by ID
- `DELETE /api/orders/:id`: Cancel order

### Payments Service

- `POST /api/payments`: Process payment for order

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- NATS Streaming Server team
- Kubernetes community
- Stripe API team
