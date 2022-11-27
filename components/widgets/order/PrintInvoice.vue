<template>
  <div v-if="customer&& Object.keys(customer).length>0">
    <div class="tw-flex print:tw-hidden">
      <v-spacer />
      <button
        class="

      tw-outline
      tw-outline-1
      tw-text-indigo-400 py-2 px-4
      tw-rounded tw-shadow hover:tw-shadow-xl
      tw-duration-300"
        @click="showPrint=!showPrint"
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
        tw-mx-2
      tw-bg-indigo-400 py-2 px-4
      tw-rounded tw-shadow hover:tw-shadow-xl
      tw-duration-300"
      >
        Print This Page
      </button>
    </div>
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
        <p>{{ customer.name }}</p>
        <p>{{ customer.address }}</p>
        <p>{{ customer.zone.name }},{{ customer.city.name }}</p>
      </div>
      <div class="tw-p-1 tw-col-end-7 tw-col-span-2">
        <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
          Invoice No.
        </p>
        <p>{{ model.order_no }}</p>
        <p>No. 1006, Kyeik Latt Lane,Yazathingaha Housing(1)</p>
        <p>Yangon</p>
      </div>
    </div>
    <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2 tw-bg-indigo-300">
      <div class="tw-p-1 tw-col-start-1">
        <p>No.</p>
      </div>
      <div class="tw-p-1 tw-col-start-2 tw-col-end-4">
        <p>Name</p>
      </div>
      <div class="tw-p-1 tw-col-start-4">
        <p>Qty</p>
      </div>
      <div class="tw-p-1 tw-col-start-5">
        <p>Amount</p>
      </div>
    </div>
    <!-- <div
      v-for="(item,i) in model.order_items"
      :key="i"
      class="tw-grid tw-grid-cols-6 tw-gap-4"
    >
      <div class="tw-p-1 tw-col-start-1">
        <p>{{ i+1 }}</p>
      </div>
      <div class="tw-p-1 tw-col-start-2 tw-col-end-4">
        <p>{{ item.product_name }}</p>
      </div>
      <div class="tw-p-1 tw-col-start-4">
        <p>{{ item.qty }}</p>
      </div>
      <div class="tw-p-1 tw-col-start-5">
        <p>{{ item.amount }}</p>
      </div>
      <v-divider class="tw-flex" />
    </div> -->
    <div
      v-for="(item,i) in model.order_items"
      :key="i"
      class="tw-grid tw-grid-rows-1 tw-gap-1 tw-align-center"
    >
      <div
        class="tw-grid tw-grid-cols-6 tw-gap-4 tw-content-center"
      >
        <div class="tw-pt-3 tw-my-0 tw-col-start-1">
          <p>{{ i+1 }}</p>
        </div>
        <div class="tw-pt-3 tw-my-0 tw-col-start-2 tw-col-end-4">
          <p>
            {{ item.product_name }}
          </p>
        </div>
        <div class="tw-pt-3 tw-my-0 tw-col-start-4">
          <p>{{ item.qty }}</p>
        </div>
        <div class="tw-pt-3 tw-my-0 tw-col-start-5">
          <p>{{ item.amount }}</p>
        </div>
      </div>
      <v-divider />
    </div>
    <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
      <div class="tw-pt-3 tw-my-0 tw-col-start-3 tw-col-end-5 tw-text-right">
        <p>Sub Total</p>
        <p>Discount</p>
        <p>Grand Total</p>
      </div>
      <div class="tw-pt-3 tw-col-end-7 tw-col-span-2">
        <p>{{ model.total_amount }}</p>
        <p>{{ model.total_overall_discount }}</p>
        <p>{{ model.grand_total_amount }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => {}
    },
    customer: {
      type: Object,
      default: () => {}
    }
  },
  // data: () => ({
  //   model: {}
  // }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    showPrint: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.$store.dispatch('setDrawer', false)
  },
  methods: {
    print () {
      setTimeout(() => window.print(), 1000)
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
    }
  }
}
</script>
