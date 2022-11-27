<template>
  <v-card v-if="model&& Object.keys(model).length>0" id="print_component" flat>
    <v-card-text>
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
        <img class="tw-object-scale-down mt-6 tw-h-40 tw-w-90 rounded-full" src="@/static/logos/matesat.png">
        <!-- <h2 class="tw-text-2xl tw-font-extrabold">
          Order
        </h2> -->
      </div>
      <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
        <div class="tw-p-1 tw-col-start-1 tw-col-end-3">
          <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
            Order For
          </p>
          <p>{{ model.customer.name }}</p>
          <p>{{ model.customer.phone }},{{ model.customer.another_phone }}</p>
          <p>{{ model.customer.address }}</p>
        </div>
        <div class="tw-p-1 tw-col-end-7 tw-col-span-2 tw-text-right">
          <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
            Order No.
          </p>
          <p>{{ model.invoice_no }}</p>
          <p>{{ model.customer.zone.name }},{{ model.customer.city.name }}</p>
          <p>
            {{ model.purchase_date }}
          </p>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
        <div class="tw-p-1 tw-col-start-1 tw-col-end-7">
          <p>{{ model.note }}</p>
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
                Bottle Return
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
              v-for="item in model.purchase_order_items"
              :key="item.id"
            >
              <td>{{ item.product_name }}</td>
              <td>{{ item.bottle_return }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ curFm(item.price) }}</td>
              <td class="text-right">
                {{ curFm(item.amount) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider />
      <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
        <div class="tw-pt-4 tw-pl-1 tw-my-0 tw-col-start-5 tw-text-right">
          <p>Sub Total:</p>
          <p>Discount:</p>
          <p>Grand Total:</p>
        </div>
        <div class="tw-p-4 tw-col-end-7 text-right ">
          <p>{{ curFm(model.total_amount ) }}</p>
          <p>{{ curFm(model.total_discount )||0 }}</p>
          <p>{{ curFm(model.grand_total ) }}</p>
        </div>
      </div>
    </v-card-text>
    <div style="margin-top:20px;flex:1;display: flex;justify-content: 'space-between';">
      <p style="width:50%;">
        Created By: {{ model.created_user.name }}
      </p>
      <p style="width:50%;text-align: right;">
        Note : {{ model.note }}
      </p>
    </div>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => {}
    }
  },
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
