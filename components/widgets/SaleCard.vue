<template>
  <v-row>
    <v-col
      v-for="(data,index) in statisticsData"
      :key="index"
      cols="12"
      md="3"
    >
      <v-card class="pa-1" min-height="140">
        <v-card-text class="d-flex flex-row jsutify-space-between">
          <div>
            <p class="text-h5 font-weight-bold">
              {{ data.title }}
            </p>
            <strong class="text-h6 font-weight-bold">
              {{ data.total }}
            </strong>
            <p class="mb-0">
              <!-- <v-icon :color="resolveStatisticsIconVariation (data.title).color">
                mdi-trending-up
              </v-icon> -->
              <span v-if="data.weekly_amount" :class="`${resolveStatisticsIconVariation (data.title).color}--text`" />
            </p>
          </div>
          <v-spacer />
          <v-avatar
            color="primary"
            class="elevation-1 pa-0"
          >
            <v-icon
              dark
              color="white ma-0"
              large
              class="tw-animate-bounce"
            >
              {{ resolveStatisticsIconVariation (data.title).icon }}
            </v-icon>
          </v-avatar>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>

export default {
  props: {
    statisticsData: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    statisticsDataOld: [
      {
        title: 'Sales',
        total: '245k'
      },
      {
        title: 'Product',
        total: '12.5k'
      },
      {
        title: 'Profit',
        total: '$154k'
      },
      {
        title: 'Customers',
        total: '88k'
      }
    ]
  }),
  methods: {
    resolveStatisticsIconVariation (data) {
      if (data === 'Weekly Sales') { return { icon: 'mdi-trending-up', color: 'info' } }
      if (data === 'Total Products') { return { icon: 'mdi-package-variant-closed', color: 'success' } }
      if (data === 'Total Profit') { return { icon: 'mdi-currency-usd', color: 'warning' } }
      if (data === 'Total Customers') { return { icon: 'mdi-account-group', color: 'error' } }

      return { icon: 'mdi-account-outline', color: 'success' }
    }
  }
}
</script>
