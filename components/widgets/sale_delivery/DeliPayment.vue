<template>
  <v-flex v-if="showPaymentBtn" class="tw-bg-indigo-50 tw-ml-3 py-1 justify-center d-flex">
    <v-btn
      v-show="showPaymentBtn"
      class="mx-auto"
      elevation="2"
      color="secondary"
      outlined
      :disabled="!showPaymentBtn"
      @click="onConfirmPassword"
    >
      Make Payment
    </v-btn>
    <ConfirmPassword
      v-model="step"
      :password-step="2"
      @confirmSuccess="confirmSuccess"
    >
      <v-stepper-content step="1">
        <v-card-title
          class="headline primary"
          primary-title
        >
          Make Delivery Payment
        </v-card-title>
        <validation-observer ref="observer" name="origin_form">
          <v-form ref="form" @submit.prevent="onInitiatePayment" @keyup.enter="onInitiatePayment">
            <v-card-text>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Invoice No
                      </th>
                      <th class="text-left">
                        Voucher No
                      </th>
                      <th class="text-left">
                        Customer
                      </th>
                      <th class="text-left">
                        Qty
                      </th>
                      <th class="text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item,index) in selectedSales"
                      :key="index"
                    >
                      <td>{{ item.invoice_no }}</td>
                      <td>{{ item.delivery_voucher_no }}</td>
                      <td>{{ item.customer_name }}</td>
                      <td>{{ item.total_qty }}</td>
                      <td>{{ item.grand_total }}</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="primary--text">
                        Total
                      </td>
                      <td class="primary--text">
                        {{ totalAmount }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <validation-provider v-slot="{ errors }" name="Payment Method" rules="required">
                <v-autocomplete
                  v-model="payment.payment_method"
                  :items="payment_methods"
                  item-text="name"
                  item-value="name"
                  :error-messages="errors"
                  required
                  label="Payment Method"
                />
              </validation-provider>
              <v-text-field v-model="payment.payment_reference" label="Payment Ref" />
              <v-textarea v-model="payment.note" rows="1" dense outline label="Note" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                outlined
                color="primary"
                @click="onCancelConfirm"
              >
                Cancel
              </v-btn>

              <v-btn
                color="primary"
                type="submit"
                class="mx-2"
              >
                Continue
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-stepper-content>
    </ConfirmPassword>
  </v-flex>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MakeSale',
  props: {
    selectedSales: {
      type: Array,
      default: () => []
    },
    value: Boolean
  },
  data: () => ({
    loadingData: false,
    step: 1,
    payment_methods: [],
    payment: {}
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    showPaymentBtn: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    totalAmount () {
      return this.selectedSales.reduce((total, item) => (total += item.grand_total), 0)
    }
  },
  async beforeMount () {
    this.payment_methods = await this.getFromLocalStorage('stored:payment_methods')
  },
  // Confirm Password Featrue is Removed
  // ConfirmPassword component is used just for dialog
  // some functions related with password confirmation are still kept for future request
  methods: {
    async onInitiatePayment () {
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        return false
      }
      // this.step = 2
      // remove confirm step
      this.makePayment()
    },
    onConfirmPassword () {
      this.$emit('onConfirmPassword')
    },
    onCancelConfirm () {
      this.$emit('onCancelConfirm')
      this.payment = {}
      this.resetForm(this)
    },
    async confirmSuccess (password) {
      await this.makePayment()
    },
    async makePayment () {
      let successMessage = ''
      try {
        this.loadingData = true
        this.payment = { ...this.payment, sale_ids: this.selectedSales.map(sal => sal.id) }
        const { message, status } = await this.$request.postData(`${this.$url.DELIVERY_PAYMENT_URL}`, this.payment, this.jwt)
        if (status === 1) {
          // this.showPaymentBtn = true
          this.loadingData = false
          successMessage = `Success: Amount "${this.totalAmount}" was paid for Sale Delivery"!.`
          this.resetForm(this)
          this.$emit('onCreatedPayment')
          // remove confirm step
          this.$emit('onCancelConfirm')
        } else {
          this.loadingData = false
          this.onConfirmPassword()
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.step = 1
    }
  }
}
</script>
