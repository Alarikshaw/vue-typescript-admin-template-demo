<template>
  <div class="wizard">
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
          :class="groupKey === item.key ? 'active': ''"
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
                :class="stepKey === child.key ? 'active': ''"
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
        :key="index"
        :is-save="isSave"
        @sucSave="sucSave"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mockData, conversion } from './mockData'
@Component({
  name: 'wizard'
})
export default class extends Vue {
    protected content: string = '这是主体数据';
    /**
       * 左侧tab
       */
    protected stepTabs: Array<any> = [];
    /**
       * 当前活跃步骤信息
       */
    protected groupKey: string = ''
    protected stepKey: string = '';
    /**
       * 当前步骤
       */
    protected moduleId:string = '4b79b0de-312f-11e7-9846-6d430964db20';
    /**
       * 所有向导步骤
       */
    protected moduleData: Array<any> = [];
    /**
       * 当前步骤组件
       */
    protected currentStep: Array<any> = [];
    /**
       * 触发保存机制
       * true时开始进行保存
       */
    protected isSave: Boolean = false;
    /**
       * 进行保存时 下一步 步骤
       */
    protected hideStep: Array<any> = [];
    /**
       * 返回Boolean
       */
    sucSave(e: any) {
      console.log('是否保存成功', e)
      if (e) {
        this.doSwitch(this.hideStep)
      }
    }
    created() {
      this.initData(mockData)
    }
    /**
       * 初始化数据，入口方法
       */
    initData(param: any) {
      try {
        if (!param.data) {
          throw new Error('data数据不存在')
        }
      } catch (err) {
        throw new Error(err)
      }
      param.data.module.map((item: any) => {
        item.component = conversion(item.component)
      })
      this.moduleData = param.data.module
      // 初始化向导
      this.initWizard()
      this.updateWizard(param)
    }
    /**
       * 初始化向导
       */
    initWizard() {

    }
    /**
     * 更新向导
     */
    updateWizard(param: any) {
      const tabs: Array<any> = []
      const groups: any = {}
      const modules = param.data.module
      modules.map((item: any) => {
        const tab = {
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
      })
      this.stepTabs = tabs
      this.goStep(this.moduleId)
    }
    getStepTab(key: any) {
      for (const tab of this.stepTabs) {
        if (tab.children) {
          for (const child of tab.children) {
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
     * 跳转到对应步骤
     * @param {number} step
     */
    goStep(key: any) {
      if (this.stepKey === key) {
        return
      }
      this.doShowStep(key)
    }
    /**
     * 显示某步骤
     * @param step
     */
    doShowStep(key: any) {
      const tab = this.getStepTab(key)
      if (!tab) {
        return
      }
      // 切换步骤
      this.groupKey = tab.group || tab.key
      this.stepKey = tab.key
      this.moduleId = tab.key
      this.callStepApi()
    }
    /**
     * 获取当前步骤的Api
     */
    callStepApi(key?: any) {
      this.moduleData.map(item => {
        if (item.id === this.moduleId) { // 先触发保存
          this.isSave = true
          // 同时 存下 下一步步骤 数据，待保存成功后赋值（item）
          // 直接监听 isSave  false 可以进行切换
          this.hideStep = [item]
          //   if () //
          this.currentStep = [item]
        }
      })
      console.log(this.currentStep[0].component)
    }
    /**
     * 切换方法
     */
    doSwitch(step?: any) {
      console.log('step', step)
    }
}
</script>

<style lang="scss" scoped>
.wizard {
    height: 100%;
    display: flex;
    padding-bottom: 31vh;

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
