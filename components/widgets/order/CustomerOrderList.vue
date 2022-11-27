<template>
  <div>
    <v-data-table
      :headers="customerOrderHeader"
      :items="orders"
      :loading="loadingData"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="options.totalcustomerOrders"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    customer: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      orders: [],
      pageCount: 0,
      options: {
        itemsPerPage: 5,
        totalcustomerOrders: 0
      },
      loadingData: false
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    customerOrderHeader () {
      return this.$tableHeaders.customerOrderHeader(this.locale)
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, this.$url.ORDER_URL, event)
        }, 1000)
      },
      deep: true
    }
  },
  methods: {
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta, links } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.orders = data
            this.setPaginationData(this, links, meta)
          }, 700)
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.loadingData = false
    }
  }
}
</script>
