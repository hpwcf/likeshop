import request from '@/utils/request'
import { client } from '@/utils/client'

/** Login Start **/

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
 * @description 手机号登录
 */
export const login = (params: any) =>
    request.post({ url: '/login/login', data: { ...params, terminal: client } })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 注册
 */
export function register(data: Record<string, any>) {
    return request.post({ url: '/login/register', data: { ...data, channel: client } })
}

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
/** Register End **/
