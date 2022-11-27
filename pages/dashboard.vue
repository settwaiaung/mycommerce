<template>
  <v-container fluid>
    <!-- <Welcomebanner /> -->
    <SaleCard
      :statistics-data="statisticsData"
    />
    <!-- {{ dashboardData.sale_summary }} -->
    <v-row>
      <!-- <v-col cols="12" md="6">
        <SummaryCard :data="saleSummary" />
      </v-col> -->
      <v-col cols="12" md="6">
        <TopProductsCard :products="topProducts" />
      </v-col>
      <v-col cols="12" md="6">
        <TopClientsCard :clients="topClients" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import colors from 'tailwindcss/colors'
import { mapGetters } from 'vuex'
import Material from 'vuetify/es5/util/colors'
import {
  StackData,
  SinData,
  monthVisitData,
  campaignData,
  locationData
} from '@/static/data/chart'

// import Welcomebanner from '@/components/base/WelcomeBanner.vue'
import SaleCard from '~/components/widgets/SaleCard.vue'
// import SummaryCard from '~/components/widgets/SaleSummaryCard.vue'
import TopClientsCard from '~/components/widgets/TopClientsCard.vue'
import TopProductsCard from '~/components/widgets/TopProductsCard.vue'
export default {
  components: {
    // Welcomebanner,
    SaleCard,
    // SummaryCard,
    TopClientsCard,
    TopProductsCard
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    loading: false,
    selection: 1,
    dataset: {
      sinData: SinData,
      monthVisit: monthVisitData,
      campaign: campaignData,
      location: locationData,
      stackData: StackData
    },
    color: Material,
    totalProfit: {
      statTitle: 'Total Profit',
      icon: 'mdi-poll',
      color: 'success',
      subtitle: 'Weekly Project',
      statistics: '$25.6k',
      change: '+42%'
    },
    dashboardData: null,
    // sale_summary_data: [],
    // sale_summary_labels: [],
    saleSummary: [],
    topClients: [],
    topProducts: [],
    statisticsData: []
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.DASHBOARD_URL, this.jwt)
      if (status === 1) {
        this.saleSummary = data.sale_summary
        this.topClients = data.top_customers
        this.topProducts = data.top_products
        this.statisticsData = [
          { title: 'Weekly Sales', total: data.weekly_sale_count },
          { title: 'Sale Amount', total: data.weekly_sale_amount },
          { title: 'Total Products', total: data.product_count },
          { title: 'Total Customers', total: data.customer_count }
        ]
        this.loadingData = false
      } else {
        this.loadingData = false
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    })
  },
  mounted () {
    this.$store.dispatch('setNavShow', false)
    this.$store.dispatch('setBreadCrumbItems', [])
    this.$store.dispatch('setTitle', 'Dashboard')
  }

  // methods: {
  //   reserve () {
  //     this.loading = true
  //     setTimeout(() => (this.loading = false), 2000)
  //   }
  // }
}
</script>
