const Menu = [
  { header: 'Apps' },
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    title: 'Orders',
    group: 'apps',
    icon: 'mdi-cart',
    name: 'Orders',
    href: '/orders'
  },
  {
    title: 'Purchase Orders',
    group: 'apps',
    icon: 'mdi-cart',
    name: 'Purchase Orders',
    href: '/purchase_orders'
  },
  {
    title: 'Sales',
    group: 'apps',
    icon: 'mdi-receipt',
    name: 'Sales',
    href: '/sales'
  },
  {
    title: 'Sale Delivery',
    group: 'apps',
    icon: 'mdi-truck-delivery',
    name: 'Sale Delivery',
    href: '/sale_deliveries'
  },
  {
    title: 'Bottles',
    group: 'apps',
    icon: 'mdi-alpha-b-circle-outline',
    name: 'Bottles',
    href: '/bottles'
  },
  { header: 'Stock' },
  {
    title: 'Stock',
    group: 'Stock',
    icon: 'mdi-storefront-outline',
    name: 'Stock',
    href: '/stocks'
  },
  {
    title: 'Error Products',
    group: 'Stock',
    icon: 'mdi-alert-decagram-outline',
    name: 'Error Products',
    href: '/error_products'
  },
  { header: 'Reports' },
  {
    title: 'Reports',
    group: 'Reports',
    icon: 'mdi-file',
    items: [
      { name: 'daily_sales', title: 'Daily Sales Report', href: '/reports/daily_sales', icon: 'mdi-file' },
      { name: 'sale_items', title: 'Sale Items Report', href: '/reports/sale_items', icon: 'mdi-file' },
      { name: 'sale_report', title: 'Sale Report', href: '/reports/sale_report', icon: 'mdi-file' },
      { name: 'bottle_report', title: 'Bottle Item Report', href: '/reports/bottle_item', icon: 'mdi-file' },
      { name: 'sale_sheet_report', title: 'Sale Sheet Report', href: '/reports/sale_sheet', icon: 'mdi-file' }
    ]
  },
  { header: 'Customers' },
  {
    title: 'CRM',
    group: 'CRM',
    icon: 'mdi-account-group',
    items: [
      { name: 'customers', title: 'Customers', href: '/crm/customers', icon: 'mdi-account-group' },
      { name: 'customer_types', title: 'Customer Types', href: '/crm/customer_types', icon: 'mdi-account-group' }
    ]
  },
  { header: 'Suppliers' },
  {
    title: 'Supplier',
    group: 'Supplier',
    icon: 'mdi-account-group',
    name: 'Supplier',
    href: '/supplier'
  },
  { header: 'Store' },
  {
    title: 'Store',
    group: 'store',
    component: 'store',
    icon: 'mdi-store-cog',
    items: [
      { name: 'categories', title: 'Categories', href: '/store/categories', icon: 'mdi-store-outline' },
      { name: 'products', title: 'Products', badge: 'new', href: '/store/products', icon: 'mdi-store-plus' }
    ]
  },
  { header: 'Meta' },
  {
    title: 'General',
    group: 'components',
    component: 'components',
    icon: 'tune',
    items: [
      { name: 'cities', title: 'Cities', href: '/general/cities', icon: 'mdi-city' },
      { name: 'departments', title: 'Departments', href: '/general/departments', icon: 'mdi-group' },
      { name: 'zones', title: 'Zones', href: '/general/zones', icon: 'mdi-home-battery' },
      { name: 'sources', title: 'Sources', href: '/general/sources', icon: 'mdi-home-battery' }
    ]
  },
  {
    title: 'Super',
    group: 'forms',
    component: 'forms',
    icon: 'edit',
    items: [
      { name: 'banks', title: 'Banks', href: '/super/banks' },
      { name: 'bank_informations', title: 'BankInformation', href: '/super/bank_informations' },
      { name: 'permissions', title: 'Permissions', href: '/super/permissions' },
      { name: 'roles', title: 'Roles', href: '/super/roles' },
      { name: 'users', title: 'Users', href: '/super/users' }
    ]
  }
]
// reorder menu
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      const textA = x.title.toUpperCase()
      const textB = y.title.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }
})

export default Menu
