import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import * as rules from 'vee-validate/dist/rules'
import { relativeTime } from './utils/date'
import { Button,
  NavBar,
  Field,
  Cell,
  CellGroup,
  Toast,
  Loading,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Grid,
  GridItem,
  Image,
  Lazyload,
  Popup,
  Icon,
  Search
} from 'vant'

Vue.use(Button)
  .use(NavBar)
  .use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)
  .use(Loading)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Grid)
  .use(GridItem)
  .use(Image)
  .use(Lazyload)
  .use(Popup)
  .use(Icon)
  .use(Search)

Vue.filter('relativeTime', relativeTime)
for (let rule in rules) {
  extend(rule, {
    ...rules[rule],
    message: zhCN.messages[rule]
  })
}
extend('phone', {
  validate (value) {
    return /^1[3-9]\d{9}$/.test(value)
  },
  message: '手机号格式错误'
})
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
