export const BASE_PATH = '/'

// Authentications
export const SIGN_UP_PATH = BASE_PATH + 'sign-up'
export const SIGN_IN_PATH = BASE_PATH + 'sign-in'

// User
export const PROFILE_PATH = BASE_PATH + 'p/' + ':username'

// Admin
export const ADMIN_BASE_PATH = BASE_PATH + 'admin/'
export const DASHBOARD_PATH = ADMIN_BASE_PATH + 'dashboard'
export const USER_MANAGE_PATH = ADMIN_BASE_PATH + 'users'
export const ORDER_MANAGE_PATH = ADMIN_BASE_PATH + 'orders'
export const PRODUCT_MANAGE_PATH = ADMIN_BASE_PATH + 'products'
export const REPORT_PATH = ADMIN_BASE_PATH + 'reports'
export const REVIEW_MANAGE_PATH = ADMIN_BASE_PATH + 'reviews'
export const ORDER_ITEM_MANAGE_PATH = ADMIN_BASE_PATH + 'order-items'
