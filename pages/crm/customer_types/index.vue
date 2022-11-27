<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="customer_types"
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
                mdi-pencil
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
        <CustomerTypeForm v-model="selectedType" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Customer Type" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerTypeForm from '@/components/forms/crm/CustomerTypeForm.vue'
export default {
  components: {
    CustomerTypeForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    customer_types: [],
    selectedType: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.CUSTOMER_TYPE_URL, this.jwt)
      if (status === 1) {
        this.customer_types = data
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
      return this.$tableHeaders.onlyOneFieldHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'CRM',
        disabled: true
      },
      {
        text: 'Customer Types',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Customer Types')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.customer_types.findIndex(
        customer_type => customer_type.id === data.id
      )
      this.customer_types.splice(foundIndex, 1)
      this.saveToLocalStorage('stored:customer_types', this.customer_types)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedType = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.customer_types.findIndex(
          customer_type => customer_type.id === data.id
        )
        this.customer_types.splice(foundIndex, 1, {
          ...data
        })
        this.saveToLocalStorage('stored:customer_types', this.customer_types)
      } else {
        this.customer_types.unshift({ ...data })
        this.saveToLocalStorage('stored:customer_types', this.customer_types)
      }
    },
    onNew () {
      this.step = 2
    },
    onEdit (item) {
      this.selectedType = (({ id, name }) => (
        {
          id,
          name
        })
      )(JSON.parse(JSON.stringify(item)))
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.CUSTOMER_TYPE_URL, this.jwt)
    }
  }
}
</script>
