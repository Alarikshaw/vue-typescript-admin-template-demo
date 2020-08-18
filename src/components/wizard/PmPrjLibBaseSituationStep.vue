<template>
  <div class="demo">
    基本情况
    <div>
      是否可编辑状态：{{ isView }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'PmPrjLibBasisStep'
})
export default class extends Vue {
  @Prop({ default: false }) private isSave!: boolean // 是否开始保存
  @Prop({ default: true }) private isView!: boolean // 是否可编辑
  /**
   * 监听是否开始保存 必写
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
      status: true, // 必写
      message: '恭喜你，这次保存成功'
    }
    this.$emit('sucSave', param)
  }
}
</script>
