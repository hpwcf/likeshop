import request from '@/utils/request'

// 订单列表
export function apiOrderLists(params: any) {
    return request.get({ url: '/order.order/lists', params })
}

// 订单详情
export function apiOrderDetail(params: any) {
    return request.get({ url: '/order.order/detail', params })
}

// 订单取消
export function apiOrderCancel(params: any) {
    return request.post({ url: '/order.order/cancel', params })
}

// 订单商家备注
export function apiOrderRemark(params: any) {
    return request.post({ url: '/order.order/remark', params })
}

// 订单商家备注详情
export function apiOrderRemarkDetail(params: any) {
    return request.get({ url: '/order.order/remarkDetail', params })
}

// 订单删除
export function apiOrderDel(params: any) {
    return request.post({ url: '/order.order/del', params })
}

// 订单核销
export function apiOrderVerification(params: any) {
    return request.post({ url: '/order.order/verification', params })
}

// 师傅列表
export function apiStaffLists(params: any) {
    return request.get({ url: '/order.order/staffLists', params })
}

// 指派师傅
export function apiDispatchStaff(params: any) {
    return request.post({ url: '/order.order/dispatchStaff', params })
}

// 退款列表
export function apiRefundOperationLists(params: any) {
    return request.get({ url: '/order.order/refundOperationLists', params })
}

// 退款信息
export function apiRefundInfo(params: any) {
    return request.get({ url: '/order.order/refundInfo', params })
}

// 退款
export function apiOrderRefund(params: any) {
    return request.post({ url: '/order.order/refund', params })
}

// 接取订单
export function apiAcceptOrder(params: any) {
    return request.post({ url: '/order.order/acceptOrder', params })
}

// 师傅出发
export function apiStaffSetout(params: any) {
    return request.post({ url: '/order.order/staffSetout', params })
}

// 师傅到达
export function apiStaffArrive(params: any) {
    return request.post({ url: '/order.order/staffArrive', params })
}

// 开始服务
export function apiStartService(params: any) {
    return request.post({ url: '/order.order/startService', params })
}

// 服务完成
export function apiOrderFinish(params: any) {
    return request.post({ url: '/order.order/finish', params })
}
