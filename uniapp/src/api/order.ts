import request from '@/utils/request'

/**
 * @param { Object } params
 * @return { Promise }
 * @description 订单下单
 */
export const apiPlaceOrder = (params: any) =>
    request.post({ url: '/order/placeOrder', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 订单列表
 */
export const apiOrderLists = (params: any) => request.get({ url: '/order/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 订单详情
 */
export const apiOrderDetail = (params: any) => request.get({ url: '/order/detail', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 取消订单
 */
export const apiOrderCancel = (params: any) => request.post({ url: '/order/cancel', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 删除订单
 */
export const apiOrderDel = (params: any) => request.post({ url: '/order/del', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 支付方式
 */
export const apiOrderPayWay = (params: any) => request.get({ url: '/order/payWay', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 补差价
 */
export const apiOrderDifferencePrice = (params: any) => request.post({ url: '/order/differencePrice', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 补差价详情
 */
export const apiOrderDifferencePriceDetail = (params: any) => request.get({ url: '/order/differencePriceDetail', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 加项
 */
export const apiOrderAdditional = (params: any) => request.post({ url: '/order/additional', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 加项详情
 */
export const apiOrderAdditionalDetail = (params: any) => request.get({ url: '/order/additionalDetail', data: params })

