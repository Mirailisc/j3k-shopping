export const BASE_PATH = '/'

export const PRODUCT_PATH = BASE_PATH + 'products'
export const PRODUCT_INFO_PATH = PRODUCT_PATH + '/:productId'

// Checkout
export const CHECKOUT_PATH = BASE_PATH + 'checkout'
export const ORDER_CONFIRMATION_PATH = CHECKOUT_PATH + '/order-confirmation'

// Authentications
export const SIGN_UP_PATH = BASE_PATH + 'sign-up'
export const SIGN_IN_PATH = BASE_PATH + 'sign-in'

// User
export const PROFILE_PATH = BASE_PATH + 'p'
export const USER_INFO_PATH = PROFILE_PATH + '/:username'

// Seller
export const SELLER_PATH = BASE_PATH + 'seller'
export const SELLER_DASHBOARD_PATH = SELLER_PATH + '/dashboard'
export const SELLER_ORDER_PATH = SELLER_PATH + '/orders'

// Admin
export const ADMIN_BASE_PATH = BASE_PATH + 'admin/'
export const ADMIN_DASHBOARD_PATH = ADMIN_BASE_PATH + 'dashboard'
export const USER_MANAGE_PATH = ADMIN_BASE_PATH + 'users'
export const ORDER_MANAGE_PATH = ADMIN_BASE_PATH + 'orders'
export const PRODUCT_MANAGE_PATH = ADMIN_BASE_PATH + 'products'
export const REPORT_PATH = ADMIN_BASE_PATH + 'reports'
export const REVIEW_MANAGE_PATH = ADMIN_BASE_PATH + 'reviews'

export const NOT_FOUND_PATH = '*'