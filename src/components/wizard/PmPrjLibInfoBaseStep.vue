<template>
  <div class="demo">
    基本信息
    <div>
      是否可编辑状态：{{ isView }}
    </div>
    <div>继承：{{ isView }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from 'vue-property-decorator'
import WizardStepVModel from '@/views/wizardDemo/WizardStepVModel'
@Component({
  name: 'PmPrjLibBasisStep'
})
export default class extends Mixins(WizardStepVModel) {
  /**
     * 自动触发 保存方法
     */
  save() {
    let param = {
      status: true,
      message: '恭喜你，这次保存成功'
    }
    this.$emit('sucSave', param)
  }
  created() {
    // 传入假数据
    this.doInIt(this.prjData)
  }
  doInIt(data: any) {
    console.log('初始化', data)
  }
}
</script>
