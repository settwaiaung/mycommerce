<template>
  <!-- <v-app-bar
    app
    :class="{'app_bar':!$vuetify.theme.dark}"
  > -->
  <v-app-bar
    app
    :class="{'app_bar':!$vuetify.theme.dark,'d-print-none mx-4':true}"
    flat
    dense
  >
    <!-- <v-spacer /> -->
    <strong class="primary--text text-h5 font-weight-bold">{{ title.toUpperCase() }}</strong>
    <v-spacer />
    <nuxt-link
      to="/new_order"
    >
      <v-btn
        color="primary"
        depressed
        fab
        small
        bottom
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </nuxt-link>
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" :nudge-right="120" :nudge-bottom="10" transition="scale-transition">
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" icon large text v-on="on">
          <v-avatar size="30px">
            <img src="@/static/3d-characters/profile.png" alt="Michael Wang">
          </v-avatar>
        </v-btn>
      </template>
      <v-list class="pa-0">
        <v-list-item
          v-for="(item,index) in items"
          :key="index"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          @click="item.click"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Util from '@/core/util'
export default {
  name: 'AppToolbar',
  data () {
    return {
      items: [
        {
          icon: 'account_circle',
          href: '/profile',
          title: 'Profile',
          click: (e) => {
            // console.log(e)
          }
        },
        // {
        //   icon: 'settings',
        //   href: '#',
        //   title: 'Settings',
        //   click: (e) => {
        //     console.log(e)
        //   }
        // },
        {
          icon: 'fullscreen_exit',
          href: '#',
          title: 'Logout',
          click: this.handleLogout
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      title: 'title'
    }),
    toolbarColor () {
      return this.$vuetify.options.extra.mainNav
    }
  },
  methods: {
    ...mapActions({
      clearAuth: 'auth/clearAuth'
    }),
    handleFullScreen () {
      Util.toggleFullScreen()
    },
    async handleLogout () {
      let successMessage = ''
      try {
        const { message, status } = await this.$request.Logout(this.$url.AUTH_LOGOUT_URL, this.jwt)
        if (status === 1) {
          this.clearAuth()
          this.$router.push('/login')
          successMessage = 'Successfully logout'
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (e) {
        // console.log(e)
      }
    }
  }

}
</script>
