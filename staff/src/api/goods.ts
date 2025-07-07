import request from '@/utils/request'

/**
 * @param { Object } params
 * @return { Promise }
 * @description 获取服务列表
 */
export const apiGoodsLists = (params) => request.get({ url: '/goods/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 获取服务详情
 */
export const apiGoodsDetail = (params) => request.get({ url: '/goods/detail', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 获取服务分类列表
 */
export const apiGoodsCategoryLists = (params) => request.get({ url: '/goods_category/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 服务评价列表
 */
export const apiGoodsCommentLists = (params) => request.get({ url: '/goods_comment/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 服务评价分类
 */
export const apiGoodsCommentCategory = (params) => request.get({ url: '/goods_comment/commentCategory', data: params })
