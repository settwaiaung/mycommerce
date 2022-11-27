
export default {
  UPDATE_ROLE_PAYLOAD: (role) => {
    const permission_id = role.permissions.map((permission) => {
      return permission.id
    })
    const create_role_payload = {
      name: role.name,
      permission: permission_id
    }
    return create_role_payload
  },
  UPDATE_ORDER_PAYLOAD: (order) => {
    const update_order_payload = {
      customer_id: order.customer.id,
      total_overall_discount: order.total_overall_discount,
      note: order.note,
      delivery_address: order.delivery_address,
      source_id: order.source_id,
      source: order.source
    }
    return update_order_payload
  },
  UPDATE_PROFILE_PAYLOAD: (profile) => {
    const update_profile_payload = {
      name: profile.name,
      username: profile.username,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      department_id: profile.department_id,
      old_password: profile.old_password,
      new_password: profile.new_password,
      new_password_confirmation: profile.new_password_confirmation
    }
    return update_profile_payload
  },
  UPDATE_PURCHASEORDER_PAYLOAD: (purchase_order) => {
    const update_purchase_order_payload = {
      purchase_date: purchase_order.purchase_date ? purchase_order.purchase_date : '',
      total_discount: purchase_order.total_discount ? purchase_order.total_discount : '',
      note: purchase_order.note ? purchase_order.note : ''
    }
    return update_purchase_order_payload
  }
}
