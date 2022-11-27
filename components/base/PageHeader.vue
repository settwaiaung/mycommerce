<template>
  <v-layout
    row
    class="align-center layout pt-2 px-7 app--page-header"
  >
    <!-- <v-btn
      v-show="navShow"
      depressed
      style="padding: 2px;"
      icon
      @click="$router.go(-1)"
    >
      <v-icon large>
        mdi-arrow-left-bold-box
      </v-icon>
    </v-btn> -->
    <v-icon
      v-show="navShow"
      style="padding: 2px;"
      @click="$router.go(-1)"
    >
      history
    </v-icon>
    <div class="page-header-left">
      <h3 class="pr-3">
        {{ title }}
      </h3>
    </div>
    <v-icon>home</v-icon>
    <v-breadcrumbs :items="breadCrumbItems">
      <template #item="{ item }">
        <!-- <v-breadcrumbs-item
          :disabled="item.disabled"
          @click="$router.push(item.to)"
        >
          {{ item.text }}
        </v-breadcrumbs-item> -->
        <a
          :class="[item.disabled && 'disabled']"
          @click="item.to?go(item.to):()=> (false)"
        >{{ item.text }}</a>
      </template>
    </v-breadcrumbs>
    <v-spacer />
    <div class="page-header-right">
      <v-btn icon>
        <v-icon
          class="text--secondary"
          @click="$router.app.refresh()"
        >
          refresh
        </v-icon>
      </v-btn>
      <!-- theme setting -->
      <v-btn
        fab
        x-small
        dark
        right
        color="red"
        elevation="29"
        @click="openThemeSettings"
      >
        <v-icon>mdi-wrench</v-icon>
      </v-btn>
      <v-navigation-drawer
        v-model="rightDrawer"
        class="setting-drawer"
        temporary
        right
        hide-overlay
        fixed
      >
        <ThemeSettings />
      </v-navigation-drawer>
      <!-- end theme setting -->
    </div>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ThemeSettings from '@/components/base/ThemeSettings'
export default {
  components: {
    ThemeSettings
  },
  data () {
    return {
      rightDrawer: false

    }
  },
  computed: {
    ...mapGetters({
      breadCrumbItems: 'breadCrumbItems',
      title: 'title',
      navShow: 'navShow'
    })
  },
  methods: {
    hasHistory () { return window.history.length > 2 },
    openThemeSettings () {
      this.$vuetify.goTo(0)
      this.rightDrawer = (!this.rightDrawer)
    },
    go (to) {
      this.$router.push(to)
    }
  }
}
</script>
<style>
.disabled {
    color: grey !important;
    pointer-events: none;
}
</style>
