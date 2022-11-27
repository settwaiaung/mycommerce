import language from '~/core/language'
const trans = (val, lang) => {
  return language(val)[lang]
}
// common headers
const onlyTwoFieldHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('MM_Name', lang), value: 'mm_name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
const onlyOneFieldHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// start top
const customerHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('Type', lang), value: 'customer_type' },
    { text: trans('MemberShip', lang), value: 'membership_no' },
    { text: trans('Email', lang), value: 'email' },
    { text: trans('Phone', lang), value: 'phone' },
    { text: trans('City', lang), value: 'city.name' },
    { text: trans('Zone', lang), value: 'zone.name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// supplier
const supplierHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('Phone', lang), value: 'phone' },
    { text: trans('Email', lang), value: 'email' },
    { text: trans('City', lang), value: 'city.name' },
    { text: trans('Zone', lang), value: 'zone.name' },
    { text: trans('Address', lang), value: 'address' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// start general
const zoneHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('City_Name', lang), value: 'city.name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// end general
// store
const productHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('MM_Name', lang), value: 'mm_name' },
    { text: trans('Item_Code', lang), value: 'item_code' },
    { text: trans('Category_Name', lang), value: 'category.name' },
    { text: trans('Price', lang), value: 'price' },
    { text: trans('Is_Available', lang), value: 'is_available' },
    { text: trans('Exclusive Bottle', lang), value: 'exclusive_bottle' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// start super
const bankInformationHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}

const userHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'name' },
    { text: trans('User_Name', lang), value: 'username' },
    { text: trans('Department', lang), value: 'department.name' },
    { text: trans('Role', lang), value: 'role.name' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// end super
// order
const orderHeader = (lang) => {
  return [
    { text: trans('Order No', lang), value: 'order_no' },
    { text: trans('Customer Name', lang), value: 'customer_name' },
    { text: trans('City', lang), value: 'customer_city_name' },
    { text: trans('Zone', lang), value: 'customer_zone_name' },
    { text: trans('Phone', lang), value: 'customer_phone' },
    { text: trans('Total', lang), value: 'grand_total_amount' },
    { text: trans('Status', lang), value: 'status' },
    { text: trans('Source', lang), value: 'source' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
const orderItemHeader = (lang) => {
  return [
    { text: trans('Action', lang), value: 'actions', hideable: true },
    { text: trans('Product', lang), value: 'product_name' },
    { text: trans('Bottle', lang), value: 'bottle_return' },
    { text: trans('Exclusive Bottle', lang), value: 'not_include_bottle' },
    { text: trans('Unit Price', lang), value: 'unit_price' },
    { text: trans('Qty', lang), value: 'qty' },
    { text: trans('Price', lang), value: 'price' },
    { text: trans('Sub Price', lang), value: 'amount' }

  ]
}
const customerOrderHeader = (lang) => {
  return [
    { text: trans('Order No', lang), value: 'order_no' },
    { text: trans('Amount', lang), value: 'total_amount' }
  ]
}
const customerSaleHeader = (lang) => {
  return [
    { text: trans('Invoice No', lang), value: 'invoice_no' },
    { text: trans('Customer Name', lang), value: 'customer_name' }
  ]
}
// sale
const saleHeader = (lang) => {
  return [
    { text: trans('Invoice No', lang), value: 'invoice_no' },
    { text: trans('Customer Name', lang), value: 'customer_name' },
    { text: trans('City', lang), value: 'customer_city_name' },
    { text: trans('Zone', lang), value: 'customer_zone_name' },
    { text: trans('Phone', lang), value: 'customer_phone' },
    { text: trans('Paid', lang), value: 'payment_status' },
    { text: trans('Status', lang), value: 'status' },
    { text: trans('Qty', lang), value: 'total_qty' },
    { text: trans('Amount', lang), value: 'total_amount' },
    { text: trans('Discount', lang), value: 'total_discount' },
    { text: trans('Grand Total', lang), value: 'grand_total' },
    { text: trans('Outstanding', lang), value: 'outstanding_amount' },
    { text: trans('Source', lang), value: 'source' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
const saleDeliveryHeader = (lang) => {
  return [
    { text: trans('Invoice', lang), value: 'invoice_no' },
    { text: trans('Voucher', lang), value: 'delivery_voucher_no' },
    { text: trans('Customer', lang), value: 'customer_name' },
    { text: trans('City', lang), value: 'customer_city_name' },
    { text: trans('Zone', lang), value: 'customer_zone_name' },
    { text: trans('Phone', lang), value: 'customer_phone' },
    { text: trans('Pay', lang), value: 'payment_status' },
    { text: trans('Qty', lang), value: 'total_qty' },
    { text: trans('Amount', lang), value: 'total_amount' },
    { text: trans('Discount', lang), value: 'total_discount' },
    { text: trans('Deli Fee', lang), value: 'delivery_amount' },
    { text: trans('Grand Total', lang), value: 'grand_total' },
    { text: trans('Deli Status', lang), value: 'deli_deliver_status' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// bottle
const bottleHeader = (lang) => {
  return [
    { text: trans('Product Name', lang), value: 'product.name' },
    { text: trans('Customer Name', lang), value: 'customer.name' },
    { text: trans('Total', lang), value: 'total_bottle' },
    { text: trans('Remainders', lang), value: 'remain_bottle' },
    { text: trans('Status', lang), value: 'status' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
// bottle history
const bottleHistoriesHeader = (lang) => {
  return [
    { text: trans('Returned Date', lang), value: 'returned_date' },
    { text: trans('Returned Bottle', lang), value: 'returned_bottle' },
    { text: trans('Action User', lang), value: 'created_by.name' }
  ]
}
const bottleItemsHeader = (lang) => {
  return [
    { text: trans('Invoice No', lang), value: 'sale.invoice_no' },
    { text: trans('Quantity', lang), value: 'qty' }
  ]
}
// paymenthistory
const paymentHistoryHeader = (lang) => {
  return [
    { text: trans('Paid At', lang), value: 'created_at' },
    { text: trans('Ref', lang), value: 'payment_ref' },
    { text: trans('Payment Amount', lang), value: 'payment_amount' },
    { text: trans('Payment Method', lang), value: 'payment_method' },
    { text: trans('Note', lang), value: 'note' }
  ]
}
// report
const dailySaleHeader = (lang) => {
  return [
    // { text: trans('Invoice No', lang), value: 'invoice_no' },
    // { text: trans('Name', lang), value: 'customer_name' },
    // { text: trans('Phone', lang), value: 'customer_phone' },
    // { text: trans('City', lang), value: 'customer_city_name' },
    // { text: trans('Zone', lang), value: 'customer_zone_name' },
    { text: trans('Date', lang), value: 'date' },
    { text: trans('Cash Amount', lang), value: 'cash_amount' },
    { text: trans('K-Pay Amount', lang), value: 'kpay_amount' },
    { text: trans('KBZ Bank', lang), value: 'kbz_amount' },
    { text: trans('CB Pay', lang), value: 'cb_pay_amount' },
    { text: trans('CB Bank', lang), value: 'cb_amount' },
    { text: trans('AYA Pay', lang), value: 'aya_pay_amount' },
    { text: trans('AYA Bank', lang), value: 'aya_amount' },
    { text: trans('Wave', lang), value: 'wave_pay_amount' },
    { text: trans('Discount', lang), value: 'total_discount' },
    { text: trans('Total', lang), value: 'grand_total' }
  ]
}
const saleItemReportHeader = (lang) => {
  return [
    { text: trans('Category', lang), value: 'category_name' },
    { text: trans('Name', lang), value: 'name', sortable: false },
    { text: trans('Item Code', lang), value: 'item_code', sortable: false },
    { text: trans('Price', lang), value: 'price', sortable: false },
    { text: trans('Total Items', lang), value: 'total_item', sortable: false },
    { text: trans('Grand Total', lang), value: 'grand_total', sortable: false }
  ]
}
const saleReportHeader = (lang) => {
  return [
    { text: trans('Invoice No', lang), value: 'invoice_no' },
    { text: trans('Name', lang), value: 'customer_name' },
    { text: trans('Phone', lang), value: 'customer_phone' },
    { text: trans('City', lang), value: 'customer_city_name' },
    { text: trans('Zone', lang), value: 'customer_zone_name' },
    { text: trans('Source', lang), value: 'source' },
    { text: trans('Amt', lang), value: 'total_amount' },
    { text: trans('Discount', lang), value: 'total_discount' },
    { text: trans('Delivery', lang), value: 'delivery_amount' },
    { text: trans('Grand Total', lang), value: 'grand_total' },
    { text: trans('Paid', lang), value: 'paid_amount' },
    { text: trans('Outstanding', lang), value: 'outstanding_amount' }
  ]
}

const bottleItemReportHeader = (lang) => {
  return [
    { text: trans('No', lang), value: 'No' },
    { text: trans('Marathon Vr-No', lang), value: 'voucher_no' },
    { text: trans('MS Invoice', lang), value: 'invoice_no' },
    { text: trans('Customer Name', lang), value: 'customer_name' },
    { text: trans('Phone', lang), value: 'customer_phone' },
    { text: trans('10v_qty', lang), value: 'qty_10v' },
    { text: trans('5v_qty', lang), value: 'qty_5v' }
  ]
}

const saleSheetReportHeader = (lang) => {
  return [
    { text: trans('Date', lang), value: 'date' },
    { text: trans('Mate Sat Invoice', lang), value: 'mate_sate_invoice' },
    { text: trans('Marathon Invoice', lang), value: 'marathon_invoice' },
    { text: trans('Deliver Status', lang), value: 'delivery_status' },
    { text: trans('Return Date', lang), value: 'return_date' },
    { text: trans('CustomerName ', lang), value: 'customer_name' },
    { text: trans('Phone Number', lang), value: 'customer_phone' },
    { text: trans('Product Name', lang), value: 'product_name' },
    { text: trans('Qty', lang), value: 'qty' },
    { text: trans('Unit', lang), value: 'unit' },
    { text: trans('Unit Qty', lang), value: 'unit_qty' },
    { text: trans('Unit Price', lang), value: 'unit_price' },
    { text: trans('Selling Price ', lang), value: 'selling_price' },
    { text: trans('Total Price', lang), value: 'total_price' },
    { text: trans('Total Price Per Voucher', lang), value: 'total_price_per_voucher' },
    { text: trans('Amount To Collect', lang), value: 'amount_to_collect' },
    { text: trans('Amount Collect per Voucher', lang), value: 'amount_collect_per_voucher' },
    { text: trans('Marathon', lang), value: 'marathon' },
    { text: trans('Payment Method', lang), value: 'payment_method' },
    { text: trans('Payment Gateway', lang), value: 'payment_gateway' },
    { text: trans('Remark', lang), value: 'remark' }
  ]
}

const purchaseOrderHeader = (lang) => {
  return [
    { text: trans('Porder No', lang), value: 'invoice_no' },
    { text: trans('Name', lang), value: 'resourceable.name' },
    { text: trans('Phone', lang), value: 'resourceable.phone' },
    { text: trans('City', lang), value: 'resourceable.city.name' },
    { text: trans('Zone', lang), value: 'resourceable.zone.name' },
    { text: trans('Amount', lang), value: 'total_amount' },
    { text: trans('Discount', lang), value: 'total_discount' },
    { text: trans('Grand Total', lang), value: 'grand_total' },
    { text: trans('Paid Amount', lang), value: 'paid_amount' },
    { text: trans('Confirm', lang), value: 'confirm' },
    { text: trans('Type', lang), value: 'resourceable_type' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
const purchaseOrderItemHeader = (lang) => {
  return [
    { text: trans('Action', lang), value: 'actions', hideable: true },
    { text: trans('Product', lang), value: 'product_name' },
    { text: trans('Qty', lang), value: 'qty' },
    { text: trans('Price', lang), value: 'price' },
    { text: trans('Sub Price', lang), value: 'amount' }

  ]
}
// Stock
const stockHeader = (lang) => {
  return [
    { text: trans('Name', lang), value: 'product_name' },
    { text: trans('Product Code', lang), value: 'product_item_code' },
    { text: trans('Price', lang), value: 'product_price' },
    { text: trans('QTY', lang), value: 'qty' },
    { text: trans('Error Qty', lang), value: 'error_qty' },
    { text: trans('Action', lang), value: 'actions' }
  ]
}
const stockDetailHeader = (lang) => {
  return [
    // { text: trans('Name', lang), value: 'product_id' },
    { text: trans('Credit', lang), value: 'credit' },
    { text: trans('Debit', lang), value: 'debit' },
    { text: trans('Balance', lang), value: 'balance' },
    { text: trans('Type', lang), value: 'resourceable_type' },
    { text: trans('Note', lang), value: 'remark' }
  ]
}

const errorProductsHeader = (lang) => {
  return [
    { text: trans('Error Date', lang), value: 'date' },
    { text: trans('Product Name', lang), value: 'product_name' },
    { text: trans('Name', lang), value: 'resourceable_name' },
    { text: trans('Error Qty', lang), value: 'qty' },
    { text: trans('Note', lang), value: 'note' }
  ]
}

export default {
  onlyTwoFieldHeader,
  onlyOneFieldHeader,
  // top
  customerHeader,
  supplierHeader,
  // general
  zoneHeader,
  // store
  productHeader,
  // super
  bankInformationHeader,
  userHeader,
  // order
  orderHeader,
  orderItemHeader,
  customerOrderHeader,
  customerSaleHeader,
  // sale
  saleHeader,
  saleDeliveryHeader,
  // bottle
  bottleHeader,
  bottleHistoriesHeader,
  bottleItemsHeader,
  // paymenthistory
  paymentHistoryHeader,
  // reports
  dailySaleHeader,
  saleItemReportHeader,
  saleReportHeader,
  bottleItemReportHeader,
  saleSheetReportHeader,
  // purchase order
  purchaseOrderHeader,
  purchaseOrderItemHeader,
  // Stock
  stockHeader,
  stockDetailHeader,
  // Error Product
  errorProductsHeader
}
