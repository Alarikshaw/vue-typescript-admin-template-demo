<template>
  <div class="demo">
    基本信息
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'PmPrjLibBasisStep'
})
export default class extends Vue {
  @Prop({ default: false }) private isSave!: boolean // 是否开始保存

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
