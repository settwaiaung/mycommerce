<template>
  <v-row>
    <v-col md="10">
      <v-card flat>
        <v-card-text>
          <div class="invoice_header">
            <img class="tw-object-scale-down tw-h-40 tw-w-90" src="/google.svg">
            <h2 class="tw-text-2xl tw-font-extrabold">
              Invoice
            </h2>
          </div>
          <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
            <div class="tw-p-1 tw-col-start-1 tw-col-end-3">
              <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
                Invoice For
              </p>
              <p>{{ saleInfo.customer_name }}</p>
              <p>{{ saleInfo.customer_address }}</p>
              <p>{{ saleInfo.customer_zone_name }},{{ saleInfo.customer_city_name }}</p>
            </div>
            <div class="tw-p-1 tw-col-end-7 tw-col-span-2">
              <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
                Invoice No.
              </p>
              <p>{{ saleInfo.order_no }}</p>
              <p>No. 1006, Kyeik Latt Lane,Yazathingaha Housing(1)</p>
              <p>Yangon</p>
            </div>
          </div>
          <v-simple-table dense class="px-0">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Qty
                  </th>
                  <th class="text-left">
                    Price
                  </th>
                  <th class="text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in saleInfo.sale_items"
                  :key="item.id"
                >
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.price }}</td>
                  <td class="text-right">
                    {{ item.amount }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider />
          <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
            <div class="tw-pt-4 tw-pl-1 tw-my-0 tw-col-start-5 tw-text-left">
              <p>Sub Total:</p>
              <p>Discount:</p>
              <p>Grand Total:</p>
            </div>
            <div class="tw-p-4 tw-col-end-7 text-right">
              <p>{{ saleInfo.total_amount }}</p>
              <p>{{ saleInfo.total_overall_discount }}</p>
              <p>{{ saleInfo.grand_total_amount }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="2" class="print:tw-hidden">
      <button
        class="
      tw-outline
      tw-outline-1
      tw-text-indigo-400 py-2 px-4 mb-1
      tw-rounded tw-shadow hover:tw-shadow-xl
      tw-duration-300"
        @click="$router.push('/sales')"
      >
        <v-icon
          dark
          color="primary"
        >
          mdi-arrow-left-bold-box
        </v-icon>
        Back
      </button>
      <button
        onclick="window.print()"
        class="
      tw-bg-indigo-400 py-2 px-4
      tw-rounded tw-shadow hover:tw-shadow-xl
      tw-duration-300"
      >
        Print This Page
      </button>
    </v-col>
    <SnackBar />
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    loadingData: false,
    saleInfo: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(`${this.$url.SALE_URL}/${this.$route.params.id}`, this.jwt)
      if (status === 1) {
        this.saleInfo = data
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
      jwt: 'auth/jwt'
    })
  }
}
</script>
