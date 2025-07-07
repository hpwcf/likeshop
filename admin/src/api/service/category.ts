import request from '@/utils/request'

// 分类列表
export function apiCategoryLists(params: any) {
    return request.get({ url: '/goods.goods_category/lists', params })
}

// 添加分类
export function apiCategoryAdd(params: any) {
    return request.post({ url: '/goods.goods_category/add', params })
}

// 删除分类
export function apiCategoryDel(params: any) {
    return request.post({ url: '/goods.goods_category/del', params })
}

// 编辑分类
export function apiCategoryEdit(params: any) {
    return request.post({ url: '/goods.goods_category/edit', params })
}

// 编辑分类状态
export function apiCategoryStatusEdit(params: any) {
    return request.post({ url: '/goods.goods_category/status', params })
}

// 分类详情
export function apiCategoryDetail(params: any) {
    return request.get({ url: '/goods.goods_category/detail', params })
}

// 通用分类列表
export function apiCategoryCommonLists() {
    return request.get({ url: '/goods.goods_category/commonLists' })
}
