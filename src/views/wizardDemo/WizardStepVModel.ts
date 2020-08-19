import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { StepInfo, IStep } from './wizardInterface'
/**
 * 向导类
 */
@Component({
  name: 'WizardStepVModel'
})
export default class WizardStepVModel extends Vue implements IStep {
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
