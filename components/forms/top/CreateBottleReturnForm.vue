<template>
  <v-stepper-content class="pa-0" step="3">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />
      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveZone" @keyup.enter="onSaveZone">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Product' }}
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-1"
              @click="closeForm()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="disabledButton"
              color="primary"
              type="submit"
              :loading="isLoading"
            >
              {{ model.id?'Update':'Save' }}
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="py-0"
                offset-md="6"
              >
                <!-- customer -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Customer"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.customer"
                    label="Customer *"
                    :items="JSON.parse(JSON.stringify(customer_data))"
                    item-text="name"
                    return-object
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- product -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Product"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.product"
                    label="Product *"
                    :items="JSON.parse(JSON.stringify(product_data))"
                    item-text="product_name"
                    return-object
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantity"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.qty"
                    label="Quantity"
                    dense
                    single-line
                    class="qtyField"
                    :error-messages="errors"
                    outlined
                    @keypress="isQty($event)"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </validation-observer>
    </v-card>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        requiredPassword: false
      })
    }
  },
  data: () => {
    return {
      cities: [],
      disabledButton: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      customer_data: 'order/customer_data',
      product_data: 'order/product_data'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
  },
  methods: {
    async onSaveZone () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const create_payload = this.$model.CREATE_BOTTLE_RETURN_PAYLOAD(this.model)
        const { message, status } = (await this.$request.postData(this.$url.BOTTLE_URL, create_payload, this.jwt))
        if (status === 1) {
          successMessage = 'Success: New Bottle Return was Created!.'
          this.closeForm(this.model, 'created')
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
      return this.closeFormDialog(this)
    }
  }
}
</script>
