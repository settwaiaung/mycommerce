<template>
  <div id="themeSetting">
    <v-toolbar color="blue" dark>
      <v-toolbar-title>
        Theme Settings
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-layout>
        <v-flex>
          <v-subheader class="px-1 my-2">
            Color Option
          </v-subheader>
          <div class="color-option">
            <v-layout wrap>
              <label v-for="(option,index) in themeColorOptions" :key="index" class="color-option--label flex xs6 pa-1">
                <input v-model="themeColor" type="radio" name="color" :value="option.key">
                <span class="color-option--item bg">
                  <span class="overlay">
                    <span class="material-icons">check</span>
                  </span>
                  <span class="color-option--item--header sideNav" :class="option.value.sideNav" />
                  <span class="color-option--item--header mainNav" :class="option.value.mainNav" />
                  <span class="sideMenu" :class="option.value.sideManu" />
                </span>
              </label>
            </v-layout>
          </div>
          <div class="theme-options">
            <v-subheader class="px-1 my-2">
              Sidebar Option
            </v-subheader>
            <v-divider />
            <div class="my-3">
              <v-btn-toggle v-model="sideBarOption">
                <v-btn text value="dark">
                  Dark
                </v-btn>
                <v-btn text value="light">
                  Light
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-flex>
        <v-btn text fab class="flag" small @click="changeLocale">
          <img
            v-if="locale==='en'"
            src="@/static/flagEng.png"
            alt="Eng"
            height="20px"
            width="20px"
          >
          <img
            v-if="locale==='mm'"
            src="@/static/flagMyanmar.png"
            alt="MM"
            height="20px"
            width="20px"
          >
        </v-btn>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      themeColor: 'indigo',
      sideBarOption: 'light',
      colors
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale/getLocale'
    }),
    themeColorOptions () {
      return [
        {
          key: 'blue',
          value: {
            sideNav: 'blue',
            mainNav: 'blue',
            sideManu: 'white'
          }
        },
        // {
        //   key: 'lightBlue',
        //   value: {
        //     sideNav: 'blue',
        //     mainNav: 'white',
        //     sideManu: 'blue lighten-1'
        //   }
        // },
        {
          key: 'teal',
          value: {
            sideNav: 'teal',
            mainNav: 'teal',
            sideManu: 'white'
          }
        },
        {
          key: 'red',
          value: {
            sideNav: 'red',
            mainNav: 'red',
            sideManu: 'white'
          }
        },
        {
          key: 'orange',
          value: {
            sideNav: 'orange',
            mainNav: 'orange',
            sideManu: 'white'
          }
        },
        {
          key: 'purple',
          value: {
            sideNav: 'purple',
            mainNav: 'purple',
            sideManu: 'white'
          }
        },
        {
          key: 'indigo',
          value: {
            sideNav: 'indigo',
            mainNav: 'indigo',
            sideManu: 'white'
          }
        },
        {
          key: 'cyan',
          value: {
            sideNav: 'cyan',
            mainNav: 'cyan',
            sideManu: 'white'
          }
        },
        {
          key: 'pink',
          value: {
            sideNav: 'pink',
            mainNav: 'pink',
            sideManu: 'white'
          }
        },
        {
          key: 'green',
          value: {
            sideNav: 'green',
            mainNav: 'green',
            sideManu: 'white'
          }
        }
      ]
    }
  },
  watch: {
    themeColor: {
      handler (val) {
        if (this.$vuetify.theme.dark) {
          this.$vuetify.theme.themes.dark.primary = this.colors[val].base
        } else {
          this.$vuetify.theme.themes.light.primary = this.colors[val].base
        }
      },
      immediate: true
    },
    sideBarOption: {
      handler (newVal, oldVal) {
        if (!oldVal) { return }
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        // this.$store.dispatch('toggleSidebarDark', (newVal === 'dark'))
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      setLocale: 'locale/setLocale'
    }),
    changeLocale () {
      const locale = this.locale === 'mm' ? 'en' : 'mm'
      this.setLocale(locale)
    }
  }
}
</script>
<style>

.color-option--label {
  position: relative;
  display: block;
  cursor: pointer;
}
.color-option--label input[type="radio"] {
  display: none;
}
.color-option--label input[type="radio"]+span {
  position: relative;
}
.color-option--label input[type="radio"]+span>.overlay {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  text-align: center;
  line-height: 30px;
  color: #fff;
}
.color-option--label input[type="radio"]:checked+span>.overlay {
  display: block;
}
.color-option--label .bg {
  background-color: #f1f1f1;
}
.color-option--item {
  overflow: hidden;
  display: block;
  box-shadow: 0 0 2px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}
.color-option--item--header {
  height: 10px;
}
.color-option--item>span {
  display: block;
  float: left;
  width: 50%;
  height: 20px;
}
</style>
