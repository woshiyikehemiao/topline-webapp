import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import * as rules from 'vee-validate/dist/rules'
import { Button,
  NavBar,
  Field,
  Cell,
  CellGroup,
  Toast,
  Loading } from 'vant'
Vue.use(Button)
  .use(NavBar)
  .use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)
  .use(Loading)

for (let rule in rules) {
  extend(rule, {
    ...rules[rule],
    message: zhCN.messages[rule]
  })
}
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
