// import colors from 'vuetify/es5/util/colors'
import colors from 'tailwindcss/colors'
const favicon =
  process.env.NODE_ENV === 'production' ? '/favicon.ico' : '/favicon.ico'

export default {
  transition: 'fade',
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MYCOMMERCE',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: favicon },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Material+Icons',
        rel: 'stylesheet'
      }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.4/echarts-en.min.js' },
      { src: 'https://unpkg.com/vue-html-to-paper/build/vue-html-to-paper.js' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vee-validate',
    '@/plugins/common',
    '@/plugins/wrapper',
    { src: '@/plugins/vue-shortkey.js', mode: 'client' }
    // { src: '~/plugins/chart.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxt/postcss8'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: process.env.baseURL,
    proxyHeaders: false,
    credentials: false
  },
  eslint: { cache: false },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  // vuetify: {
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     dark: true,
  //     themes: {
  //       dark: {
  //         primary: colors.blue.darken2,
  //         accent: colors.grey.darken3,
  //         secondary: colors.amber.darken3,
  //         info: colors.teal.lighten1,
  //         warning: colors.amber.base,
  //         error: colors.deepOrange.accent4,
  //         success: colors.green.accent3
  //       }
  //     }
  //   }
  // },
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.indigo[400],
          // primary: colors.teal[400],
          accent: colors.gray[400],
          secondary: colors.purple[400],
          // info: colors.sky[400],
          info: colors.green[400],
          warning: colors.amber[400],
          error: colors.red[400],
          success: colors.green[600]
        },
        dark: {
          primary: colors.slate[800],
          // primary: colors.teal[400],
          accent: colors.gray[400],
          secondary: colors.purple[400],
          info: colors.sky[400],
          warning: colors.amber[400],
          error: colors.red[400],
          success: colors.green[400]
        }
      }
    }
  // theme: {
  //   themes: {
  //     light: {
  //       primary: '#9155FD',
  //       accent: '#0d6efd',
  //       secondary: '#8A8D93',
  //       success: '#56CA00',
  //       info: '#16B1FF',
  //       warning: '#FFB400',
  //       error: '#FF4C51'
  //     },
  //     dark: {
  //       primary: '#9155FD',
  //       accent: '#0d6efd',
  //       secondary: '#8A8D93',
  //       success: '#56CA00',
  //       info: '#16B1FF',
  //       warning: '#FFB400',
  //       error: '#FF4C51'
  //     }
  //   }
  // }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        'postcss-import': true,
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  }
}
