export default jwt => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`
  }
})
