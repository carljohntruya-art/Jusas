export const ROUTES = {
  // Public routes
  HOME: '/',
  MENU: '/menu',
  ABOUT: '/about',
  PRODUCT: '/product/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected routes
  CART: '/cart',
  ORDERS: '/orders',
  ACCOUNT: '/account',
  ADMIN: '/admin',
  
  // Utils
  getProductPath: (id: string | number) => `/product/${id}`,
  getOrderPath: (id?: string | number) => id ? `/orders/${id}` : '/orders'
} as const;
