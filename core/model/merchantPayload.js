export default {
  CREATE_NEW_VOUCHER_PAYLOAD: (self, deli) => {
    const parcel_items = self.model.sale_items.map(({
    //   product_id,
      item_name,
      qty,
      amount, lwh, weight
    }) => ({
    //   product_id,
      name: item_name,
      qty,
      item_price: self.marathonDeli.is_ntc ? 0 : amount,
      lwh: (parseFloat(lwh).toFixed(3) * parseFloat(qty).toFixed(3)),
      weight: (parseFloat(weight).toFixed(3) * parseFloat(qty).toFixed(3))
    }))

    const parcels = {
      weight: self.total_weight,
      lwh: self.model.sale_items.reduce((lwh, next) => {
        return lwh + (parseFloat(next.lwh).toFixed(3) * parseFloat(next.qty).toFixed(3))
      }, 0),
      // global_scale_id: GET_GLOBAL_ID(parseFloat(self.model.cart.reduce((lwh, next) => {
      //   return lwh + (parseFloat(next.lwh).toFixed(3) * parseFloat(next.qty).toFixed(3))
      // }, 0))),
      global_scale_id: 1,
      parcel_items
    }
    const defaultItem = {
      item_name: 'DefaultItem',
      qty: self.model.total_qty,
      amount: self.marathonDeli.delivery_amount,
      lwh: 20,
      weight: 1,
      item_price: self.marathonDeli.is_ntc ? 0 : self.marathonDeli.delivery_amount
    }
    parcel_items.push(defaultItem)
    const new_voucher_payload = {
      receiver_name: self.model.customer.name,
      receiver_phone: self.model.customer.phone,
      receiver_address: self.model.customer.delivery_address || self.model.customer.address,
      receiver_city_id: self.marathonDeli.receiver_city_id,
      receiver_zone_id: self.marathonDeli.receiver_zone_id,
      bus_station: 0,
      sender_id: self.merchant[0].id,
      sender_city_id: self.merchant[0].city.id,
      sender_zone_id: self.merchant[0].branches.find(branch => branch.is_default).zone.id,
      // global_scale_id: parcels.global_scale_id,
      global_scale_id: 1,
      remark: self.marathonDeli.remark,
      total_weight: self.model.total_weight,
      total_qty: self.model.total_qty,
      total_price: self.marathonDeli.is_ntc ? 0 : self.model.grand_total,
      lwh: parcels.lwh,
      origin_lwh: 20.00,
      origin_weight: '2',
      parcels: [parcels],
      payment_type_id: 2,
      thirdparty_invoice: self.model.invoice_no
    }
    return new_voucher_payload
  }
}
