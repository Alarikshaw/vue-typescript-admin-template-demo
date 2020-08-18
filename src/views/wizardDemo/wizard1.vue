<template>
  <div class="wizard">
    <div class="wizard-top">
      <!-- 侧边栏 -->
      <div
        v-if="stepTabs.length > 0"
        class="pm-base-wizard-sidebar"
      >
        <ul class="pm-base-wizard-steps nav nav-tabs tabs-left">
          <li
            v-for="(item, index) in stepTabs"
            :key="index"
            class="pm-base-wizard-step"
            :class="currentGroupKey === item.key ? 'active': ''"
          >
            <a>
              <div class="pm-base-wizard-step-number">{{ index + 1 }}</div>
              <div
                v-if="!item.children"
                class="pm-base-wizard-step-title"
                @click="goStep(item.key)"
              >{{ item.title }}
              </div>
              <div
                v-if="item.children"
                class="pm-base-wizard-step-title"
                @click="goStep(item.children[0].key)"
              >{{ item.title }}
              </div>
              <ul
                v-if="item.children"
                class="pm-base-wizard-steps"
              >
                <li
                  v-for="(child, indexs) in item.children"
                  :key="indexs"
                  class="pm-base-wizard-step"
                  :class="currentStepKey === child.key ? 'active': ''"
                  @click="goStep(child.key)"
                >
                  <a class="pm-base-wizard-step-title">{{ child.title }}</a>
                </li>
              </ul>
            </a>
          </li>
        </ul>
      </div>
      <!-- 右边组件 -->
      <div class="wizard-content">
        <component
          :is="item.component"
          v-for="(item, index) in currentStep"
          :ref="item.component"
          :key="index"
          :is-save="isSave"
          @sucSave="sucSave"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mockData, conversion } from './mockData'
import { ajaxData, moduleData } from './ajaxData'
interface SaveCallback {
    status: string;
    message: string;
}
@Component({
  name: 'wizard'
})
export default class extends Vue {
  /**
   * 当前项目数据
   */
  protected prjData = '' as any;
  /**
   * 所有步骤信息
   */
  protected stepInfos:any = null;

  /**
   * 是否都已完成
   */
  protected allFinished = false;
  /**
   * 左侧步骤条信息
   * @type {Array}
   */
  protected stepTabs: Array<any> = [];
  /**
   * 当前步骤组件
   */
  protected currentStep: Array<any> = [];
  /**
   * 当前大步骤
   */
  protected currentGroupKey = '';
  /**
   * 当前小步骤
   */
  protected currentStepKey = '';
  /**
   * 是否开始保存
   */
  protected isSave: Boolean = false;

