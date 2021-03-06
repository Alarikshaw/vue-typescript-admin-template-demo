import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'

Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false
// const requireComponent = require.context(
//   // 其组件目录的相对路径
//   '@/components/wizard/',
//   // 是否查询其子目录
//   true,
//   // 匹配基础组件文件名的正则表达式
//   /\.(vue|js)$/
// )
// requireComponent.keys().forEach(fileName => {
//   console.log('fileName', fileName)
//   // 获取组件配置
//   const componentConfig = requireComponent(fileName)
//   // 获取组件的命名(可以根据自己项目的实际情况进行修改)
//   const componentName = fileName.replace(/^\.\//, '').replace(/\/index.vue$/, '')
//   // 全局注册组件
//   // console.log('componentName', componentName.replace('.vue', ''))
//   console.log('componentConfig', componentConfig)
//   Vue.component(
//     componentName.replace('.vue', ''),
//     // 如果这个组件选项是通过 `export default` 导出的，
//     // 那么就会优先使用 `.default`，否则回退到使用模块的根。
//     componentConfig.default || componentConfig
//   )
// })
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
