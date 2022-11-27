const data = {
  // start core locale
  new: {
    en: 'New',
    mm: 'အသစ်'
  },
  tableDataLoading: {
    en: '🚀 Loading... Please wait',
    mm: '🚀 ဒေတာ ဆွဲယူနေပါသည်။ ခဏစောင့်ပါ'
  },
  // end core locale
  // start general locale
  Name: {
    en: 'Name',
    mm: 'အမည်'
  },
  MM_Name: {
    en: 'Name MM',
    mm: 'မြန်မာအမည်'
  },
  email: {
    en: 'Email',
    mm: 'အီးမေး(လ်)'
  },
  shopname: {
    en: 'Shop Name',
    mm: 'ဆိုင်အမည်'
  },
  phone: {
    en: 'Phone',
    mm: 'ဖုန်း'
  },
  other_phone: {
    en: 'Other Phone',
    mm: 'တခြားဖုန်း'
  },
  zone: {
    en: 'Zone',
    mm: 'ဇုန်'
  },
  region: {
    en: 'Region',
    mm: 'တိုင်း'
  },
  district: {
    en: 'District',
    mm: 'ခရိုင်'
  },
  ward: {
    en: 'Wards',
    mm: 'ရပ်ကွက်'
  },
  account_code: {
    en: 'Account Code',
    mm: 'အကောင့်ကုဒ်'
  },
  address: {
    en: 'Address',
    mm: 'လိပ်စာ'
  },
  nrc: {
    en: 'NRC Number',
    mm: 'မှတ်ပုံတင်အမှတ်'
  },
  bank: {
    en: 'Bank',
    mm: 'ဘဏ်'
  },
  shop_name: {
    en: 'Shop Name',
    mm: 'ဆိုင်အမည်'
  },
  action: {
    en: 'Actions',
    mm: 'လုပ်ဆောင်ရန်'
  }
  // end general locale
}
const language = (key) => {
  return data[key] ? data[key] : { en: key, mm: key }
}
export default language
