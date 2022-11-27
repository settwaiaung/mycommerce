import localforage from 'localforage'
export const state = () => ({
  merchantJWT: '',
  merchant: null,
  merchantCities: [],
  merchantZones: [],
  merchantDeliStatuses: []
})

export const mutations = {
  setMerchantJwt (state, jwt) {
    state.merchantJWT = jwt
  },
  setMerchant (state, user) {
    state.merchant = user
  },
  resetAuth (state) {
    state.merchantJWT = ''
    state.merchant = ''
  },
  setMerchantCities (state, val) {
    state.merchantCities = val
  },
  setMerchantZones (state, val) {
    state.merchantZones = val
  },
  setMerchantDeliStatuses (state, val) {
    state.merchantDeliStatuses = val
  }
}

export const actions = {
  resetAuth ({ commit }) {
    commit('resetAuth')
  },
  setMerchantJwt ({ commit }, jwt) {
    commit('setMerchantJwt', jwt)
  },
  setMerchant ({ commit }, user) {
    commit('setMerchant', user)
  },
  async clearAuth ({ commit }) {
    await localforage.clear()
    commit('resetAuth')
  },
  setTotalCartCount ({ commit }) {
    commit('setTotalCartCount')
  },
  async merchantLogin ({ commit, dispatch }, that) {
    // try {
    try {
      const { message, status, data } = await this._vm.$request.Login(
        this._vm.$url.MERCHANT_LOGIN_URL,
        {
          username: process.env.merchantUsername,
          password: process.env.merchantPassword
        }
      )
      if (status === 1) {
        commit('setMerchantJwt', data.access_token)
        commit('setMerchant', data.user)
        await localforage.setItem('merchantJWT', data.access_token)
        await localforage.setItem('merchant', data.user)
        // dispatch('fetchMerchantCities', this.merchantJWT, that)
      }
      if (status === 2) {
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      dispatch('handleException', { error }, { root: true })
    }
  },
  async fetchMerchantCities ({ commit, dispatch }, merchantJWT, that) {
    try {
      const { message, status, data } = await this._vm.$request.fetchData(`${this._vm.$url.MERCHANT_CITY_URL}`, merchantJWT)
      if (status === 1) {
        commit('setMerchantCities', data)
      } else {
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      dispatch('handleException', { error }, { root: true })
    }
  },
  async fetchMerchantZones ({ commit, dispatch }, merchantJWT, that) {
    try {
      const { message, status, data } = await this._vm.$request.fetchData(`${this._vm.$url.MERCHANT_ZONE_URL}`, merchantJWT)
      if (status === 1) {
        // await localforage.setItem('stored:merchant_zones', data)
        // commit('setMerchantZones', data)
        commit('setMerchantZones', data)
      } else {
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      dispatch('handleException', { error }, { root: true })
    }
  },
  async fetchMerchantDeliStatuses ({ commit, dispatch }, merchantJWT, that) {
    try {
      const { message, status, data } = await this._vm.$request.fetchData(`${this._vm.$url.MERCHANT_DELIVERY_STATUS_URL}`, merchantJWT)
      if (status === 1) {
        // await localforage.setItem('stored:merchant_zones', data)
        // commit('setMerchantZones', data)
        commit('setMerchantDeliStatuses', data)
      } else {
        dispatch('handleStatus', { status, message, that }, { root: true })
      }
    } catch (error) {
      dispatch('handleException', { error }, { root: true })
    }
  }
  // handleException ({ dispatch }, { error }) {
  //   const message = typeof error === 'object' && error.response ? error.response.data.message : `${error} !`
  //   dispatch('openSnackBar', message, 'error')
  // },
  // openSnackBar ({ commit }, snackbarMessage, snacColor) {
  //   commit('setSnackMessage', snackbarMessage, { root: true })
  //   commit('setSnackColor', snacColor, { root: true })
  //   commit('setShowSnack', true, { root: true })
  // }
}

export const getters = {
  merchantJWT: ({ merchantJWT }) => merchantJWT,
  merchant: ({ merchant }) => merchant,
  isAuthenticated: ({ merchantJWT }) => !!merchantJWT,
  merchantCities: ({ merchantCities }) => merchantCities,
  merchantZones: ({ merchantZones }) => merchantZones,
  merchantDeliStatuses: ({ merchantDeliStatuses }) => merchantDeliStatuses
}
