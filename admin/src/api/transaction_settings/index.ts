import request from '@/utils/request'
import { List } from '@element-plus/icons-vue'

// 获取交易设置
export function getConfig(params: any = '') {
    return request.get({ url: '/setting.transaction_settings/getConfig', params })
}

// 设置交易设置
export function setConfig(params: any) {
    return request.post({ url: '/setting.transaction_settings/setConfig', params })
}

//订单结算周期 按周期 每周
export const weekLists = [
    {
        value: 1,
        label: '周一'
    },
    {
        value: 2,
        label: '周二'
    },
    {
        value: 3,
        label: '周三'
    },
    {
        value: 4,
        label: '周四'
    },
    {
        value: 5,
        label: '周五'
    },
    {
        value: 6,
        label: '周六'
    },
    {
        value: 7,
        label: '周日'
    }
]
// export default weekLists

//订单结算周期 按周期 每月
export const monthLists = [
    {
        value: 1,
        label: '1号'
    },
    {
        value: 2,
        label: '2号'
    },
    {
        value: 3,
        label: '3号'
    },
    {
        value: 4,
        label: '4号'
    },
    {
        value: 5,
        label: '5号'
    },
    {
        value: 6,
        label: '6号'
    },
    {
        value: 7,
        label: '7号'
    },
    {
        value: 8,
        label: '8号'
    },
    {
        value: 9,
        label: '9号'
    },
    {
        value: 10,
        label: '10号'
    },
    {
        value: 11,
        label: '11号'
    },
    {
        value: 12,
        label: '12号'
    },
    {
        value: 13,
        label: '13号'
    },
    {
        value: 14,
        label: '14号'
    },
    {
        value: 15,
        label: '15号'
    },
    {
        value: 16,
        label: '16号'
    },
    {
        value: 17,
        label: '17号'
    },
    {
        value: 18,
        label: '18号'
    },
    {
        value: 19,
        label: '19号'
    },
    {
        value: 20,
        label: '20号'
    },
    {
        value: 21,
        label: '21号'
    },
    {
        value: 22,
        label: '22号'
    },
    {
        value: 23,
        label: '23号'
    },
    {
        value: 24,
        label: '24号'
    },
    {
        value: 25,
        label: '25号'
    },
    {
        value: 26,
        label: '26号'
    },
    {
        value: 27,
        label: '27号'
    },
    {
        value: 28,
        label: '28号'
    }
]
