export default {
  // TOP
  CREATE_CUSTOMER_PAYLOAD: (customer) => {
    const create_customer_payload = {
      name: customer.name,
      phone: customer.phone,
      city_id: customer.city_id,
      zone_id: customer.zone_id,
      address: customer.address,
      email: customer.email,
      another_phone: customer.another_phone,
      membership_no: customer.membership_no,
      is_active: customer.is_active,
      customer_type_id: customer.customer_type_id
    }
    return create_customer_payload
  },
  CREATE_ORDER_PAYLOAD: (order) => {
    const create_order_payload = {
      customer_id: order.id,
      order_items: order.products.map((prd) => {
        prd.price = prd.not_include_bottle ? prd.without_bottle_price : prd.price
        return prd
      }),
      total_overall_discount: order.total_overall_discount,
      note: order.note,
      source: order.source && order.source.name,
      source_id: order.source && order.source.id

    }
    return create_order_payload
  },

  CREATE_BOTTLE_RETURN_PAYLOAD: (order) => {
    const create_bottle_return_payload = {
      customer_id: order.customer.id,
      product_id: order.product.product_id,
      qty: order.qty
    }
    return create_bottle_return_payload
  },
  // GENERAL
  CREATE_CATEGORY_PAYLOAD: (category) => {
    const create_category_payload = {
      name: category.name,
      mm_name: category.mm_name
    }
    return create_category_payload
  },
  CREATE_PRODUCT_PAYLOAD: (product) => {
    const create_product_payload = {
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      unit_qty: product.unit_qty,
      mm_name: product.mm_name ? product.mm_name : '',
      item_code: product.item_code,
      description: product.description ? product.description : '',
      is_available: product.is_available ? 1 : 0,
      file: product.file ? product.file : '',
      exclusive_bottle: product.exclusive_bottle ? 1 : 0,
      lwh: product.lwh ? product.lwh : '',
      weight: product.weight ? product.weight : '',
      without_bottle_price: product.without_bottle_price
    }
    return create_product_payload
  },
  CREATE_CITY_PAYLOAD: (city) => {
    const create_city_payload = {
      name: city.name,
      mm_name: city.mm_name
    }
    return create_city_payload
  },
  CREATE_DEPARTMENT_PAYLOAD: (department) => {
    const create_department_payload = {
      name: department.name
    }
    return create_department_payload
  },
  CREATE_ZONE_PAYLOAD: (zone) => {
    const create_zone_payload = {
      name: zone.name,
      mm_name: zone.mm_name,
      city_id: zone.city_id
    }
    return create_zone_payload
  },
  // End General
  // Start Super
  CREATE_ROLE_PAYLOAD: (role) => {
    const create_role_payload = {
      name: role.name
    }
    return create_role_payload
  },
  CREATE_PERMISSION_PAYLOAD: (permission) => {
    const create_permission_payload = {
      name: permission.name
    }
    return create_permission_payload
  },
  CREATE_USER_PAYLOAD: (user) => {
    const create_user_payload = {
      name: user.name,
      username: user.username,
      password: user.password,
      password_confirmation: user.confirmed_password,
      roles: user.roles,
      department_id: user.department_id,
      phone: user.phone,
      email: user.email,
      address: user.address
    }
    return create_user_payload
  },
  // End Super

  // start Supplier
  CREATE_SUPPLIER_PAYLOAD: (supplier) => {
    const create_supplier_payload = {
      name: supplier.name,
      phone: supplier.phone,
      city_id: supplier.city_id,
      zone_id: supplier.zone_id,
      address: supplier.address,
      email: supplier.email ? supplier.email : '',
      another_phone: supplier.another_phone ? supplier.another_phone : ''
    }
    return create_supplier_payload
  },
  // end Supplier

  // Error Product

  CREATE_ERROR_PRODUCT: (errorProduct) => {
    let create_error_product_payload = {}
    if (errorProduct.resourceable_type === 'Supplier') {
      create_error_product_payload = {
        resourceable_type: errorProduct.resourceable_type,
        product_id: errorProduct.product_id,
        qty: errorProduct.qty,
        supplier_id: errorProduct.supplier_id,
        note: errorProduct.note,
        date: errorProduct.date
      }
    } else {
      create_error_product_payload = {
        resourceable_type: errorProduct.resourceable_type,
        product_id: errorProduct.product_id,
        qty: errorProduct.qty,
        customer_id: errorProduct.customer_id,
        note: errorProduct.note,
        date: errorProduct.date
      }
    }
    return create_error_product_payload
  },

  // Purchase Order
  CREATE_PURCHASEORDER_PAYLOAD: (purchaseorder) => {
    const create_purchaseorder_payload = {
      resourceable_type: purchaseorder.resourceable_type,
      order_items: purchaseorder.products.map((prd) => {
        prd.price = prd.not_include_bottle ? prd.without_bottle_price : prd.price
        return prd
      }),
      total_overall_discount: purchaseorder.total_overall_discount,
      note: purchaseorder.note ? purchaseorder.note : '',
      purchase_date: purchaseorder.purchase_date

    }
    return create_purchaseorder_payload
  }
  // End Purchase Order
}
