import request from '@/utils/request'

// 设置微信公众号配置
export function setOaConfig(params: any) {
    return request.post({ url: '/channel.official_account_setting/setConfig', params })
}

// 获取微信公众号配置
export function getOaConfig() {
    return request.get({ url: '/channel.official_account_setting/getConfig' })
}

export interface Menu {
    name: string // 菜单名称
    has_menu?: boolean // true-配置子菜单 false-不配置
    type?: string // 菜单类型 click-关键字 view-跳转网页链接 miniprogram - 小程序
    url?: string // 网页链接
    appid?: string
    pagepath?: string
    sub_button: Menu[] | any
}

/**
 * @return { Promise }
 * @description 获取菜单详情
 */
export function getOaMenu() {
    return request.get({ url: '/channel.official_account_menu/detail' })
}

/**
 * @return { Promise }
 * @param { Menu } Menu
 * @description 菜单保存
 */
export function setOaMenuSave(params: Menu | any) {
    return request.post({ url: '/channel.official_account_menu/save', params })
}

/**
 * @return { Promise }
 * @param { Menu } Menu
 * @description 菜单发布
 */
export function setOaMenuPublish(params: Menu | any) {
    return request.post({ url: '/channel.official_account_menu/saveAndPublish', params })
}

/**
 * @return { Promise }
 * @param { string } type
 * @description 获取回复列表
 */
export function getOaReplyList(params: { reply_type: number }) {
    return request.get({ url: '/channel.official_account_reply/lists', params })
}

/**
 * @return { Promise }
 * @param { number } id
 * @description 回复列表删除
 */
export function oaReplyDel(params: { id: number }) {
    return request.post({ url: '/channel.official_account_reply/delete', params })
}

/**
 * @return { Promise }
 * @param { number } id
 * @description 回复状态修改
 */
export function changeOaReplyStatus(params: { id: number }) {
    return request.post({ url: '/channel.official_account_reply/status', params })
}

export interface Reply {
    content: string // 内容
    content_type: number // 内容类型: 1=文本
    keyword?: string // 关键词
    matching_type?: number // 匹配方式: [1=全匹配, 2=模糊匹配]
    name: string // 规则名称
    status: number // 状态: 1=开启, 0=关闭
    type?: string // 类型: follow=关注, keyword=关键词, default=默认
    sort: number // 排序
    reply_type: number // 回复类型 1-关注回复 2-关键词回复 3-默认回复
}
/**
 * @return { Promise }
 * @description 回复添加
 */
export function oaReplyAdd(params: Reply) {
    return request.post({ url: '/channel.official_account_reply/add', params })
}

/**
 * @return { Promise }
 * @description 回复编辑
 */
export function oaReplyEdit(params: Reply) {
    return request.post({ url: '/channel.official_account_reply/edit', params })
}

/**
 * @return { Promise }
 * @param { string } type
 * @description 获取回复详情
 */
export function getOaReplyDetail(params: { id: number }) {
    return request.get({ url: '/channel.official_account_reply/detail', params })
}
