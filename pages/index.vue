<template>
  <div />
</template>

<script>
export default {
  // middleware: ['checkAuth'],
  // middleware: ["auth"],
//   layout: 'clean',
//   created () {
//     this.$router.push('/dashboard')
//   }
  middleware: ['isAuth'],
  asyncData (context) {
    if (!context.store.getters.isAuthenticated) {
      context.redirect('/login')
    }
  }
}
</script>
