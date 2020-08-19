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
      <wizard
        @closeParent="closeParent"
      />
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

    /**
     * 向导回调
     * 根据key的值进行具体的回调
     * @param key
     */
    protected closeParent(key: string) {
      console.log('保存KBKBKB/', key)
      if (key === 'saveBtn') {
        this.isWizard = false
        return false
      } else if (key === 'finishBtn') {
        this.finishCallback()
      } else {
        this.prompt(key)
      }
    }
    /**
     * 完成回调
     */
    finishCallback() {
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
      this.isWizard = false
      this.$confirm('是否上报', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '上报',
        cancelButtonText: '取消'
      })
        .then((e) => { // 点击上报确定执行方法
          console.log('e', e)
        })
        .catch(action => { // 点击取消执行方法
          console.log('action', action)
        })
    }
    /**
     * 提示
     */
    prompt(key: string) {
      this.$confirm('确认关闭？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '关闭',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.isWizard = false
          console.log('回调key', key)
        })
        .catch(action => {
        })
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
