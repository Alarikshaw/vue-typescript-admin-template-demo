<template>
  <div class="wizard">
    <el-button
      type="primary"
      @click="clickWizard"
    >
      唤起向导
    </el-button>
    <el-dialog
      title="向导"
      :visible.sync="isWizard"
      width="100%"
      top="1vh"
      :close-on-press-escape="true"
      :before-close="handleClose"
    >
      <wizard />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button @click="isWizard = false">取 消</el-button>
        <el-button
          type="primary"
          @click="isWizard = false"
        >确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import wizard from '@/views/wizardDemo/wizard1.vue'
@Component({
  name: 'wizardDemo',
  components: {
    wizard
  }
})
export default class extends Vue {
    protected isWizard: Boolean = false;
    protected clickWizard() {
      this.isWizard = true
    }
    handleClose(done: any) {
      this.$confirm('确认关闭？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '关闭',
        cancelButtonText: '取消'
      })
        .then(() => {
          done()
        })
        .catch(action => {
        })
    }
}
</script>
