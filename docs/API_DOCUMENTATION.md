# JUSAS API Documentation

## Base URL

- Development: http://localhost:5000/api
- Production: https://jusas.vercel.app/api

## Authentication

All endpoints except `/api/auth/*` require JWT token in Authorization header.

## Endpoints

### Authentication

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Products

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)

### Cart

- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:itemId` - Update cart item quantity
- DELETE `/api/cart/:itemId` - Remove item from cart
- POST `/api/cart/merge` - Merge guest cart with user cart

### Orders

- GET `/api/orders` - Get user's orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create new order
- PUT `/api/orders/:id/status` - Update order status (Admin only)

### Admin

- GET `/api/admin/orders` - Get all orders (Admin only)
- GET `/api/admin/analytics` - Get sales analytics (Admin only)
- POST `/api/admin/products` - Create product (Admin only)

## Error Responses

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
