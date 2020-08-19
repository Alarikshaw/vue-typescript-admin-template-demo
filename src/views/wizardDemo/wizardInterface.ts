/**
 * 步骤信息
 */
export interface StepInfo {
    /**
     * 组件名
     */
    component: string;
    /**
     * 主体内容
     */
    content: string;
    /**
     * 步骤信息
     */
    data: any;
    /**
     * 步骤主键id
     */
    id: string;
    /**
     * 未定
     */
    isEnable: number;
    isUse: number;
    /**
     * 是否预览
     */
    isView: number;
    showType: number;
    visibleFilter: string;
    readonly: number;
    isVisible: boolean;
    [propName: string]: any;
}

/**
 * 必要变量
 */
export interface IStep {
    /**
     * 当前数据主键id
    */
    moduleId: string;

    /** 显示数据 */
    showStep?(data: Object): Function;

    /** 隐藏 */
    hideStep?(): Function;
    [propName: string]: any;
}

/**
 * 唤起向导必须参数
 */
export interface IncsParam {
    useObject: string;
    data: Object;
    [propName: string]: any;
}
