import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { StepInfo, IStep } from './wizardInterface'
function func(rootAddress: string) {
  const requireComponent = require.context(
    // 其组件目录的相对路径
    rootAddress,
    // 是否查询其子目录
    true,
    // 匹配基础组件文件名的正则表达式
    /\.(vue|js)$/
  )
  requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)
    // 获取组件的命名(可以根据自己项目的实际情况进行修改)
    const componentName = fileName.replace(/^\.\//, '').replace(/\/index.vue$/, '')
    // 全局注册组件
    // console.log('componentName', componentName.replace('.vue', ''))
    console.log('componentConfig', componentConfig)
    Vue.component(
      componentName.replace('.vue', ''),
      // 如果这个组件选项是通过 `export default` 导出的，
      // 那么就会优先使用 `.default`，否则回退到使用模块的根。
      componentConfig.default || componentConfig
    )
  })
  return true
}
function registeredComponent(componentName: string, rootAddress: string) {
  return func(rootAddress)
}

/**
 * 向导类
 */
@Component({
  name: 'WizardStepVModel'
})
class WizardStepVModel extends Vue implements IStep {
    moduleId!: string;
    /**
     * 步骤信息
     */
    protected stepInfo?: StepInfo;

    /**
     * 是否开始保存
     */
    @Prop({ default: false }) protected isSave!: boolean

    /**
     * 是否为通览（主要在预览中使用）
     */
    @Prop({ default: false }) protected isView!: boolean

    /**
     * 当前主项目数据
     */
    @Prop({
      default: {},
      required: true,
      type: Object
    }) protected prjData!: Object

    // @Prop({
    //     type: String, // 父组件传递给子组件的数据类型
    //     required: false, // 是否必填
    //     default: ' ' // 默认值， 如果传入的是 Object，则要 default: ()=>({}) 参数为函数
    // })  value !: string;

    /**
   * 监听是否开始保存
   * @param isSave
   */
    @Watch('isSave')
    protected onValueChange(value: Boolean) {
      console.log('watch value', value)
      if (value) {
        this.save()
      }
    }
    /**
     * 保存方法
     */
    protected save() {
      let param = {
        status: true,
        message: '恭喜你，这次保存成功'
      }
      this.$emit('sucSave', param)
    }
}
export {
  WizardStepVModel,
  registeredComponent
}
