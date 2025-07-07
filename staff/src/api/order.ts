import request from '@/utils/request'

/**
 * @param { Object } params
 * @return { Promise }
 * @description 师傅订单列表
 */
export const apiStaffOrderLists = (params: any) => request.get({ url: '/order/staffOrderLists', data: params })

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
 * @description 抢单
 */
export const apiOrderGrab = (params: any) => request.post({ url: '/order/grab', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 接单
 */
export const apiOrderReceive = (params: any) => request.post({ url: '/order/receive', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 已出发
 */
export const apiOrderSetout = (params: any) => request.post({ url: '/order/setout', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 已到达
 */
export const apiOrderArrive = (params: any) => request.post({ url: '/order/arrive', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 开始服务
 */
export const apiOrderStart = (params: any) => request.post({ url: '/order/start', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 完成服务
 */
export const apiOrderFinish = (params: any) => request.post({ url: '/order/finish', data: params })

/** 师傅订单服务 end **/
