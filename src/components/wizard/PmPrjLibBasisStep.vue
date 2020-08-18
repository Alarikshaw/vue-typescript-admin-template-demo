<template>
  <div class="demo">
    立项依据
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'PmPrjLibBasisStep'
})
export default class extends Vue {
  @Prop({ default: false }) private isSave!: boolean // 是否开始保存
  @Prop({
    type: Object, // 数据类型
    required: true, // 是否必填
    default: {}, // 默认值
  }) protected prjData!: Object

  /**
   * 初始化
   * Vue 声明周期
   */
  created() {
    // 传入假数据
    this.initData(this.prjData)
    console.log('moduleData', this.prjData)
  };
  /** 
   * 初始化数据
   */
  protected initData(prjData: Object) {

  }
  /**
   * 监听是否开始保存
   * @param isSave
   */
  @Watch('isSave')
  private onValueChange(value: Boolean) {
    console.log('watch value', value)
    if (value) {
      this.save()
    }
  }
  save() {
    let param = {
      status: true,
      message: '恭喜你，这次保存成功'
    }
    this.$emit('sucSave', param)
  }
}
</script>
