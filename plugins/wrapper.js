import Vue from 'vue'
import model from '@/core/model'
import url from '@/core/url'
import request from '@/core/request'
import tableHeaders from '@/core/tableHeaders'

Vue.prototype.$model = model
Vue.prototype.$url = url
Vue.prototype.$request = request
Vue.prototype.$tableHeaders = tableHeaders
export default (app) => {
  app.$model = model
  app.$url = url
  app.$request = request
  app.$tableHeaders = tableHeaders
}
