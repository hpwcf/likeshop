import request from '@/utils/request'

// 充值记录
export function apiRechargeRecord(params: any) {
    return request.get({ url: '/finance.recharge/lists', params })
}
