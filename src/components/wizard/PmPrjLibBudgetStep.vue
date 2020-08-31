<template>
  <div class="demo">
    项目预算1 FormDemo
    <div>
      是否可编辑状态：{{ isView }}
    </div>
    <div>继承：{{ isView }}</div>
    <Form
      :ui-code="uiCode"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from 'vue-property-decorator'
import { WizardStepVModel, registeredComponent } from '@/views/wizardDemo/WizardStepVModel'
import Form from '@/components/from/formDemo.vue'
// @Component({
//   name: 'PmPrjLibBasisStep',
//   components: {
//     Form
//   }
// })

@registeredComponent('PmPrjLibBudgetStep', '@/components/wizard/PmPrjLibBudgetStep')
export default class extends Mixins(WizardStepVModel) {
  protected uiCode: string = 'special_funds_general_step_form';
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
