<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="bank_informations"
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
        <BankInformationForm v-model="selectedInfo" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="BankInformation" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BankInformationForm from '@/components/forms/super/BankInformationForm.vue'
export default {
  components: {
    BankInformationForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    bank_informations: [],
    selectedInfo: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.BANK_INFORMATION_URL, this.jwt)
      if (status === 1) {
        this.bank_informations = data
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
      return this.$tableHeaders.bankInformationHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Super',
        disabled: true
      },
      {
        text: 'Bank Informations',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Bank Informations')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.bank_informations.findIndex(
        user => user.id === data.id
      )
      this.bank_informations.splice(foundIndex, 1)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedInfo = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.bank_informations.findIndex(
          user => user.id === data.id
        )
        this.bank_informations.splice(foundIndex, 1, {
          ...data
        })
      } else {
        this.bank_informations.unshift({ ...data })
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    onEdit (item) {
      this.selectedInfo = (({ id, bank, account_no, account_name }) => ({
        id,
        bank_id: bank.id,
        account_no,
        account_name
      }))(JSON.parse(JSON.stringify(item)))
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.BANK_INFORMATION_URL, this.jwt)
    }
  }
}
</script>
