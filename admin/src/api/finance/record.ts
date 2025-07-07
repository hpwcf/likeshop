import request from '@/utils/request'

export function getRefundList(params: any = '') {
    return request.get({ url: '/order.order_refund/lists', params })
}

export function getRefundlogLists(params: any) {
    return request.get({ url: '/order.order_refund/logLists', params })
}

export function getreRefund(params: any) {
    return request.post({ url: '/order.order_refund/reRefund', params })
}
