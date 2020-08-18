<template>
  <div class="demo">
    这是通览
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
  @Prop({ default: true }) private isView!: boolean // 是否可编辑
  
}
</script>

