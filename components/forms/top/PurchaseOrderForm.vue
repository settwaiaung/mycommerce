<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <v-card id="no_print">
      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveOrder" @keyup.enter="onSaveOrder">
          <v-progress-linear
            v-show="isLoading"
            :indeterminate="isLoading"
            color="primary"
          />
          <v-card-title>
            <span class="primary--text mx-0 text-h5">
              {{ model?model.invoice_no:'' }}
            </span>
            <v-spacer />
            <span class="primary--text">Confirm</span>
            <v-icon v-if="model.confirm" color="success">
              mdi-check-circle-outline
            </v-icon>
            <v-icon v-else>
              mdi-checkbox-blank-circle-outline
            </v-icon>
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              :class="{'mx-2':model.status}"
              @click="closeForm()"
            >
              <v-icon
                dark
              >
                mdi-arrow-left-bold-box
              </v-icon>
              Back
            </v-btn>
            <v-btn
              v-if="!model.confirm"
              :disabled="disabledButton"
              color="primary"
              type="submit"
              :loading="isLoading"
              class="mx-2"
            >
              {{ model.id?'Update':'Save' }}
            </v-btn>
            <v-btn color="primary" outlined @click="emitPrint">
              <v-icon color="primary">
                mdi-printer
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col md="3" cols="12" class="section_container">
                <CustomerInfo v-if="model" :customer="model.customer">
                  <v-divider />
                  <v-list color="transparent" flat>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-badge
                          color="primary"
                          :content="totalQty"
                        >
                          <v-icon>
                            🛍️
                          </v-icon>
                        </v-badge>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="text-wrap" v-text="curFm(totalPrice)" />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-for="(item,key) in orderSummary" :key="key" dense>
                      <v-list-item-icon>
                        <v-icon>
                          {{ key }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="text-wrap" v-text="item" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-divider />
                  <div
                    class="d-flex justify-space-between"
                  >
                    <Payment :purchase="model" />
                    <v-btn
                      class="ma-2"
                      :disabled="model.confirm"
                      outlined
                      color="indigo"
                      @click="Confirm"
                    >
                      Confirm
                    </v-btn>
                  </div>

                  <v-row class="tw-mt-3">
                    <v-spacer />
                    <v-btn
                      right
                      depressed

                      class=""
                      elevation="2"
                      color="primary"
                      outlined
                      @click="showPaymentHistory=!showPaymentHistory"
                    >
                      <v-icon>{{ showPaymentHistory?'mdi-close':'mdi-alarm-panel' }}</v-icon>
                    </v-btn>
                  </v-row>
                </CustomerInfo>
              </v-col>
              <v-divider
                vertical
              />

              <v-col
                :md="!editCustomerInfo?'9':'6'"
                cols="12"
                class="py-0 section_container"
              >
                <div v-shortkey="['ctrl', 'i']" @shortkey="saveItem" />
                <v-data-table
                  v-show="!showPaymentHistory"
                  :headers="headers"
                  :items="model.purchase_order_items"
                  hide-default-footer
                >
                  <template #top>
                    <v-toolbar flat>
                      <v-btn
                        v-if="!model.confirm"
                        depressed
                        color="primary"
                        @click="addNew"
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>Add Item
                      </v-btn>
                      <v-spacer />
                      <validation-provider
                        v-slot="{ errors }"
                        name="Order Discount"
                        rules="onlydigit"
                      >
                        <v-text-field
                          v-model="model.total_discount"
                          :disabled="model.confirm"
                          label="Order Discount"
                          :error-messages="errors"
                          type="number"
                          required
                          outlined
                          hide-details
                          dense
                          @keypress="isNumber($event)"
                        />
                      </validation-provider>
                    </v-toolbar>
                  </template>

                  <template v-if="model.status===null" #[`item.actions`]="{ item }">
                    <div v-if="item.id===selectedItem.id">
                      <v-icon color="red" class="mr-3" @click="closeItem">
                        mdi-window-close
                      </v-icon>
                      <v-icon color="info" :disabled="disabledButton" @click="saveItem">
                        mdi-content-save
                      </v-icon>
                    </div>
                    <div v-else>
                      <v-icon color="red" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                      <v-icon color="info" class="mr-3" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </div>
                  </template>
                  <template #[`item.product_name`]="{ item }">
                    <v-autocomplete
                      v-if="item.id===selectedItem.id"
                      v-model="editedProduct"
                      label="Products *"
                      :items="JSON.parse(JSON.stringify(product_data))"
                      item-text="product_name"
                      item-value="product_id"
                      return-object
                      :autofocus="true"
                    />
                    <span v-else>{{ item.product_name }}</span>
                  </template>
                  <template #[`item.bottle_return`]="{ item }">
                    <span v-if="editedProduct&&item.id === selectedItem.id">{{ editedProduct.bottle_return }}</span>
                    <span v-else>{{ item.bottle_return }}</span>
                  </template>
                  <template #[`item.not_include_bottle`]="{ item }">
                    <span v-if="editedProduct&&item.id === selectedItem.id">
                      <v-checkbox
                        v-model="editedProduct.not_include_bottle"
                      />
                    </span>
                    <span v-else>
                      <v-checkbox
                        v-model="item.not_include_bottle"
                        disabled
                      />
                    </span>
                  </template>
                  <template #[`item.unit_price`]="{ item }">
                    <span>{{ curFm(item.unit_price) }}</span>
                  </template>
                  <template #[`item.qty`]="{ item }">
                    <validation-provider
                      v-if="editedProduct&&item.id === selectedItem.id"
                      v-slot="{ errors }"
                      name="Qty"
                      :rules="`required|min_value:1|max_value:${editedProduct.stock}`"
                    >
                      <v-text-field
                        v-model="editedProduct.qty"

                        label="Qty"

                        required
                        :error-messages="errors"
                        class="qtyField"
                        type="number"
                        @keypress="isQty($event)"
                      />
                    </validation-provider>
                    <span v-else>{{ parseInt(item.qty) }}</span>
                  </template>
                  <template #[`item.price`]="{ item }">
                    <validation-provider
                      v-if="editedProduct&&item.id === selectedItem.id"
                      v-slot="{ errors }"
                      name="Price"
                      rules="required|onlydigit"
                    >
                      <v-text-field
                        v-model="editedProduct.price"
                        class="qty_field"
                        label="Price"
                        required
                        :error-messages="errors"
                        type="number"
                        @keypress="isNumber($event)"
                      />
                    </validation-provider>
                    <span v-else>{{ curFm(item.price) }}</span>
                  </template>
                  <template #[`item.amount`]="{ item }">
                    <span
                      v-if="editedProduct&&item.id === selectedItem.id"
                    >
                      {{ editedProduct.qty?curFm(parseInt(editedProduct.price)*parseInt(editedProduct.qty)) :curFm(parseInt(editedProduct.price)) }}
                    </span>
                    <span v-else>{{ curFm(item.amount) }}</span>
                  </template>
                  <template slot="body.append">
                    <tr class="font-weight-bold">
                      <td :colspan="model.status?3:4" />
                      <td>
                        Total Quantity
                      </td>
                      <td>
                        {{ totalQty }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td :colspan="model.status?3:4" />
                      <td>
                        Total Price
                      </td>
                      <td>
                        {{ curFm(totalPrice) }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td :colspan="model.status?3:4" />
                      <td>
                        Total Order Discount
                      </td>
                      <td>
                        {{ curFm(model.total_discount)||0 }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td :colspan="model.status?3:4" />
                      <td>
                        Total Order Amount
                      </td>
                      <td>
                        {{ curFm(totalOrderAmount) }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td :colspan="model.status?3:4" />
                      <td>
                        Paid Amount
                      </td>
                      <td>
                        {{ curFm(paidAmount) }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>

                <v-data-table
                  v-show="showPaymentHistory"
                  :headers="paymentHistoryHeader"
                  :items="model.purchase_order_payments"
                  :loading-text="trans('tableDataLoading')"
                  class="elevation-1"
                >
                  <template #top>
                    <v-toolbar
                      flat
                      color="primary"
                    >
                      Payment History
                    </v-toolbar>
                  </template>
                  <template #[`item.payment_amount`]="{item}">
                    {{ curFm(item.payment_amount) }}
                  </template>
                </v-data-table>

                <v-divider />
                <!-- qty -->
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
import CustomerInfo from '@/components/widgets/customer/CustomerInfo.vue'
import Payment from '~/components/widgets/purchase_order/SalePayment.vue'

export default {
  components: {
    CustomerInfo,
    Payment
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      disabledButton: false,
      isLoading: false,
      showPaymentHistory: false,
      editedIndex: -1,
      product_data: [],
      selectedItem: {
        is_new: false
      },
      editedProduct: {},
      defaultItem: {
        qty: 1,
        price: 0
      },
      iterm_order: '',
      addObj: { },
      showHistory: false,
      editCustomerInfo: false
    }
  },
  async fetch () {
    try {
      const { data, message, status } = await this.$request.fetchData(this.$url.PRODUCT_URL, this.jwt)
      if (status === 1) {
        this.product_data = data.map((prd) => {
          const product = (({ id, name, item_code, price, without_bottle_price }) => ({ product_id: id, product_name: name, product_item_code: item_code, unit_price: parseInt(price), without_bottle_price: parseInt(without_bottle_price), price: parseInt(price), qty: 1, discount_amount: 0, bottle_return: 0, not_include_bottle: false }))(prd)
          return product
        })
      } else {
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale',
      customer_data: 'order/customer_data'
      // product_data: 'order/product_data'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    paymentHistoryHeader () {
      return this.$tableHeaders.paymentHistoryHeader(this.locale)
    },

    headers () {
      return this.$tableHeaders.purchaseOrderItemHeader(this.locale).filter(header =>
        header.hideable ? header.hideable !== this.model.status : header
      )
    },
    history_url () {
      return `${this.$url.ORDER_URL}/${this.model.id}/histories`
    },
    orderSummary () {
      const summary = {
        'mdi-sale': this.curFm(this.total_discount) || 0,
        '💸': this.curFm(this.totalOrderAmount)
      }
      return summary
    },
    totalQty () {
      if (!this.model.purchase_order_items) { return 0 }
      return this.model.purchase_order_items.reduce((qty, item) => {
        return qty + parseInt(item.qty)
      }, 0)
    },
    totalPrice () {
      if (!this.model.purchase_order_items) { return 0 }
      return this.model.purchase_order_items.reduce((price, item) => {
        return price + (parseInt(item.qty) * parseInt(item.price))
      }, 0)
    },
    totalProductDiscount () {
      if (!this.model.purchase_order_items) { return 0 }
      return this.model.purchase_order_items.reduce((discount, item) => {
        return discount + parseInt(item.discount_amount)
      }, 0)
    },
    totalOrderAmount () {
      if (!this.model.purchase_order_items) { return 0 }
      return this.model.total_amount - this.model.total_discount || 0
    },
    paidAmount () {
      if (!this.model.purchase_order_items) { return 0 }
      return this.model.paid_amount || 0
    }
  },
  watch: {
    'editedProduct.product_id': {
      async handler (newVal, oldVal) {
        this.order_item = this.product_data.filter(product => product.product_id === this.editedProduct.product_id)
        if (!newVal) { newVal = oldVal; return }
        this.editedProduct.qty = Object.entries(this.selectedItem).length > 0
          ? this.selectedItem.qty
          : newVal
        try {
          this.disabledButton = true
          const { return_bottle_count, message, status, stock_count } = await this.$request.fetchData(`${this.$url.BOTTLE_RETURN_COUNT_URL}?customer_id=${this.model.customer.id}&product_id=${newVal}`, this.jwt)
          if (status === 1) {
            this.editedProduct.bottle_return = return_bottle_count
            this.editedProduct.stock = stock_count
          } else {
            this.handleStatus({ status, message, that: this })
          }
        } catch (error) {
          this.handleException({ error, that: this })
        }
        this.disabledButton = false
      },
      deep: true
    },
    'editedProduct.not_include_bottle': {
      handler (newVal, oldVal) {
        if (newVal === true) {
          this.editedProduct.not_include_bottle = true
          this.editedProduct.price = this.order_item[0].without_bottle_price
          // if (this.selectedItem.is_new === true) {
          //   this.editedProduct.price = this.editedProduct.without_bottle_price
          // } else {
          //   this.editedProduct.price = this.editedProduct.unit_price
          // }
        } else {
          if (this.selectedItem.is_new === true) {
            this.editedProduct.price = this.editedProduct.unit_price
          } else {
            this.editedProduct.price = this.selectedItem.unit_price
          }
          this.editedProduct.not_include_bottle = false
        }
      },
      deep: true
    }
  },

  mounted () {
    this.$parent.$parent.$on('deletedData', (item) => {
      const index = this.model.purchase_order_items.indexOf(item)
      this.model.purchase_order_items.splice(index, 1)
    })
  },
  methods: {
    async onSaveOrder () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const update_payload = this.$model.UPDATE_PURCHASEORDER_PAYLOAD(this.model)
        const { message, status, data } = (await this.$request.putData(`${this.$url.PURCHASEORDER_URL}/${this.model.id}`, update_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Purchase Order "${this.model.invoice_no}"  was Updated!.`
          this.closeForm(data, 'updated')
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.editCustomerInfo = false
      this.showPaymentHistory = false
      this.$emit('onGoBack', data, action)
    },
    editItem (item) {
      this.editedIndex = this.model.purchase_order_items.indexOf(item)
      this.selectedItem = Object.assign({ ...this.selectedItem }, (({ id, qty, price, unit_price }) => ({ id, qty: parseInt(qty), price: parseInt(price), unit_price: parseInt(unit_price) }))(item))
      this.editedProduct = Object.assign({}, (({ product_id, product_name, product_item_code, qty, price, amount, discount_amount, not_include_bottle }) => ({ product_id, product_name, product_item_code, qty, price, amount, discount_amount, not_include_bottle }))(item))
    },
    closeItem () {
      setTimeout(() => {
        // this.editedItem = Object.assign({}, this.defaultItem)
        this.selectedItem = {}
        this.editedProduct = {}
        this.editedIndex = -1
        this.removeAddedObj()
      }, 300)
    },
    addNew () {
      if ('qty' in this.addObj) { return false }
      this.addObj = Object.assign({}, this.defaultItem)
      this.addObj.id = this.model.purchase_order_items.length + 1
      this.model.purchase_order_items.unshift(this.addObj)
      this.selectedItem.is_new = true
      this.editItem(this.addObj)
    },
    removeAddedObj () {
      if (Object.keys(this.addObj).length > 0) {
        const addedIndex = this.model.purchase_order_items.indexOf(this.addObj)
        this.model.purchase_order_items.splice(addedIndex, 1)
        this.addObj = {}
      }
    },
    async saveItem () {
      if (this.editedIndex > -1) {
        // Object.assign(this.model.order_items[this.editedIndex], this.editedItem)
        // this.editedItem = { ...this.editItem, ...this.editedProduct }
        this.isLoading = true
        let successMessage = ''
        if (this.selectedItem.is_new) {
          try {
            const create_payload = Object.assign({ ...this.editedProduct }, { purchase_order_id: this.model.id })
            const { message, status, data } = (await this.$request.postData(this.$url.PURCHASEORDER_ITEM_URL, create_payload, this.jwt))
            if (status === 1) {
              successMessage = `Success: New Item "${this.editedProduct.product_name}" was Added!.`
              this.model.purchase_order_items.unshift({ ...data })
            }
            this.handleStatus({ status, message, that: this, successMessage })
            this.closeItem()
          } catch (error) {
            this.handleException({ error, that: this })
          }
        } else {
          try {
            const update_payload = this.editedProduct
            const { message, status, data } = (await this.$request.putData(`${this.$url.PURCHASEORDER_ITEM_URL}/${this.selectedItem.id}`, update_payload, this.jwt))
            if (status === 1) {
              this.model.purchase_order_items.splice(this.editedIndex, 1, {
                ...data
              })
              successMessage = `Success: Item "${this.editedProduct.product_name}"  was Updated!.`
            }
            this.handleStatus({ status, message, that: this, successMessage })
            this.closeItem()
          } catch (error) {
            this.handleException({ error, that: this })
          }
        }
        this.isLoading = false
      }
    },
    deleteItem (item) {
      this.$emit('onDeleteItem', item)
    },
    getCustomerInfo () {
      const Info = (({
        customer_name, customer_phone,
        customer_city_name,
        customer_zone_name,
        customer_address
      }) => ({
        customer_name,
        customer_phone,
        customer_city_name,
        customer_zone_name,
        customer_address
      }))(this.model)
      return Info
    },
    emitPrint () {
      this.$emit('onPrint', this.model)
    },
    async Confirm () {
      let successMessage = ''
      try {
        this.loadingData = true
        const payload = this.model.id
        const { message, status } = await this.$request.postData(`${this.$url.PURCHASEORDER_URL}/${this.model.id}/confirm`, payload, this.jwt)
        if (status === 1) {
          this.loadingData = false
          successMessage = 'Success: Purchase Order was Confirmed"!.'
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
