import localforage from 'localforage'

export default async ({ redirect, store }) => {
  const jwt = await localforage.getItem('jwt')
  const user = await localforage.getItem('user')
  if (!jwt || !user || jwt === '' || user === '') {
    store.dispatch('auth/resetAuth')
    return redirect({ name: 'login' })
  }
  store.dispatch('auth/setJwt', jwt)
  store.dispatch('auth/setUser', user)
}
