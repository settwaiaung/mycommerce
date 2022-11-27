<template>
  <v-container fluid>
    <div v-shortkey="['ctrl', 'b']" />
    <validation-observer
      ref="observer"
    >
      <v-form ref="form" @submit.prevent="createErrorProduct" @keyup.enter="createErrorProduct">
        <div style="background:white" class="tw-w-full tw-p-10 tw-rounded-md tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center">
          <div class="tw-flex tw-w-[900px] tw-justify-between   ">
            <div class="tw-flex tw-flex-col ">
              <div class="tw-w-[400px] tw-my-5 ">
                <validation-provider
                  v-slot="{ errors }"
                  name="Product"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="product_id"
                    dense
                    label="Product"
                    :items="products"
                    item-text="name"
                    item-value="id"
                    :error-messages="errors"

                    outlined
                    hide-details

                    py-2
                  />
                </validation-provider>
              </div>
              <div class="tw-w-[400px] tw-my-5 ">
                <validation-provider
                  v-slot="{ errors }"
                  name="Type"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="resourceable_type"
                    dense
                    label="Type *"
                    :items="resources"
                    item-text="name"
                    return-object
                    :error-messages="errors"
                    outlined
                    hide-details

                    py-2
                  />
                </validation-provider>
              </div>

              <div class="tw-w-[400px] tw-my-5">
                <validation-provider
                  v-if="resourceable_type === 'Supplier'"
                  v-slot="{ errors }"
                  name="Supplier"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="supplier_id"
                    :error-messages="errors"
                    dense
                    label="Supplier *"
                    :items="customer_data"
                    item-text="name"
                    item-value="id"
                    outlined
                    hide-details
                  />
                </validation-provider>
                <validation-provider
                  v-else
                  v-slot="{ errors }"
                  name="Customer"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="customer_id"
                    :error-messages="errors"
                    dense
                    label="Customer *"
                    :items="customer_data"
                    item-text="name"
                    item-value="id"
                    outlined
                    hide-details
                  />
                </validation-provider>
              </div>

              <div class="tw-w-[400px] tw-my-5">
                <validation-provider
                  v-slot="{ errors }"
                  name="Qty"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="qty"
                    class="tw-h-[40px]"
                    label="Qty"
                    required
                    :error-messages="errors"
                    type="number"
                    outlined
                    hide-details
                    dense
                    @keypress="isNumber($event)"
                  />
                </validation-provider>
              </div>
            </div>

            <div>
              <div class="tw-w-[400px] tw-mt-5 tw-mb-7">
                <validation-provider
                  v-slot="{ errors }"
                  name="Error Date"
                  rules="required"
                >
                  <DatePicker v-model="date" :error-messages="errors" class="px-1" label="Error Date" />
                </validation-provider>
              </div>
              <div class="tw-w-[400px] tw-my-5">
                <v-textarea
                  v-model="note"
                  outlined
                  label="Note"
                  rows="2"
                />
              </div>
            </div>
          </div>
          <div class=" tw-mt-3">
            <v-btn
              color="primary"
              type="submit"
              :loading="isLoading"
              class="tw-px-5 mx-1"
            >
              Create
            </v-btn>
          </div>
        </div>
      </v-form>
    </validation-observer>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    date: '',
    resourceable_type: '',
    customer_id: '',
    supplier_id: '',
    disabledButton: false,
    isLoading: false,
    customer_data: [],
    product_id: [],
    products: [],
    note: '',
    resources: ['Customer', 'Supplier']
  }),
  async fetch () {
    this.isLoading = true
    const { data, message, status } = await this.$request.fetchData(this.$url.PRODUCT_URL, this.jwt)
    if (status === 1) {
      this.products = data
      this.isLoading = false
    } else {
      this.isLoading = false
      this.handleStatus({ status, message, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    })
  },
  watch: {

    resourceable_type: {
      async handler (newVal, oldVal) {
        if (newVal === 'Customer') {
          const { data, message, status } = await this.$request.fetchData(this.$url.CUSTOMER_URL, this.jwt)
          if (status === 1) {
            this.customer_data = data
          } else {
            this.handleStatus({ status, message, that: this })
          }
        } else if (newVal === 'Supplier') {
          const { data, message, status } = await this.$request.fetchData(this.$url.SUPPLIER_URL, this.jwt)
          if (status === 1) {
            this.customer_data = data
          } else {
            this.handleStatus({ status, message, that: this })
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'New Error Product',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'New Error Product')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    async createErrorProduct () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const create_payload = this.$model.CREATE_ERROR_PRODUCT(this)

        const { message, status } = (await this.$request.postData(this.$url.ERROR_PRODUCT_URL, create_payload, this.jwt))
        if (status === 1) {
          successMessage = 'Success'
          this.handleStatus({ status, message, that: this, successMessage })
          await this.$router.push('/error_products')
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.isLoading = false
      this.disabledButton = false
    }
  }
}
</script>
