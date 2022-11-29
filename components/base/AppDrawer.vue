<template>
  <v-navigation-drawer
    id="appDrawer"
    v-model="drawer"
    :mini-variant.sync="mini"
    fixed
    app
    width="260"
    color="transparent"
    expand-on-hover
    permanent
    class="d-print-none"
  >
    <v-toolbar color="primary" dark>
      <img src="@/static/icon.png" width="60" height="5" alt="MYCOMMERCE">
      <v-toolbar-title class="ml-0 pl-3">
        <span class="hidden-sm-and-down">MYCOMMERCE</span>
      </v-toolbar-title>
    </v-toolbar>
    <vue-perfect-scrollbar class="drawer-menu--scroll" :settings="scrollSettings">
      <v-list dense expand>
        <template v-for="(item, i) in menus">
          <!--group with subitems-->
          <v-list-group
            v-if="item.items"
            :key="item.name"
            :group="item.group"
            :prepend-icon="item.icon"
            no-action="no-action"
          >
            <v-list-item
              slot="activator"
              ripple="ripple"
            >
              <v-list-item-content>
                <v-list-item-title class="tw-uppercase">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--child item-->
            <v-list-item
              v-for="(subItem, i) in item.items"
              :key="i"
              :target="subItem.target"
              ripple="ripple"
              :to="subItem.href ? subItem.href : null"
            >
              <v-list-item-action v-if="subItem.icon">
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="tw-uppercase">
                  <span>{{ subItem.title }}</span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="subItem.action">
                <v-icon :class="[subItem.actionClass || 'success--text']">
                  {{ subItem.action }}
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
          <v-subheader v-else-if="item.header" :key="i">
            {{ item.header }}
          </v-subheader>
          <v-divider v-else-if="item.divider" :key="i" />
          <!--top-level link-->
          <v-list-item
            v-else
            :key="item.name"
            :to="item.href ? item.href : null"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
            active-class="primary--text"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="tw-uppercase">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="item.subAction">
              <v-icon class="success--text">
                {{ item.subAction }}
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </vue-perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import menu from '@/core/menu'

export default {
  name: 'AppDrawer',
  components: {
    VuePerfectScrollbar
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    mini: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    }
  }),
  computed: {
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.dispatch('setDrawer', val)
      }
    },
    computeGroupActive () {
      return true
    },
    sideToolbarColor () {
      return this.$vuetify.options.extra.sideNav
    }
  },
  methods: {
    genChildTarget (item, subItem) {
      if (subItem.href) { return }
      if (subItem.component) {
        return {
          name: subItem.component
        }
      }
      return { name: `${item.group}/${(subItem.name)}` }
    }
  }
}
</script>
<style>
#appDrawer {
    overflow: "hidden";
}
.drawer-menu--scroll {
  height: "calc(100vh - 48px)";
  overflow: "auto";
}
.v-list .v-list-item--active{
  background-color: 'white' !important;
}
</style>
