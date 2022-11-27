<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="categories"
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
                @click="onDetail(item)"
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
        <CategoryForm v-model="selectedCategory" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Category" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CategoryForm from '@/components/forms/store/CategoryForm.vue'
export default {
  components: {
    CategoryForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    categories: [],
    selectedCategory: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.CATEGORY_URL, this.jwt)
      if (status === 1) {
        this.categories = data
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
        text: 'Store',
        disabled: true
      },
      {
        text: 'Categories',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Categories')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.categories.findIndex(
        city => city.id === data.id
      )
      this.categories.splice(foundIndex, 1)
      this.saveToLocalStorage('stored:categories', this.categories)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedCategory = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.categories.findIndex(
          city => city.id === data.id
        )
        this.categories.splice(foundIndex, 1, {
          ...data
        })
        this.saveToLocalStorage('stored:categories', this.categories)
      } else {
        this.categories.unshift({ ...data })
        this.saveToLocalStorage('stored:categories', this.categories)
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    onDetail (item) {
      this.selectedCategory = (({ id, name, mm_name }) => (
        {
          id,
          name,
          mm_name
        })
      )(JSON.parse(JSON.stringify(item)))
      // this.$emit('editForm', item)
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.CATEGORY_URL, this.jwt)
    }
  }
}
</script>
