const data = {
  // start core locale
  new: {
    en: 'New',
    mm: 'áĄáááş'
  },
  tableDataLoading: {
    en: 'đ Loading... Please wait',
    mm: 'đ ááąááŹ áá˝á˛áá°ááąááŤáááşá ááááąáŹááˇáşááŤ'
  },
  // end core locale
  // start general locale
  Name: {
    en: 'Name',
    mm: 'áĄáááş'
  },
  MM_Name: {
    en: 'Name MM',
    mm: 'ááźááşááŹáĄáááş'
  },
  email: {
    en: 'Email',
    mm: 'áĄáŽá¸ááąá¸(ááş)'
  },
  shopname: {
    en: 'Shop Name',
    mm: 'áá­áŻááşáĄáááş'
  },
  phone: {
    en: 'Phone',
    mm: 'ááŻááşá¸'
  },
  other_phone: {
    en: 'Other Phone',
    mm: 'áááźáŹá¸ááŻááşá¸'
  },
  zone: {
    en: 'Zone',
    mm: 'ááŻááş'
  },
  region: {
    en: 'Region',
    mm: 'áá­áŻááşá¸'
  },
  district: {
    en: 'District',
    mm: 'ááá­áŻááş'
  },
  ward: {
    en: 'Wards',
    mm: 'áááşáá˝ááş'
  },
  account_code: {
    en: 'Account Code',
    mm: 'áĄááąáŹááşáˇááŻááş'
  },
  address: {
    en: 'Address',
    mm: 'áá­ááşááŹ'
  },
  nrc: {
    en: 'NRC Number',
    mm: 'áážááşááŻáśáááşáĄáážááş'
  },
  bank: {
    en: 'Bank',
    mm: 'áááş'
  },
  shop_name: {
    en: 'Shop Name',
    mm: 'áá­áŻááşáĄáááş'
  },
  action: {
    en: 'Actions',
    mm: 'ááŻááşááąáŹááşáááş'
  }
  // end general locale
}
const language = (key) => {
  return data[key] ? data[key] : { en: key, mm: key }
}
export default language
