<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpenFormDialog"
      max-width="400"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          {{ dialogTitle }}
        </v-toolbar>
        <v-card-title class="text-h6" />

        <div class="tw-flex tw-justify-between tw-mb-3 tw-px-5">
          <p>Product Name:</p>
          <p>{{ model.product_name }}</p>
        </div>
        <div class="tw-flex tw-justify-between tw-mb-3 tw-px-5">
          <p>Product Code:</p>
          <p>{{ model.product_item_code }}</p>
        </div>

        <div class="tw-flex tw-justify-between tw-mb-3 tw-px-5">
          <p>Qty:</p>
          <div class=" -tw-mt-5">
            <validation-provider
              v-slot="{ errors }"
              name="Qty"
              :rules="`required|min_value:1`"
            >
              <v-text-field
                v-model="qty"
                class="qty_field "

                required
                :error-messages="errors"
                type="number"
                @keypress="isQty($event)"
              />
            </validation-provider>
          </div>
        </div>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="warning"
            text
            @click="isOpenFormDialog =false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="addStock()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    screen: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    model: {
      id: '',
      name: ''

    },
    qty: 1,
    addStockUrl: '',
    jwt: '',
    isOpenFormDialog: false,
    dialogTitle: 'Add Stock',
    disabledButton: false,
    isLoading: false
  }),
  mounted () {
    this.$parent.$on('addStock', (item, url, jwt) => {
      this.model = item
      this.addStockUrl = url
      this.jwt = jwt
      this.isOpenFormDialog = true
    })
  },
  methods: {
    async addStock () {
      this.disabledButton = true
      if (this.qty <= 0) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const update_payload = { qty: this.qty }
        const { message, status, data } = (await this.$request.putData(`${this.addStockUrl}/${this.model.id}`, update_payload, this.jwt))
        if (status === 1) {
          this.$parent.$emit('addStockedData', data)
          successMessage = `Success: ${this.screen} "${this.model.product_name}" have been updated!.`
          this.isOpenFormDialog = false
        }
        this.handleStatus({ status, message, that: this, successMessage })
        this.qty = 1
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    closeForm () {
      this.isOpenFormDialog = false
    }
  }
}
</script>
