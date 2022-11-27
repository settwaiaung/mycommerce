// login
import merchantUrl from './merchantUrl'
const AUTH_LOGIN_URL = process.env.baseUrl + '/auth/login'
const PROFILE_URL = process.env.baseUrl + '/auth/profile'
const UPLOAD_URL = process.env.baseUrl + '/auth/upload_profile'
// Logout
const AUTH_LOGOUT_URL = process.env.baseUrl + '/auth/logout'
// Master Record
const MASTER_RECORDS_URL = process.env.baseUrl + '/get_master_records'
const DASHBOARD_URL = process.env.baseUrl + '/dashboard'

// Top Level
const CUSTOMER_URL = process.env.baseUrl + '/customers'
const CUSTOMER_TYPE_URL = process.env.baseUrl + '/customer_types'

// supplier
const SUPPLIER_URL = process.env.baseUrl + '/suppliers'
// Order
const ORDER_URL = process.env.baseUrl + '/orders'
const ORDER_ITEM_URL = process.env.baseUrl + '/order_items'
const ORDER_HISTORIES_URL = process.env.baseUrl + '/histories'
const BOTTLE_RETURN_COUNT_URL = process.env.baseUrl + '/get_return_bottle_count'

// Purchase Order
const PURCHASEORDER_URL = process.env.baseUrl + '/purchase_orders'
const PURCHASEORDER_ITEM_URL = process.env.baseUrl + '/purchase_order_items'
// Sale Report
const DAILY_SALE_URL = process.env.baseUrl + '/daily_sales'
const SALE_ITEM_REPORT_URL = process.env.baseUrl + '/sale_item_report'
const SALE_REPORT_URL = process.env.baseUrl + '/sale_report'
const BOTTLE_ITEM_REPORT_URL = process.env.baseUrl + '/bottle_report'
const SALE_SHEET_REPORT_URL = process.env.baseUrl + '/sale_item_sheet'
// sale
const SALE_URL = process.env.baseUrl + '/sales'
const SALE_ITEM_URL = process.env.baseUrl + '/sale_items'
const SALE_DELIVERY_URL = process.env.baseUrl + '/get_sales_delivery'
const DELIVERY_PAYMENT_URL = process.env.baseUrl + '/create_payment_delivery'
const SYNC_DELI_STATUS_URL = process.env.baseUrl + '/sync_deli_status'
// Bottle
const BOTTLE_URL = process.env.baseUrl + '/bottle_returns'
// Store
const CATEGORY_URL = process.env.baseUrl + '/categories'
const PRODUCT_URL = process.env.baseUrl + '/products'
// General
const CITY_URL = process.env.baseUrl + '/cities'
const DEPARTMENT_URL = process.env.baseUrl + '/departments'
const SOURCE_URL = process.env.baseUrl + '/sources'
const ZONE_URL = process.env.baseUrl + '/zones'
// Super
const BANK_URL = process.env.baseUrl + '/banks'
const BANK_INFORMATION_URL = process.env.baseUrl + '/bank_informations'
const PERMISSION_URL = process.env.baseUrl + '/permissions'
const ROLE_URL = process.env.baseUrl + '/roles'
const USER_URL = process.env.baseUrl + '/users'

// stock
const STOCK_URL = process.env.baseUrl + '/stocks'

// Error Product
const ERROR_PRODUCT_URL = process.env.baseUrl + '/product_errors'

export default {
  ...merchantUrl,
  AUTH_LOGIN_URL,
  PROFILE_URL,
  AUTH_LOGOUT_URL,
  UPLOAD_URL,
  // Top
  CUSTOMER_URL,
  CUSTOMER_TYPE_URL,
  // Supplier
  SUPPLIER_URL,
  // Master
  MASTER_RECORDS_URL,
  DASHBOARD_URL,
  // Store
  CATEGORY_URL,
  PRODUCT_URL,
  // General
  CITY_URL,
  DEPARTMENT_URL,
  SOURCE_URL,
  ZONE_URL,
  // Super
  BANK_URL,
  BANK_INFORMATION_URL,
  PERMISSION_URL,
  ROLE_URL,
  USER_URL,
  // Order
  ORDER_URL,
  ORDER_ITEM_URL,
  ORDER_HISTORIES_URL,
  BOTTLE_RETURN_COUNT_URL,
  BOTTLE_ITEM_REPORT_URL,
  SALE_SHEET_REPORT_URL,
  // Sale
  SALE_URL,
  SALE_ITEM_URL,
  DAILY_SALE_URL,
  SALE_ITEM_REPORT_URL,
  SALE_REPORT_URL,
  SALE_DELIVERY_URL,
  DELIVERY_PAYMENT_URL,
  SYNC_DELI_STATUS_URL,
  // Bottle
  BOTTLE_URL,
  // Purchase Order
  PURCHASEORDER_URL,
  PURCHASEORDER_ITEM_URL,
  // Stock
  STOCK_URL,
  // ERROR PRODUCT URL
  ERROR_PRODUCT_URL
}
