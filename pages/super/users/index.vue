<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="users"
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
            <template #[`item.role.name`]="{item}">
              <!-- <div
                  v-for="(role,index) in item.roles"
                  :key="index"
                > -->
              <v-chip
                v-for="(role,index) in item.roles"
                :key="index"
                class="nfo--text text--darken-2"
                label
                small
              >
                {{ role.name }},
              </v-chip>
              <!-- </div> -->
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
        <UserForm v-model="selectedUser" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="User" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import UserForm from '@/components/forms/super/UserForm.vue'
export default {
  components: {
    UserForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    users: [],
    selectedUser: {
      requiredPassword: false,
      password: ''
    }
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.USER_URL, this.jwt)
      if (status === 1) {
        this.users = data
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
      return this.$tableHeaders.userHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Super',
        disabled: true
      },
      {
        text: 'Users',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Users')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.users.findIndex(
        user => user.id === data.id
      )
      this.users.splice(foundIndex, 1)
    //   this.saveToLocalStorage('stored:users', this.users)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedUser = {}

      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.users.findIndex(
          user => user.id === data.id
        )
        this.users.splice(foundIndex, 1, {
          ...data
        })
        // this.saveToLocalStorage('stored:users', this.users)
      } else {
        this.users.unshift({ ...data })
        // this.saveToLocalStorage('stored:users', this.users)
      }
    },
    onNew () {
      // this.$emit('newForm')
      this.selectedUser.requiredPassword = true
      this.step = 2
    },
    onEdit (item) {
      this.selectedUser = (({ id, name, username, password, phone, email, address, department, roles }) => ({
        id,
        name,
        username,
        password,
        phone,
        email,
        address,
        department_id: department.id,
        roles,
        requiredPassword: false
      }))(item)
      this.$emit('editForm', item)
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.USER_URL, this.jwt)
    }
  }
}
</script>
