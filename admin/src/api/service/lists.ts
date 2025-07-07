import request from '@/utils/request'

// 服务列表
export function apiServiceLists(params: any) {
    return request.get({ url: '/goods.goods/lists', params })
}

// 添加服务
export function apiServiceAdd(params: any) {
    return request.post({ url: '/goods.goods/add', params })
}

// 删除服务
export function apiServiceDel(params: any) {
    return request.post({ url: '/goods.goods/del', params })
}

// 编辑服务
export function apiServiceEdit(params: any) {
    return request.post({ url: '/goods.goods/edit', params })
}

// 编辑服务状态
export function apiServiceStatus(params: any) {
    return request.post({ url: '/goods.goods/status', params })
}

// 服务详情
export function apiServiceDetail(params: any) {
    return request.get({ url: '/goods.goods/detail', params })
}

export type SkuNameValue = {
    value: string
}
export type SkuNameList = {
    name: string
    value: SkuNameValue[]
}
export type SkuItemList = {
    id?: number | string
    ids?: number[]
    sku_value_arr: string[]
    price: string | number
    line_price: string | number
    duration: string | number
}
export type formDataObj = {
    type?: string | number
    name?: string
    remarks?: string
    category_id?: string | number
    skill_id?: string | number
    label?: string
    goods_image: Array<string>
    open_city_id?: Array<number | null>
    appoint_start_time?: string | number
    appoint_end_time?: string | number
    content?: string
    virtual_sale_num?: string | number
    earnings_ratio?: string | number
    sort?: string | number
    status?: number
    sku_type: number //规格类型 0单规格 1多规格
    sku_name_list?: SkuNameList[] //规格名
    sku?: SkuItemList[] //规格项
}
