<template>
  <!-- <v-flex v-if="!hideSaleButton" class="tw-bg-indigo-50 py-1 justify-center d-flex"> -->
  <div class="d-inline">
    <v-btn
      v-show="!hideSaleButton"
      class="mx-auto"
      elevation="2"
      color="secondary"
      outlined
      @click="onConfirmPassword"
    >
      Payment
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
          Make Payment
        </v-card-title>
        <validation-observer ref="observer" name="origin_form">
          <v-form ref="form" @submit.prevent="onInitiatePayment" @keyup.enter="onInitiatePayment">
            <v-card-text>
              <validation-provider v-slot="{ errors }" name="Amount" :rules="{required:true,onlydigit:true,between:{min:50,max:max}}">
                <v-text-field v-model="payment.amount" :error-messages="errors" required label="Amount" type="number" />
              </validation-provider>
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
  </div>
  <!-- </v-flex> -->
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SalePayment',
  props: {
    sale: {
      type: Object,
      default: () => {}
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
    hideSaleButton: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    max () {
      return this.sale.outstanding_amount
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
        const { data, message, status } = await this.$request.postData(`${this.$url.SALE_URL}/${this.sale.id}/create_payment`, this.payment, this.jwt)
        if (status === 1) {
          // this.hideSaleButton = true
          this.loadingData = false
          successMessage = `Success: Amount "${this.payment.amount}" was paid for Sale ${data.invoice_no}"!.`
          this.resetForm(this)
          this.$emit('onCreatedPayment', data)
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
