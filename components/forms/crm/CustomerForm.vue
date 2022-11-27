<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />

      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveCustomer" @keyup.enter="onSaveCustomer">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Customer' }}
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-1"
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
              <v-col md="3" cols="12">
                <CustomerInfo v-show="model.id" :customer="model" :billing="{}">
                  <v-btn
                    class="mb-2 ml-4"
                    absolute
                    right
                    color="info"
                    fab
                    small
                    bottom
                    @click="editCustomerInfo=!editCustomerInfo"
                  >
                    <v-icon>{{ editCustomerInfo?'mdi-close':'mdi-pencil' }}</v-icon>
                  </v-btn>
                </CustomerInfo>
                <v-row v-show="model.id" class="mt-2">
                  <v-col md="6">
                    <v-card
                      :color="setColor(showCustomerSales)"
                      @click="toggleCustomerSales"
                    >
                      <v-card-title>
                        {{ model.sale_count }}
                        <!-- <v-btn
                          right
                          color="primary"
                          depressed
                          fab
                          x-small
                          top
                          @click="showCustomerSales=!showCustomerSales"
                        >
                          <v-icon>{{ showCustomerSales?'mdi-close':'mdi-eye' }}</v-icon>
                        </v-btn> -->
                      </v-card-title>
                      <v-card-text>
                        Total Sale
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col md="6">
                    <v-card
                      :color="setColor(showCustomerOrders)"
                      @click="toggleCustomerOrders"
                    >
                      <v-card-title>
                        {{ model.order_count }}
                      </v-card-title>
                      <v-card-text>
                        Total Orders
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider vertical />
              <v-col v-show="model.id&&showCustomerHistory" md="9" cols="12" class="py-0 section_container">
                <v-data-table
                  v-show="showCustomerOrders"
                  :headers="customerOrderHeader"
                  :items="customerOrders"
                  :loading="loadingData"
                  :loading-text="trans('tableDataLoading')"
                  class="elevation-1"
                  :options.sync="customerOrderOptions"
                  :server-items-length="customerOrderOptions.totalItems"
                >
                  <template #top>
                    <v-toolbar
                      flat
                      color="primary"
                    >
                      Order List
                    </v-toolbar>
                  </template>
                </v-data-table>
                <v-data-table
                  v-show="showCustomerSales"
                  :headers="customerSaleHeader"
                  :items="customerSales"
                  :loading="loadingData"
                  :loading-text="trans('tableDataLoading')"
                  class="elevation-1"
                  :options.sync="customerSaleOptions"
                  :server-items-length="customerSaleOptions.totalItems"
                >
                  <template #top>
                    <v-toolbar
                      flat
                      color="primary"
                    >
                      Sale List
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-col>
              <v-col v-show="editCustomerInfo" class="section_container" md="4" cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.name"
                    :error-messages="errors"
                    label="Name *"
                    required
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Phone"
                  rules="required|phone"
                >
                  <v-text-field
                    v-model="model.phone"
                    label="Phone *"
                    :error-messages="errors"
                    required
                  />
                </validation-provider>
                <!-- city_id -->
                <validation-provider
                  v-slot="{ errors }"
                  name="City"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.city_id"
                    label="City *"
                    :items="cities"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- zone_id -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Zone"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.zone_id"
                    label="Zone *"
                    :items="zones"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- type -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Customer Type"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.customer_type_id"
                    label="Customer Type"
                    :items="customer_types"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- address -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <v-textarea
                    v-model="model.address"
                    solo
                    label="Address"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-divider
                vertical
              />
              <v-col v-show="editCustomerInfo" class="section_container" md="5" cols="12">
                <v-text-field
                  v-model="model.membership_no"
                  label="Membership Number"
                />
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="phone"
                >
                  <v-text-field
                    v-model="model.another_phone"
                    label="Another Phone"
                    :counter="11"
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="email"
                >
                  <v-text-field
                    v-model="model.email"
                    label="Email *"
                    :error-messages="errors"
                    email
                  />
                </validation-provider>
                <v-checkbox
                  v-model="model.is_active"
                  label="Approved?"
                />
                <v-row>
                  <v-col md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Password"
                      :rules="{required:model.requiredPassword}"
                      vid="password"
                    >
                      <v-text-field
                        v-model="model.password"
                        :append-icon="
                          isPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isPasswordHidden ? 'password' : 'text'"
                        label="Password *"
                        name="password"
                        required
                        :error-messages="errors"
                        @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Confirmed Password"
                      :rules="{required:model.requiredPassword,confirmed:'password'}"
                    >
                      <v-text-field
                        v-model="model.confirmed_password"
                        :append-icon="
                          isConfirmPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isConfirmPasswordHidden ? 'password' : 'text'"
                        label="Confirmed Password *"
                        name="confirmed_password"
                        :error-messages="errors"
                        required
                        confirmed
                        @click:append="() => (isConfirmPasswordHidden = !isConfirmPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider
                v-show="editCustomerInfo"
                vertical
              />
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
export default {
  components: {
    CustomerInfo
  },
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
      isPasswordHidden: true,
      isConfirmPasswordHidden: true,
      cities: [],
      origin_zones: [],
      zones: [],
      customer_types: [],
      disabledButton: false,
      isLoading: false,
      tabIndex: 0,
      orders: [],
      loadingData: false,
      editCustomerInfo: true,
      showCustomerHistory: false,
      showCustomerOrders: false,
      showCustomerSales: false,
      //
      filters: {
        start_date: '',
        end_date: '',
        is_closed: '',
        is_paid: '',
        delivery_id: ''
      },
      customerOrderOptions: {
        itemsPerPage: 10,
        totalItems: 0
      },
      customerOrders: [],
      customerSaleOptions: {
        itemsPerPage: 10,
        totalItems: 0
      },
      customerSales: []
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    customerOrderHeader () {
      return this.$tableHeaders.customerOrderHeader(this.locale)
    },
    customerSaleHeader () {
      return this.$tableHeaders.customerSaleHeader(this.locale)
    },
    query () {
      let query = ''
      for (const property in this.filters) {
        if (this.filters[property]) { query += `&${property}=${this.filters[property]}` }
      }
      return query
    }
  },
  watch: {
    'model.city_id': {
      handler (newVal, oldVal) {
        if (!newVal || (newVal === oldVal)) { return }
        this.zones = this.origin_zones.filter(zone => zone.city.id === newVal)
        // console.log(this.origin_zones)
        // this.model.zone_id = this.zones[0].id
      },
      deep: true
    },
    'customerOrderOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal || !this.model.id) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}/${this.model.id}/orders`, this.customerOrderOptions)
        }, 1000)
      },
      deep: true
    },
    'customerSaleOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal || !this.model.id) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}/${this.model.id}/sales`, this.customerOrderOptions)
        }, 1000)
      },
      deep: true
    },
    editCustomerInfo (newVal) {
      if (newVal) {
        this.showCustomerHistory = false
        this.showCustomerOrders = false
      } else if (this.showCustomerOrders) {
        this.showCustomerHistory = true
        this.showCustomerSales = false
      } else {
        this.showCustomerHistory = true
        this.showCustomerSales = true
      }
    },
    showCustomerSales (newVal) {
      if (newVal) {
        this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}/${this.model.id}/sales`, this.customerSaleOptions)
      }
    },
    showCustomerOrders (newVal) {
      if (newVal) {
        this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}/${this.model.id}/orders`, this.customerOrderOptions)
      }
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
    this.origin_zones = await this.getFromLocalStorage('stored:zones')
    this.customer_types = await this.getFromLocalStorage('stored:customer_types')
  },
  methods: {
    setColor (condition) {
      if (condition) {
        return 'primary'
      } else {
        return ''
      }
    },
    toggleCustomerOrders () {
      this.showCustomerOrders = true
      this.showCustomerSales = false
      this.editCustomerInfo = false
    },
    toggleCustomerSales () {
      this.showCustomerSales = true
      this.showCustomerOrders = false
      this.editCustomerInfo = false
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            if (this.showCustomerOrders) {
              this.customerOrders = data
              this.setPaginationData(this, meta, this.customerOrderOptions)
            } else {
              this.customerSales = data
              this.setPaginationData(this, meta, this.customerSaleOptions)
            }
          }, 700)
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.loadingData = false
    },
    async onSaveCustomer () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      if (!this.model.id) {
        try {
          const create_payload = this.$model.CREATE_CUSTOMER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.postData(this.$url.CUSTOMER_URL, create_payload, this.jwt))
          if (status === 1) {
            // this.$parent.$emit('createdData', data)
            successMessage = `Success: New Customer "${data.name}" was Created!.`
            this.closeForm(data, 'created')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      } else {
        try {
          const update_payload = this.$model.CREATE_CUSTOMER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.putData(`${this.$url.CUSTOMER_URL}/${this.model.id}`, update_payload, this.jwt))
          if (status === 1) {
            // this.$parent.$emit('updatedData', data)
            successMessage = `Success: Customer "${this.model.name}"  was Updated!.`
            this.closeForm(data, 'updated')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      }
      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.showCustomerOrders = false
      // this.showCustomerSales = true
      // this.model = {}
      this.$emit('onGoBack', data, action)
      this.closeFormDialog(this)
    }
  }
}
</script>
