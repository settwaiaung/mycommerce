<template>
  <v-flex v-if="!hideSaleButton" class="tw-bg-indigo-50 py-1 justify-center d-flex">
    <v-btn
      v-show="!hideSaleButton"
      class="mx-autox"
      elevation="2"
      color="secondary"
      outlined
      @click="makeSale"
    >
      Make Sale Invoice
    </v-btn>
    <ConfirmPassword
      v-model="step"
      :password-step="1"
      @confirmSuccess="confirmSuccess"
    />
  </v-flex>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MakeSale',
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    value: Boolean
  },
  data: () => ({
    loadingData: false,
    step: 1
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
    }
  },
  methods: {
    onConfirmPassword () {
      this.$emit('onConfirmPassword')
    },
    async confirmSuccess (password) {
      await this.makeSale()
    },
    async makeSale () {
      let successMessage = ''
      try {
        this.loadingData = true
        const create_payload = { order_id: this.order.id }
        const { data, message, status } = await this.$request.postData(`${this.$url.SALE_URL}`, create_payload, this.jwt)
        if (status === 1) {
          this.hideSaleButton = true
          this.loadingData = false
          successMessage = `Success: Order "${this.order.order_no} was changed to Sale ${data.invoice_no}"!.`
          this.$emit('onMadeSale')
        } else {
          this.loadingData = false
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
    }
  }
}
</script>
