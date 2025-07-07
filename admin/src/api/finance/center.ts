import request from '@/utils/request'

export function getFinanceCenter(params: any) {
    return request.get({ url: '/finance.center/center', params })
}
