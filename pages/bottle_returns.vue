<template>
  <v-container fluid>
    <v-stepper v-model="step" flat class="stepper_wrapper py-0" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="pa-0" step="1">
          <v-data-table
            :headers="headers"
            :items="bottle_returns"
            :search="search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
          >
            <template #top>
              <v-toolbar
                flat
              >
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                />
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer />
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="onNew"
                >
                  {{ trans('new') }}
                </v-btn>
              </v-toolbar>
            </template>
            <template #[`item.actions`]="{item}">
              <v-icon
                color="primary"
                class="mr-2"
                @click="onEdit(item)"
              >
                mdi-eye
              </v-icon>
              <v-icon
                color="error"
                medium
                class="mr-4"
                @click="onDelete(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-stepper-content>
        <CustomerForm v-if="selectedBottle" v-model="selectedBottle" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <SnackBar />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerForm from '@/components/forms/crm/CustomerForm.vue'
export default {
  components: {
    CustomerForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    bottle_returns: [],
    selectedBottle: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.CUSTOMER_URL, this.jwt)
      if (status === 1) {
        this.bottle_returns = data
        this.loadingData = false
      } else {
        this.loadingData = false
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.customerHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Bottle Returns',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Bottle Returns')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.bottle_returns.findIndex(
        bottle_return => bottle_return.id === data.id
      )
      this.bottle_returns.splice(foundIndex, 1)
    //   this.saveToLocalStorage('stored:bottle_returns', this.bottle_returns)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedBottle = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.bottle_returns.findIndex(
          bottle_return => bottle_return.id === data.id
        )
        this.bottle_returns.splice(foundIndex, 1, {
          ...data
        })
        // this.saveToLocalStorage('stored:bottle_returns', this.bottle_returns)
      } else {
        this.bottle_returns.unshift({ ...data })
        // this.saveToLocalStorage('stored:bottle_returns', this.bottle_returns)
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    onEdit (item) {
      this.selectedBottle = (({
        customer, product, sale,
        bottle_return_histories,
        remain_bottle,
        total_bottle
      }) => ({
        customer,
        product,
        sale,
        bottle_return_histories,
        remain_bottle,
        total_bottle
      }))(JSON.parse(JSON.stringify(item)))
      this.step = 2
    }
  }
}
</script>