  /**
   * 清空临时key
   */
  protected temporaryKey: string = '';
  /**
   * 初始化
   * Vue 声明周期
   */
  created() {
    // 传入假数据
    this.initData(ajaxData)
    console.log('moduleData', moduleData)
  }
  /**
     * 初始化
     */
  protected initData(param: any) {
    try {
      if (!param.data) {
        throw new Error('data数据不存在')
      }
    } catch (err) {
      throw new Error(err)
    }
    // // 有数据情况下 存入
    this.prjData = param

    // 初始化向导
    this.initWizard()
  }
  /**
   * 初始化向导
   */
  protected initWizard() {
    // 重置向导信息
    this.resetWizard()

    // 解析出从接口获取的module信息
    let { module, progress } = moduleData.data
    // 有向导
    if (module) {
      // 保存当前步骤 并更新向导
      module.map((item: any) => {
        item.component = conversion(item.component)
      })
      this.stepInfos = module
      this.updateWizard()
    }
    // 曾经有步骤操作
    if (progress) {
      this.allFinished = progress.isAllComplet === 1
      this.goStep(progress.moduleId)
    } else {
      let tab = this.stepTabs[0]
      if (tab.children) {
        tab = tab.children[0]
      }
      this.goStep(tab.key)
    }
  }
  /**
   * 更新向导
   */
  protected updateWizard() {
    const tabs: any = []
    const groups: any = {}
    const modules: any = this.stepInfos
    modules.map((item: any) => {
      let tab = {
        key: item.id,
        group: '',
        title: item.title || '',
        content: item.content || '',
        $stepInfo: item
      }
      // 如果有分组
      if (item.groupId) {
        tab.group = item.groupId

        let newTab = groups[item.groupId]
        // 如果组别中没有对应，则生成一个新的tab
        if (!newTab) {
          newTab = {
            key: item.groupId,
            title: item.groupName,
            content: '',
            children: [tab]
          }
          // 放入groups
          groups[item.groupId] = newTab
          // 放入tabs
          tabs.push(newTab)
        } else {
          newTab.children.push(tab)
        }
      } else {
        tabs.push(tab)
      }
      this.stepTabs = tabs
    })
  }
  /**
     * 重置向导
     */
  protected resetWizard() {
    this.currentGroupKey = ''
    this.currentStepKey = ''
    this.allFinished = false
    this.stepTabs = []
    this.stepInfos = []
  }
  /**
     * 判断是否为第一个步骤
     * @param key
     */
  protected isFirstStep(key: string) {
    let tab = this.stepTabs[0]
    if (tab && tab.children) {
      tab = tab.children[0]
    }
    if (tab) {
      return tab.key === key
    }
    return false
  }
  /**
     * 判断是否为最后一个步骤
     * @param key
     */
  protected isLastStep(key: string) {
    let tab = this.stepTabs[this.stepTabs.length - 1]
    if (tab && tab.children) {
      tab = tab.children[tab.children.length - 1]
    }
    if (tab) {
      return tab.key === key
    }
    return false
  }
  protected getStepTab(key: string) {
    for (let tab of this.stepTabs) {
      if (tab.children) {
        for (let child of tab.children) {
          if (child.key === key) {
            return child
          }
        }
      } else if (tab.key === key) {
        return tab
      }
    }
  }
  /**
   * 点击前往下一步
   */
  goStep(key: any) {
    if (this.currentStepKey === key) { // 如果相同 则无需更换步骤
      return
    }
    // 判断之前是否右值
    // currentStep
    if (this.currentStep.length !== 1) { // 初始化 无需保存
      this.doShowStep(key)
    } else { // 触发保存机制：步骤已存在，下一步骤与当前并不相同，且在module存在
      // 走保存接口
      this.currentStep.map((item: any) => {
        console.log('item', item)
        if (item.component === 'PmBaseWizardPreviewPro') {
          this.doShowStep(key)
          return
        }
        console.log('currentStepKey', this.currentStepKey)
        if (item.id === this.currentStepKey) {
        // 同时也可 根据传入的数据param或者currentStep 进行多重判断是否需要保存 此处暂不处理
          this.isSave = true
          // 保存当下key
          this.temporaryKey = key
        }
      })
    }
    // this.doShowStep(key)
  }
  /**
   * 保存回调
   * @param saveStatus
   */
  sucSave(param: SaveCallback) {
    console.log(param.message)
    console.log(!param.message)
    console.log(!!param.message)

    this.isSave = false // 保存方法已走

    if (param.status) { // 保存成功
      this.doShowStep(this.temporaryKey)
    }
    if (param.status && !!param.message) {
      // 返回成功 需要提示
      this.$message({
        message: param.message,
        type: 'success'
      })
    }
    if (!param.status && !!param.message) { // 保存失败需要提示
      console.log(param)
      this.$message({
        message: param.message,
        type: 'warning'
      })
    }
  }
  /**
     * 已保存成功
     * 显示某步骤
     * @param step
     */
  protected doShowStep(key: string) {
    const tab = this.getStepTab(key)
    if (!tab) {
      return false
    }
    // 切换步骤
    this.currentGroupKey = tab.group || tab.key
    this.currentStepKey = tab.key
    this.saveCurrentProgress()
    this.doSwitch()

    this.temporaryKey = ''
    // 查看当前所在步骤
    // 第一次进无需处理
    // 得到当前步骤的允许，才可跳转下一步骤
  }
  /**
   * 切换的下一步步骤
   * @param key
   */
  doSwitch() {
    this.stepInfos.map((item: any) => {
      if (item.id === this.currentStepKey) {
        this.currentStep = [item]
      }
    })
    console.log(this.currentStep[0].component)
  }

