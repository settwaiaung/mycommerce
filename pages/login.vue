<template>
  <v-app id="login" class="primary">
    <v-container
      fluid
      fill-height
      class="pa-3 tw-bg-auto tw-bg-left-bottom tw-bg-[url('@/static/3d-characters/pose-m-1.png')]"
    >
      <v-layout align-center justify-center>
        <v-flex md4 lg4 class="hidden-sm-and-down">
          <!-- tree -->
          <v-img class="auth-tree" src="/misc/tree.png" />
          <!-- tree  -->
          <v-img class="auth-tree-3" src="/misc/tree-3.png" />
        </v-flex>
        <v-flex xs12 sm8 md4 lg4>
          <LoadingRotate v-show="!showForm" :loading-time="loadingTime" />
          <v-hover v-show="showForm">
            <template #default="{ hover }">
              <v-card :elevation="hover ? 24 : 6" class="pa-3">
                <v-progress-linear
                  v-show="isLoading"
                  :indeterminate="isLoading"
                  color="primary"
                />
                <v-card-title>
                  <div class="layout column align-center">
                    <h1 class="flex my-4 primary--text">
                      MYCOMMERCE DASHBOARD
                    </h1>
                  </div>
                </v-card-title>
                <validation-observer ref="observer">
                  <v-form @submit.prevent="logIn" @keyup.enter="logIn">
                    <v-card-text>
                      <validation-provider
                        v-slot="{ errors }"
                        name="username"
                        rules="required"
                      >
                        <v-text-field
                          v-model="username"
                          append-icon="person"
                          name="login"
                          label="Login"
                          type="text"
                          :error-messages="errors"
                          required
                        />
                      </validation-provider>
                      <v-text-field
                        id="password"
                        v-model="password"
                        name="password"
                        label="Password"
                        :type="isPasswordHidden ? 'password' : 'text'"
                        :append-icon="
                          isPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        @click:append="
                          () => (isPasswordHidden = !isPasswordHidden)
                        "
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="primary"
                        :disabled="disabledButton"
                        :loading="isLoading"
                        type="submit"
                      >
                        Login
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </template>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
    <SnackBar />
  </v-app>
</template>
<script>
import localforage from 'localforage'
import { mapActions, mapGetters } from 'vuex'

export default {
  layout: 'default',
  async asyncData (context) {
    const isLogin = await localforage.getItem('jwt')
    if (isLogin) {
      context.redirect('/dashboard')
    }
    return true
  },
  data: () => ({
    isPasswordHidden: true,
    isLoading: false,
    disabledButton: false,
    username: '',
    password: '',
    showForm: true,
    isSuccess: false,
    loadingTime: 0
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    })
  },
  watch: {
    isSuccess (newVal) {
      if (newVal === true) {
        setInterval(() => {
          if (this.loadingTime < 90) {
            this.loadingTime += 10
          }
        }, 100)
      }
    }
  },
  methods: {
    ...mapActions({
      setJwt: 'auth/setJwt',
      setUser: 'auth/setUser',
      setMerchantJwt: 'merchantAuth/setMerchantJwt',
      setMerchant: 'merchantAuth/setMerchant'
    }),
    async logIn () {
      const { username, password } = this
      this.disabledButton = true
      this.isLoading = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        this.isLoading = false
        return false
      }
      // if (!username || !password) { return }
      try {
        const { access_token, message, status, user } =
          await this.$request.Login(this.$url.AUTH_LOGIN_URL, {
            username,
            password
          })
        if (status === 1) {
          this.showForm = false
          this.isSuccess = true
          this.setJwt(access_token)
          this.setUser(user)
          await localforage.setItem('jwt', access_token)
          await localforage.setItem('user', user)
          const responses = await this.$request.fetchData(
            this.$url.MASTER_RECORDS_URL,
            this.jwt
          )
          await Promise.all([
            localforage.setItem('stored:banks', responses.data.banks),
            localforage.setItem('stored:categories', responses.data.categories),
            localforage.setItem('stored:cities', responses.data.cities),
            localforage.setItem(
              'stored:departments',
              responses.data.departments
            ),
            localforage.setItem(
              'stored:payment_methods',
              responses.data.payment_methods
            ),
            localforage.setItem(
              'stored:permissions',
              responses.data.permissions
            ),
            localforage.setItem('stored:roles', responses.data.roles),
            localforage.setItem('stored:users', responses.data.users),
            localforage.setItem('stored:zones', responses.data.zones),
            localforage.setItem(
              'stored:customer_types',
              responses.data.customer_types
            ),
            localforage.setItem('stored:sources', responses.data.sources)
          ])
          this.$store.dispatch('merchantAuth/merchantLogin', { that: this })

          setTimeout(() => {
            this.loadingTime = 100
          }, 300)
          setTimeout(() => {
            this.$router.push('dashboard')
          }, 1000)
          this.isSuccess = false
        }
        if (status === 2) {
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.isLoading = false
      // setTimeout(() => {
      //   this.$router.push('/dashboard')
      // }, 1000)
    }
  }
}
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
