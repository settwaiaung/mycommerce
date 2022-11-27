<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="cities"
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
        <CityForm v-model="selectedCity" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="City" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CityForm from '@/components/forms/general/CityForm.vue'
export default {
  components: {
    CityForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    cities: [],
    selectedCity: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.CITY_URL, this.jwt)
      if (status === 1) {
        this.cities = data
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
      return this.$tableHeaders.onlyTwoFieldHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'General',
        disabled: true
      },
      {
        text: 'Cities',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Cities')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.cities.findIndex(
        city => city.id === data.id
      )
      this.cities.splice(foundIndex, 1)
      this.saveToLocalStorage('stored:cities', this.cities)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedCity = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.cities.findIndex(
          city => city.id === data.id
        )
        this.cities.splice(foundIndex, 1, {
          ...data
        })
        this.saveToLocalStorage('stored:cities', this.cities)
      } else {
        this.cities.unshift({ ...data })
        this.saveToLocalStorage('stored:cities', this.cities)
      }
    },
    onNew () {
      this.step = 2
    },
    onEdit (item) {
      this.selectedCity = (({ id, name, mm_name }) => (
        {
          id,
          name,
          mm_name
        })
      )(JSON.parse(JSON.stringify(item)))
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.CITY_URL, this.jwt)
    }
  }
}
</script>