  /**
   * 保存当前步骤
   */
  saveCurrentProgress() {}
}
</script>

<style lang="scss" scoped>
.wizard {
    height: 100%;
    display: flex;
    padding-bottom: 18vh;
    .wizard-top {
      display: flex;
    }
  > .tab-content, > .tab-content > .tab-pane {
    height: 100%;
  }

  .pm-base-wizard-sidebar {
    margin: 0 5px;
    padding: 0px 5px;
    width: 215px;

    ul.pm-base-wizard-steps {
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
    }

    li.pm-base-wizard-step {
      > a {
        color: #95a5a6;

        > ul.pm-base-wizard-steps {
          padding-left: 40px;
        }

        > ul.pm-base-wizard-steps > li.pm-base-wizard-step {
          cursor: pointer;

          > a {
            font-size: 12px;
            padding: 3px 0px;
            color: #95a5a6;
          }

          &.active > a {
            font-weight: bold;
            color: #3598dc;
          }

          &:hover > a {
            text-decoration: underline;
          }
        }
      }

      .pm-base-wizard-step-number {
        font-size: 16px;
        float: left;
        margin: 0 auto;
        padding: 2px 8px;
        border-radius: 50%;
      }

      .pm-base-wizard-step-title {
        font-size: 16px;
        font-weight: 100;
        padding: 2px 0 2px 40px;
        margin: 0;
      }

      &.active .pm-base-wizard-step-number {
        color: #ffffff;
        background-color: #3598dc;
      }

      &.active .pm-base-wizard-step-title {
        color: #3598dc;
      }

      &.active > a > .pm-base-wizard-step-title {
        font-weight: bold;
      }

    }

  }
}
.nav>li>a {
    position: relative;
    padding: 10px 15px;
}
.nav-tabs>li>a {
    margin-right: 2px;
    line-height: 1.42857143;
    border: 1px solid transparent;
    border-radius: 4px 4px 0 0;
}
.tabs-left .nav-tabs > li > a {
  margin-right: 0px;
  margin-bottom: 3px;
}
.tabs-right.nav-tabs>li>a {
   margin-right: 0;
   margin-bottom: 3px;
}
.tabs-left.nav-tabs {
  border-right: 1px solid #ddd;
}

.tabs-left.nav-tabs>li>a {
  display: block;
  margin-right: -1px
}

.tabs-left.nav-tabs>li>a:focus,.tabs-left.nav-tabs>li>a:hover {
  -webkit-border-radius: 4px 0 0 4px;
  -moz-border-radius: 4px 0 0 4px;
  -ms-border-radius: 4px 0 0 4px;
  -o-border-radius: 4px 0 0 4px;
  border-radius: 4px 0 0 4px;
  border-color: #eee #ddd #eee #eee
}
.tabs-left.nav-tabs>li>a, .tabs-right.nav-tabs>li>a  {
    margin-bottom: 3px;
}
.tabs-left.nav-tabs>li>a {
    display: block;
    margin-right: -1px;
}
.tabs-left.nav-tabs>li.active>a,.tabs-left.nav-tabs>li.active>a:hover>li.active>a:focus {
  -webkit-border-radius: 4px 0 0 4px;
  -moz-border-radius: 4px 0 0 4px;
  -ms-border-radius: 4px 0 0 4px;
  -o-border-radius: 4px 0 0 4px;
  border-radius: 4px 0 0 4px;
  border-color: #ddd transparent #ddd #ddd;
  border-right-color: #fff;
}

.nav>li>a:focus, .nav>li>a:hover {
    text-decoration: none;
    background-color: #eee;
}
.el-dialog__body {
    padding: 10px 100px 20px 20px
}
</style>
