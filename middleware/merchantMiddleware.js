import localforage from 'localforage'
export default async ({ redirect, store }) => {
  const merchantJwt = await localforage.getItem('merchantJWT')
  const merchant = await localforage.getItem('merchant')
  const jwt = await localforage.getItem('jwt')
  const user = await localforage.getItem('user')

  if (!jwt || !user || !merchantJwt || !merchant || jwt === '' || user === '' || merchantJwt === '' || merchant === '') {
    store.dispatch('auth/resetAuth')
    return redirect({ name: 'login' })
  }
  store.dispatch('auth/setJwt', jwt)
  store.dispatch('auth/setUser', user)
  store.dispatch('merchantAuth/setMerchantJwt', merchantJwt)
  store.dispatch('merchantAuth/setMerchant', merchant)
  store.dispatch('merchantAuth/fetchMerchantCities', merchantJwt, { that: this })
  store.dispatch('merchantAuth/fetchMerchantZones', merchantJwt, { that: this })
}
