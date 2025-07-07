import request from '@/utils/request'

/**
 * @param { Object } params
 * @return { Promise }
 * @description 装修数据
 */
export const getDecoratePage = (params: any) => request.get({ url: '/decorate/page', data: params })
/**
 * @param { Object } params
 * @return { Promise }
 * @description 装修风格
 */
export const getDecorateStyle = (params: any) => request.get({ url: '/decorate/style', data: params })
/**
 * @param { Object } params
 * @return { Promise }
 * @description 底部导航
 */
export const getDecorateTabbar = (params: any) => request.get({ url: '/decorate/tabbar', data: params })
