import request from '@/utils/request'

/**
 * @param { Object } params
 * @return { Promise }
 * @description 首页数据
 */
export const apiIndex = (params: any) => request.get({ url: '/index/index', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 轮博图
 */
export const apiAdLists = (params: any) => request.get({ url: '/ad/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 获取地级市列表 以首字母排序
 */
export const apiRegionCity = (params: any) => request.get({ url: '/region/city', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 开通城市列表
 */
export const apiIndexOpenCity = (params: any) => request.get({ url: '/index/openCity', data: params })
