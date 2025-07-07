//菜单主题类型
export enum ThemeEnum {
    LIGHT = 'light',
    DARK = 'dark'
}

// 客户端
export enum ClientEnum {
    MP_WEIXIN = 1, // 微信-小程序
    OA_WEIXIN = 2, // 微信-公众号
    H5 = 3, // H5
    IOS = 5, //苹果
    ANDROID = 6 //安卓
}

export enum SMSEnum {
    LOGIN = 'YZMDL',
    BIND_MOBILE = 'BDSJHM',
    CHANGE_MOBILE = 'BGSJHM',
    RESET_PASSWORD = 'CSDLMM',
    REGISTER = 'ZCYZM'
}

export enum SearchTypeEnum {
    HISTORY = 'history'
}

// 用户资料
export enum FieldType {
    NONE = '',
    AVATAR = 'avatar',
    USERNAME = 'account',
    NICKNAME = 'nickname',
    SEX = 'sex'
}

// 支付页面
export const PayEnum = {
    '1': 'orderBuy', // 确认下单支付
    '2': 'orderList', // 订单列表支付
    '3': 'orderDetail' // 订单详情支付
}

// 支付来源类型
export enum PayFromType {
    ORDER = 'order',
    USERRECHARGE = 'user_recharge',
    DIFFERENCE = 'difference_price',
    ADDITIONAL = 'additional'
}
