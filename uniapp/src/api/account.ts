import request from '@/utils/request'
import { client } from '@/utils/client'

/** Login Start **/
/**
 * @param { Object } params
 * @return { Promise }
 * @description 微信登录
 */
export const apiWechatAuthLogin = (params: any) =>
    request.post({ url: '/login/authLogin', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 手机号登录--发送验证码
 */
export const apiCaptchaLogin = (params: any) =>
    request.post({ url: '/login/captcha', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 手机号密码/手机号验证码登录
 */
export const login = (params: any) =>
    request.post({ url: '/login/account', data: { ...params, terminal: client } })

// 小程序-登录
export function mnpLogin(data: Record<string, any>) {
    return request.post({ url: '/login/mnpLogin', data })
}

//注册
export function register(data: Record<string, any>) {
    return request.post({ url: '/login/register', data: { ...data, channel: client } })
}

/**
 * @param { Object } params
 * @return { Promise }
 * @description 小程序静默登录
 */
export const apiSilentLogin = (params: any) =>
    request.post({ url: '/login/silentLogin', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 退出登录
 */
export const apiLoginOut = (params: any) => request.post({ url: '/login/logout', data: params })
/** Login End **/

/** Register Start **/
/**
 * @param { Object } params
 * @return { Promise }
 * @description 手机号注册--发送验证码
 */
export const apiCaptchaRegister = (params: any) =>
    request.post({ url: '/register/captcha', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 手机号注册
 */
export const apiAccountRegister = (params: any) =>
    request.post({ url: '/register/register', data: params })
/** Register End **/

//更新微信小程序头像昵称
export function updateUser(data: Record<string, any>, header: any) {
    return request.post({ url: '/login/updateUser', data, header })
}
