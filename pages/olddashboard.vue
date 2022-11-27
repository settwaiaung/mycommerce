<template>
  <v-container fluid>
    <Welcomebanner />
    <v-layout row wrap>
      <!-- mini chart -->
      <v-flex lg3 sm6>
        <mini-chart
          title="Monthly Sales"
          sub-title="10%"
          icon="trending_up"
          :data="dataset.monthVisit"
          :chart-color="color.blue.base"
          type="bar"
        />
      </v-flex>
      <v-flex lg3 sm6>
        <mini-chart
          title="Daily Visit"
          sub-title="20%"
          icon="trending_up"
          :data="dataset.monthVisit"
          :chart-color="color.green.base"
          type="area"
        />
      </v-flex>
      <v-flex lg3 sm6>
        <v-card>
          <v-card-text>
            <div class="layout row ma-0 align-center justify-space-between">
              <div class="text-box">
                <div class="subheading pb-2">
                  Bounce Rate
                </div>
                <span class="grey--text">-10% <v-icon small color="green">trending_down</v-icon> </span>
              </div>
              <div class="chart">
                <v-progress-circular
                  :size="60"
                  :width="5"
                  :rotate="360"
                  :value="10"
                  color="success"
                >
                  10
                </v-progress-circular>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex lg3 sm6>
        <mini-chart
          title="Sales Trend"
          sub-title="10%"
          icon="trending_down"
          :data="dataset.monthVisit"
          :chart-color="color.red.base"
          type="line"
        />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex sm12>
        <h4>Box Chart</h4>
      </v-flex>
      <v-flex lg4 sm6 xs12>
        <box-chart
          title="Page views"
          sub-title="10%"
          icon="trending_up"
          :data="dataset.monthVisit"
          :chart-color="[color.blue.darken1]"
          type="area"
        />
      </v-flex>
      <v-flex lg4 sm6 xs12>
        <box-chart
          title="Monthly Sales"
          sub-title="10%"
          icon="trending_up"
          card-color="pink"
          :data="dataset.monthVisit"
          :chart-color="[color.pink.lighten2]"
          type="bar"
        />
      </v-flex>
      <v-flex lg4 sm6 xs12>
        <box-chart
          card-color="indigo"
          title="Page views"
          sub-title="10%"
          icon="trending_up"
          :data="dataset.monthVisit"
          :chart-color="[color.shades.white]"
          type="line"
        />
      </v-flex>
    </v-layout>
    <a
      href="#"
      class="tw-block p-6 max-w-sm
    tw-bg-white tw-rounded-lg
    tw-border tw-border-gray-200
    tw-shadow-md hover:tw-bg-gray-100
    dark:tw-bg-gray-800 dark:tw-border-gray-700
    dark:hover:tw-bg-gray-700"
    >
      <h5 class="mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">Noteworthy technology acquisitions 2021</h5>
      <p class="tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
    </a>
    <v-btn color="info">
      Info Color
    </v-btn>
    <v-btn color="secondary">
      Secondary Color
    </v-btn>
    <v-btn color="accent">
      Accent Color
    </v-btn>
    <v-btn color="success">
      Sucess Color
    </v-btn>
    <v-btn color="warning">
      Warning Color
    </v-btn>
    <v-btn color="error">
      Error Color
    </v-btn>
    Theme
    {{ $vuetify.theme.dark }}
    Sidebar
    {{ $store.state.sidebarDark }}
  </v-container>
</template>
<script>
// import colors from 'tailwindcss/colors'
import Material from 'vuetify/es5/util/colors'
import {
  StackData,
  SinData,
  monthVisitData,
  campaignData,
  locationData
} from '@/static/data/chart'

import Welcomebanner from '@/components/base/WelcomeBanner.vue'
// import SaleCard from '@/components/widgets/SaleCard.vue'
import MiniChart from '@/components/widgets/charts/MiniChart'
import BoxChart from '@/components/widgets/charts/BoxChart'
export default {
  components: {
    Welcomebanner,
    MiniChart,
    BoxChart
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
    color: Material
  }),
  mounted () {
    this.$store.dispatch('setNavShow', false)
    this.$store.dispatch('setBreadCrumbItems', [])
    this.$store.dispatch('setTitle', 'Dashboard')
  },

  methods: {
    reserve () {
      this.loading = true

      setTimeout(() => (this.loading = false), 2000)
    }
  }
}
</script>
