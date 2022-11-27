<template>
  <v-col
    md="3"
    class="py-0 section_container"
  >
    <CustomerInfo :customer="order.customer">
      <v-divider />
      <v-flex v-show="!order.status" class="py-1">
        <!-- <v-icon> -->
        <!-- 📦 🛒🏷️🛍️🤝🎁📦 -->
        <!-- 🛍️ ✂️ -->
        <!-- </v-icon> -->
        <v-badge
          color="primary"
          :content="qty"
          class="mx-4"
        >
          <v-icon>
            🛍️
          </v-icon>
        </v-badge>
        <span class="ml-4 font-weight-bold">
          {{ price }}
        </span>
      </v-flex>
      <v-flex v-show="!order.status" class="py-1">
        <v-icon class="mx-4">
          mdi-sale
        </v-icon>
        <span class="ml-4 font-weight-bold">
          {{ discount||0 }}
        </span>
      </v-flex>
      <v-flex v-show="!order.status" class="py-1">
        <v-icon class="mx-4">
          💸
        </v-icon>
        <span class="ml-4 font-weight-bold">
          {{ amount }}
        </span>
      </v-flex>
      <v-flex v-if="!order.status" class="tw-bg-indigo-50 py-1 justify-center d-flex">
        <v-btn
          v-show="!order.status || !hideSaleButton"
          class="mx-autox"
          elevation="2"
          color="secondary"
          outlined
          @click="onConfirmPassword"
        >
          Make Sale Invoice
        </v-btn>
      </v-flex>
      <v-btn
        color="primary"
        depressed
        fab
        small
        outlined
        @click="showOrderHistory=!showOrderHistory"
      >
        <v-icon>{{ showOrderHistory?'mdi-close':'mdi-history' }}</v-icon>
      </v-btn>

      <v-btn
        class="float-right"
        color="info"
        depressed
        fab
        small
        top
        @click="editCustomerInfo=!editCustomerInfo"
      >
        <v-icon>{{ editCustomerInfo?'mdi-close':'mdi-pencil' }}</v-icon>
      </v-btn>
    </CustomerInfo>
    <v-subheader v-show="showOrderHistory">
      HISTORIES
    </v-subheader>
    <v-progress-linear
      v-show="loadingData"
      :indeterminate="loadingData"
      color="primary"
    />
    <v-timeline
      v-if="showOrderHistory && histories.length>0"
      align-top
      dense
    >
      <v-timeline-item
        v-for="(log,index) in histories"
        :key="index"
        color="primary"
        small
        left
        class="pa-1"
      >
        <strong class="mr-2">{{ log.created_by }}</strong>
        <strong>{{ log.status_mm }}</strong>
        <div class="text-caption d-flex flex-row justify-space-between">
          <strong>{{ log.created_date }}</strong>
          <strong class="text-right">{{ log.created_time }}</strong>
        </div>
      </v-timeline-item>
    </v-timeline>
    <ConfirmPassword
      @confirmPassword="confirmPassword"
      @cancelConfirm="cancelConfirm"
    />
    <SnackBar />
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerInfo from '@/components/widgets/customer/CustomerInfo.vue'
export default {
  name: 'OrderHistory',
  components: {
    CustomerInfo
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    order: {
      type: Object,
      default: () => {}
    },
    qty: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    loadingData: false,
    histories: [],
    hideSaleButton: false
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    editCustomerInfo: {
      get () {
        return this.value.editCustomerInfo
      },
      set (value) {
        this.$emit('input', { ...this.value, editCustomerInfo: value })
        // this.$emit('input', value)
      }
    },
    showOrderHistory: {
      get () {
        return this.value.showOrderHistory
      },
      set (value) {
        this.$emit('input', { ...this.value, showOrderHistory: value })
        // this.$emit('input', value)
      }
    }
  },
  watch: {
    'value.showOrderHistory': {
      async handler (newVal, oldVal) {
        if (newVal === true && oldVal !== newVal) {
          try {
            this.loadingData = true
            const { data, message, status } = await this.$request.fetchData(`${this.$url.ORDER_URL}/${this.order.id}/histories`, this.jwt)
            if (status === 1) {
              this.histories = data
              this.loadingData = false
            } else {
              this.loadingData = false
              this.handleStatus({ status, message, that: this })
            }
          } catch (error) {
            this.handleException({ error, that: this })
          }
        }
      },
      deep: true
    }
  },
  methods: {
    onConfirmPassword () {
      this.$emit('onConfirmPassword')
    },
    async confirmPassword (password) {
      await this.makeSale()
      // try {
      //   let { message, status } = (await this.$url.passwordConfirmation(
      //     this,
      //     password
      //   )).data

      //   if (status === 1) {
      //     this.makeSale()
      //   } else {
      //     status = 2
      //     message = 'Password Confirmation Failed!'
      //     this.handleStatus({
      //       status,
      //       message,
      //       that: this,
      //       successMessage: 'Success'
      //     })
      //   }
      // } catch (error) {
      //   this.handleException({ error, that: this })
      // }
    },
    cancelConfirm () {
      // alert('cancel')
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
