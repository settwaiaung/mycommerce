<template>
  <!-- <div id="appRoot"> -->
  <v-app id="inspire" class="app">
    <div v-shortkey="['ctrl', '1']" @shortkey="newOrder" />
    <AppDrawer class="app--drawer" />
    <AppToolbar class="app--toolbar" />
    <!-- <v-main class="tw-bg-gradient-to-r tw-from-indigo-50 tw-to-indigo-100"> -->
    <v-main id="mainElement" :class="{'tw-bg-gradient-to-r tw-from-indigo-50 tw-to-indigo-100':!$vuetify.theme.dark}">
      <!-- <v-main> -->
      <!-- Page Header -->
      <!-- <PageHeader v-show="!showOrderForm" :class="{'tw-h-14 tw-bg-gradient-to-r tw-from-cyan-50 tw-to-blue-100':!$vuetify.theme.dark}" /> -->
      <!-- <div class="page-wrapper"> -->
      <v-container fluid class="page-wrapper px-2 py-0">
        <nuxt />
        <!-- <GlobalOrderForm
          v-show="showOrderForm"
        /> -->
      </v-container>

      <!-- </div> -->
      <v-overlay absolute :value="fetchLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-overlay>
      <SnackBar />
      <!-- App Footer -->
      <v-footer height="auto" class="white pa-3 app--footer d-print-none mt-2 tw-bg-gradient-to-r tw-from-indigo-50 tw-to-indigo-100">
        <span class="caption">&copy; {{ new Date().getFullYear() }}</span>
        <v-spacer />
        <span class="caption mr-1">M-TechSolutions</span>
        <v-icon color="pink" small>
          favorite
        </v-icon>
      </v-footer>
    </v-main>
    <!-- Go to top -->
  </v-app>
  <!-- </div> -->
</template>

<script>
import { mapGetters } from 'vuex'
import AppDrawer from '@/components/base/AppDrawer'
import AppToolbar from '@/components/base/AppToolbar'
export default {
  name: 'Dashboard',
  components: {
    AppDrawer,
    AppToolbar
  },
  data: () => ({
    fetchLoading: false,
    showGlobalOrderForm: false
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    })
  },
  async created () {
    this.fetchLoading = true
    await this.$store.dispatch('order/getOrderableCustomers', this.jwt, this)
    await this.$store.dispatch('order/getOrderableProducts', this.jwt, this)
    this.fetchLoading = false
  },
  methods: {
    async newOrder () {
      await this.$store.dispatch('order/setShowOrderForm', true)
      this.$router.push('/orders/new')
    }
  }

}
</script>
<style>
/* html, body {margin: 0; height: 100%; overflow: hidden} */
html, body {margin: 0; height: 100%}
  .page-wrapper {
    min-height: calc(110vh - 64px);
    /* margin-bottom: 100px; */
    /* margin-bottom: 1px; */
    /* min-height: calc(95.3vh - 64px); */
    /* overflow: hidden; */
  }
  .app--footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  /* for stepper all screens */
.theme--light.v-stepper{
  background-color: inherit !important;
}
.theme--dark.v-stepper{
  background-color: inherit !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
