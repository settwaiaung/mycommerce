// login
const MERCHANT_LOGIN_URL = process.env.merchantUrl + '/auth/login'
// Master Record
const MERCHANT_DELIVERY_STATUS_URL = process.env.merchantUrl + '/delivery_statuses'
const MERCHANT_CITY_URL = process.env.merchantUrl + '/cities'
const MERCHANT_ZONE_URL = process.env.merchantUrl + '/zones'
// calculate deli
const CALCULATE_AMOUNT_URL = process.env.merchantUrl + '/calculate_amount'
const VOUCHER_URL = process.env.merchantUrl + '/vouchers'
// customer
const MERCHANT_CUSTOMER_URL = process.env.merchantUrl + '/customers'

export default {
  MERCHANT_LOGIN_URL,
  MERCHANT_DELIVERY_STATUS_URL,
  MERCHANT_CITY_URL,
  MERCHANT_ZONE_URL,
  CALCULATE_AMOUNT_URL,
  VOUCHER_URL,
  MERCHANT_CUSTOMER_URL
}
