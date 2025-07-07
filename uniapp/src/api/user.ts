import request from '@/utils/request'

/**
 * @description 用户中心
 */
export const getUserCenter = (header?: any) => request.get({ url: '/user/center', header })

// 获取用户信息
export const apiUserInfoGet = () => request.get({ url: '/user/info' }, { isAuth: true })

// 设置用户信息
export const apiUserInfoSet = (params: any) =>
    request.post({ url: '/user/setInfo', data: params }, { isAuth: true })

// 获取微信小程序手机号
export const apiWechatMobileGet = (params: any) =>
    request.post({ url: '/user/getMobileByMnp', data: params }, { isAuth: true })

// 发送验证码-绑定手机号
export const apiBindMobileCaptcha = (params: any) =>
    request.post({ url: '/user/bindMobileCaptcha', data: params }, { isAuth: true })

// 绑定手机号
export const apiBindMobile = (params: any, header?: any) =>
    request.post({ url: '/user/bindMobile', data: params, header }, { isAuth: true })

// 绑定微信-小程序
export const apiBindwx = (params: any, header?: any) =>
    request.post({ url: '/login/mnpAuthBind', data: params, header }, { isAuth: true })

// 绑定微信-公众号
export const apiBindoa = (params: any, header?: any) =>
    request.post({ url: '/login/oaAuthBind', data: params, header }, { isAuth: true })

// 解绑 -- 测试用
export const apiUnBindwx = (params: any, header?: any) =>
    request.post({ url: '/login/unbinding', data: params }, { isAuth: true })

// 是否设置登录密码
export const apiHasPassword = () => request.get({ url: '/user/hasPassword' }, { isAuth: true })

// 设置登录密码
export const apiSetPassword = (params: any) =>
    request.post({ url: '/user/setPassword', data: params }, { isAuth: true })

// 更改密码
export function userChangePwd(data: any) {
    return request.post({ url: '/user/changePassword', data }, { isAuth: true })
}

//忘记密码
export function forgotPassword(data: Record<string, any>) {
    return request.post({ url: '/user/resetPassword', data })
}

/** Profile End **/

/** Address Start **/
/**
 * @description 获取地址列表
 */
export const apiAddressLists = (params: any) => request.get({ url: '/user_address/lists', data: params })

/**
 * @param { Object } params
 * @description 获取地址详情
 */
export const apiAddressDetail = (params: any) =>
    request.get({ url: '/user_address/detail', data: params })

/**
 * @param { Object } params
 * @description 编辑地址
 */
export const apiAddressEdit = (params: any) =>
    request.post({ url: '/user_address/edit', data: params })

/**
 * @param { Object } params
 * @description 切换默认地址
 */
export const apiAddressEditDefault = (params: any) =>
    request.post({ url: '/user_address/setDefault', data: params })

/**
 * @param { Object } params
 * @description 新增地址
 */
export const apiAddressAdd = (params: any) =>
    request.post({ url: '/user_address/add', data: params })

/**
 * @param { Object } params
 * @description 删除地址
 */
export const apiAddressDel = (params: any) =>
    request.post({ url: '/user_address/del', data: params })
/** Address End **/

/** Evaluate Start **/
/**
 * @param { Object } params
 * @description 获取我的评价列表
 */
export const apiEvaluateLists = (params: any) =>
    request.get({ url: '/goods_comment/commentGoodsLists', data: params }, { ignoreCancel: true })

/**
 * @param { Object } params
 * @description 评价服务信息
 */
export const apiEvaluateGoodsInfo = (params: any) =>
    request.get({ url: '/goods_comment/commentGoodsInfo', data: params })

/**
 * @param { Object } params
 * @description 提交评价信息
 */
export const apiEvaluateAdd = (params: any) =>
    request.post({ url: '/goods_comment/add', data: params })
/** Evaluate End **/

/** Collect Start **/
/**
 * @description 获取我的收藏列表
 */
export const apiCollectLists = () => request.get({ url: '/user/collectLists' })

/** Collect End **/
