<template>
  <div>
    <!-- <LoadingCircle :loading-data="loadingData" /> -->
    <LoadingRotate v-show="!showForm" :loading-time="loadingTime" />
    <v-row>
      <v-col cols="12">
        <validation-observer
          ref="observer"
        >
          <v-form ref="form" @submit.prevent="onSetRolePermission" @keyup.enter="onSetRolePermission">
            <v-card v-show="showForm">
              <v-progress-linear
                v-show="isLoading"
                :indeterminate="isLoading"
                color="primary"
              />
              <v-card-title>
                <v-icon
                  color="primary"
                  large
                  @click="$router.go(-1)"
                >
                  mdi-arrow-left-bold-box
                </v-icon>
                {{ model.name }} -Role
                <v-spacer />
                <v-btn
                  outlined
                  color="primary"
                  class="mx-1"
                  @click="$router.push('/super/roles')"
                >
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="disabledButton"
                  color="primary"
                  type="submit"
                  :loading="isLoading"
                >
                  Save
                </v-btn>
              </v-card-title>
              <v-card-text>
                <template #activator>
                  <v-list-tile>
                    <v-list-tile-title>Users</v-list-tile-title>
                  </v-list-tile>
                </template>
                <v-expansion-panels
                  v-model="panel"
                  multiple
                >
                  <v-row>
                    <v-col
                      v-for="(item,i) in preparedPermissions"
                      :key="i"
                      cols="12"
                      sm="3"
                      md="3"
                    >
                      <v-expansion-panel>
                        <!-- <v-expansion-panel readonly> -->
                        <v-expansion-panel-header>
                          {{ item[0].group }}
                          <v-checkbox
                            v-model="item.selected_each"
                            color="success"
                            hide-details
                            class="mb-4 ml-2"
                            :value="checkEachSelect(item)"
                            @click="selectEachPermission(item)"
                          />
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <!-- {{ model.permissions }} -->
                          <v-checkbox
                            v-for="(permission,index) in item"
                            :key="index"
                            v-model="model.permissions"
                            :label="permission.name"
                            :color="permission.color"
                            :value="permission"
                            hide-details
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-col>
                  </v-row>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => {
    return {
      permissions: [],
      origin_permissions: [],
      model: {
        id: '',
        name: '',
        permissions: []
      },
      disabledButton: false,
      isLoading: false,
      loadingData: false,
      loadingTime: 0,
      showForm: false,
      selected_all: false,
      selected_each: false,
      panel: []
    }
  },
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(`${this.$url.ROLE_URL}/${this.$route.params.id}`, this.jwt)
      if (status === 1) {
        data.permissions = this.Prepared(data.permissions)
        this.model = data
        this.origin_permissions = data.permissions
        const breadCrumbs = [
          {
            text: 'Super',
            disabled: true
          },
          {
            text: 'Role',
            disabled: false,
            to: '/super/roles'
          },
          {
            text: this.model.name,
            disabled: true
          }
        ]
        this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
      } else {
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
    this.fetchPermissions()
  },

  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    preparedPermissions () {
      return this.groupArrayOfObjects(this.permissions, 'group')
    }
  },
  watch: {
    loadingData (newVal) {
      if (newVal === true) {
        setInterval(() => {
          if (this.loadingTime < 90) {
            this.loadingTime += 10
          }
        }, 100)
      }
      if (newVal === false) {
        setInterval(() => {
          this.loadingTime = 100
        }, 100)
      }
    },
    loadingTime (newVal) {
      if (newVal === 100) {
        setInterval(() => {
          this.showForm = true
        }, 300)
      }
    },
    preparedPermissions (newVal) {
      for (let i = 0; i < Object.keys(newVal).length; i++) {
        this.panel.push(i)
      }
    }
  },
  mounted () {
    this.$store.dispatch('title/setTitle', 'Roles')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    async fetchPermissions () {
      try {
        const { data, message, status } = await this.$request.fetchData(this.$url.PERMISSION_URL, this.jwt)
        if (status === 1) {
          this.permissions = this.Prepared(data)
          this.loadingData = false
        } else {
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    groupArrayOfObjects (list, key) {
      return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        rv[x[key]].selected_each = false
        return rv
      }, {})
    },
    Prepared (permissions) {
      permissions.forEach((permission) => {
        permission.group = permission.name.split('-').shift().toUpperCase()
        const type = permission.name.split('-').pop()
        switch (type) {
          case 'create':
            permission.color = 'primary'
            break
          case 'edit':
            permission.color = 'warning'
            break
          case 'delete':
            permission.color = 'error'
            break
          default:
            permission.color = 'info'
        }
      })
      return permissions
      // permissions = permissions.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1))
      // console.log(this.groupArrayOfObjects(permissions, 'group'))
      // return this.groupArrayOfObjects(permissions, 'group')
    },
    async onSetRolePermission () {
      this.disabledButton = true
      this.isLoading = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        this.isLoading = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const update_payload = this.$model.UPDATE_ROLE_PAYLOAD(this.model)
        const { message, status, data } = (await this.$request.putData(`${this.$url.ROLE_URL}/${this.model.id}`, update_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Role "${this.model.name}"  was Set Total ${data.permissions.length} Permissions!.`
          this.$router.push('/super/roles')
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.isLoading = false
      this.disabledButton = false
    },
    selectEachPermission (item) {
      if (item.selected_each) {
        const newPermissions = item.filter((itm) => {
          return !this.model.permissions.find((perm) => {
            return perm.id === itm.id
          })
        })
        this.model.permissions = this.model.permissions.concat(newPermissions)
      } else {
        this.model.permissions = this.model.permissions.filter((perm) => {
          return !item.find((itm) => {
            return itm.id === perm.id
          })
        })
      }
    },
    checkEachSelect (item) {
      const selectedPermissions = item.filter((itm) => {
        return this.model.permissions.find((perm) => {
          return perm.id === itm.id
        })
      })
      if (selectedPermissions.length === item.length) {
        item.selected_each = true
      } else {
        item.selected_each = false
      }
    }
  }
}
</script>
