import request from '@/utils/request'
// #ifdef H5
import { getSignLink } from '@/hooks/wechat'
// #endif

//发送短信
export function smsSend(data: any) {
    return request.post({ url: '/sms/sendCode', data: data })
}

/**
 * @return { Promise }
 * @description 获取公共配置
 */
export const apiConfigGet = () => request.get({ url: '/config/config' })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 访问量
 */
export const apiIndexVisit = (params: any) => request.post({ url: '/index/visit', data: params })

/**
 * @return { Promise }
 * @description 获取公共配置
 */
// 获取政策协议
export const apiPolicyAgreement = (params: any) => request.get({ url: '/config/agreement', data: params })

/**
 * @return { Promise }
 * @description 微信消息订阅
 */
export const apiSubscribe = (params: any) => request.get({ url: '/subscribe/lists', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 支付方式
 */
export const apiPayPayWay = (params: any) => request.get({ url: '/pay/payWay', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 预支付
 */

// 获取支付状态
export function getPayStatus(data: any) {
    return request.get({ url: '/mall.pay/status', data: data }, { isAuth: true })
}

// 获取支付结果
export function getPayResult(params: any,token:string) {
    return request.get({ url: '/pay/getPayResult', data: params, header: {token:token} })
}

export const apiPayPrepay = (params: any) => request.post({ url: '/pay/prepay', data: params })

export const apiJumpPayPrepay = (params: any,token:string) => request.post({ url: '/pay/prepay', data: params, header: {token:token}})

/**
 * @param { Object } params
 * @return { Promise }
 * @description 公众号登录
 */
export const apiOALogin = (params: any) => request.post({ url: '/login/oaLogin', data: params })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 公众号-获取授权url
 */
export const apiCodeUrlGet = () =>
    request.get({
        url: '/login/codeUrl',
        data: {
            url: location.href
        }
    })

/**
 * @param { Object } params
 * @return { Promise }
 * @description 微信sdk配置
 */
export const apiJsConfig = () =>
    request.get({ url: '/wechat/jsConfig', data: { url: getSignLink() } })

/**
 * @param { Object } params { address: 广州市番禺区xxx }
 * @return { Promise }
 * @description 地址逆解析
 */
export const getGeocoder = (params: any) => request.get({ url: '/index/geocoder', data: params })

/**
 * @param { Object } params { location: xxx,xxx }
 * @return { Promise }
 * @description 地址逆解析
 */
export const getGeocoderCoordinate = (params: any) =>
    request.get({ url: '/index/geocoderCoordinate', data: params })

export function uploadImage(file: any, token?: string) {
    return request.uploadFile({
        url: '/upload/image',
        filePath: file,
        name: 'file',
        header: {
            token
        },
        fileType: 'image'
    })
}


export const getAddress = (params: any) =>
    request.get({ url: '/index/address', data: params })


// 获取小程序码
export function getMiniQrCode(data: any) {
    return request.get({ url: '/share/getMnpQrCode', data: data }, { isAuth: true })
}

// 获取海报图片base64
export function getGoodsImagesBase64(data: any) {
    return request.get({ url: '/share/getGoodsImagesBase64', data: data }, { isAuth: true })
}

/**
 * @return { Promise }
 * @description 获取客服配置
 */
export const apiGetKefuConfig = () => request.get({ url: '/config/getKefuConfig' })