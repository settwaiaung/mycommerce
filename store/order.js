export const state = () => ({
  customer_data: [],
  product_data: [],
  showOrderForm: false
})
export const mutations = {
  setCustomerData (state, customers) {
    state.customer_data = customers
  },
  setProductData (state, products) {
    state.product_data = products
  },
  setShowOrderForm (state, value) {
    state.showOrderForm = value
  },
  updateProducts (state, data) {
    data = (({ id, name, item_code, price }) => ({ product_id: id, product_name: name, product_item_code: item_code, price, qty: 1, discount_amount: 0 }))(data)
    const foundIndex = state.product_data.findIndex(
      (product) => {
        return product.product_id === data.product_id
      }
    )
    state.product_data.splice(foundIndex, 1, {
      ...data
    })
  },
  deleteProducts (state, data) {
    const foundIndex = state.product_data.findIndex(
      product => product.id === data.id
    )
    state.product_data.splice(foundIndex, 1)
  },
  updateCustomers (state, data) {
    data = (({
      id, name, phone,
      city, zone
    }) => ({
      id,
      name,
      phone,
      city,
      zone
    }))(data)
    const foundIndex = state.customer_data.findIndex(
      (customer) => {
        return customer.id === data.id
      }
    )
    state.customer_data.splice(foundIndex, 1, {
      ...data
    })
  },
  deleteCustomers (state, data) {
    const foundIndex = state.customer_data.findIndex(
      customer => customer.id === data.id
    )
    state.customer_data.splice(foundIndex, 1)
  }
}
export const actions = {
  setCustomerData ({ commit }, customers) {
    commit('setCustomerData', customers)
  },
  setProductData ({ commit }, products) {
    commit('setProductData', products)
  },
  setShowOrderForm ({ commit }, data) {
    commit('setShowOrderForm', data)
  },
  setShowPurchaseOrderForm ({ commit }, data) {
    commit('setShowPurchaseOrderForm', data)
  },
  async getOrderableCustomers ({ dispatch }, jwt, that) {
    try {
      const { data, message, status } = await this._vm.$request.fetchData(this._vm.$url.CUSTOMER_URL, jwt)
      if (status === 1) {
        const customers = data.map((cus) => {
          const customer = (({
            id, name, phone,
            city, zone
          }) => ({
            id,
            name,
            phone,
            city,
            zone
          }))(cus)
          return customer
        })
        dispatch('setCustomerData', customers)
      } else {
        // that.handleStatus({ status, message, that })
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      // dispatch('handleException', { error })
      dispatch('handleException', { error }, { root: true })
    }
  },
  async getOrderableProducts ({ dispatch }, jwt, that) {
    try {
      const { data, message, status } = await this._vm.$request.fetchData(this._vm.$url.PRODUCT_URL, jwt)
      if (status === 1) {
        const products = data.map((prd) => {
          const product = (({ id, name, item_code, price, without_bottle_price }) => ({ product_id: id, product_name: name, product_item_code: item_code, unit_price: parseInt(price), without_bottle_price: parseInt(without_bottle_price), price: parseInt(price), qty: 1, discount_amount: 0, bottle_return: 0, not_include_bottle: false }))(prd)
          return product
        })
        dispatch('setProductData', products)
      } else {
        // dispatch('handleStatus', { status, message, that })
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      // dispatch('handleException', { error })
      dispatch('handleException', { error }, { root: true })
    }
  },
  // onNewOrder ({ dispatch }) {
  //   const breadCrumbs = [
  //     {
  //       text: 'New Order',
  //       disabled: true
  //     }
  //   ]
  //   dispatch('setBreadCrumbItems', breadCrumbs, { root: true })
  //   dispatch('setTitle', '', { root: true })
  //   dispatch('setNavShow', false, { root: true })
  //   dispatch('setShowOrderForm', !this.fetchLoading)
  // },
  // handleStatus ({ dispatch }, { status, message }) {
  //   if (status === 2) {
  //     typeof message === 'object'
  //       ? dispatch('openSnackBar', `Error: ${Object.values(message)[0][0]}`, 'error')
  //       : dispatch('openSnackBar', `Error: ${message}`, 'error')
  //   } else if (status === 3) {
  //     // context.auth.clearAuth()
  //     dispatch('auth/clearAuth', null, { root: true })
  //   }
  //   dispatch('showSnackBar', message, 'error')
  // },
  // handleException ({ dispatch }, { error }) {
  //   const message = typeof error === 'object' && error.response ? error.response.data.message : `${error} !`
  //   dispatch('showSnackBar', message, 'error')
  // },
  // showSnackBar ({ dispatch }, snackbarMessage, snackColor) {
  //   dispatch('setSnackMessage', snackbarMessage, { root: true })
  //   dispatch('setSnackColor', snackColor, { root: true })
  //   dispatch('setShowSnack', true, { root: true })
  // },
  updateProducts ({ commit }, product) {
    commit('updateProducts', product)
  },
  deleteProducts ({ commit }, customer) {
    commit('deleteProducts', customer)
  },
  updateCustomers ({ commit }, customer) {
    commit('updateCustomers', customer)
  },
  deleteCustomers ({ commit }, customer) {
    commit('deleteCustomers', customer)
  }
}
export const getters = {
  customer_data: ({ customer_data }) => customer_data,
  product_data: ({ product_data }) => product_data,
  showOrderForm: ({ showOrderForm }) => showOrderForm
}
