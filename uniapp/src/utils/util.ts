import { isObject } from '@vue/shared'
import { getToken } from './auth'
import { useUserStore } from '@/stores/user'
import { headerOptions } from '@/config'

/**
 * @description 节流
 * @param { Function } func
 * @param { Number } time
 * @return { Function }
 */
export const throttle = (func: (_p: any) => any, time = 1000): any => {
    let previous = new Date(0).getTime()
    return function (...args: []) {
        const now = new Date().getTime()
        if (now - previous > time) {
            previous = now
            return func(args)
        }
    }
}

/**
 * @description 防抖
 * @param { Function } func
 * @param { Number } time
 * @return { Function }
 */
export const debounce = (func: (_p: any) => any, time = 1000) => {
    let timer: any = null
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            timer = null
            func(args)
        }, time)
    }
}

/**
 * @description 跳转菜单
 * @param  { Object } item 跳转菜单参数
 */
// export function menuJump(item) {
// 	const {
// 		is_tab,
// 		link_address,
// 		link_type
// 	} = item
// 	switch (link_type) {
// 		case 1:
// 			if(is_tab) {
//                 uni.reLaunch({
//                 	url: link_address
//                 });
//             } else {
//                 uni.navigateTo({
//                 	url: link_address
//                 });
//             }
// 			break;
// 		case 2:
// 			// 分类
// 			uni.navigateTo({
// 				url: "/bundle/pages/category_goods_list/index?id=" + link_address
// 			});
// 			break;
// 		case 3:
//         // webview
//         uni.navigateTo({
//         	url: "/pages/webview/webview?url=" + link_address
//         });
//         break;
// 	}
// }

/**
 * @description 获取元素节点信息（在组件中的元素必须要传ctx）
 * @param  { String } selector 选择器 '.app' | '#app'
 * @param  { Boolean } all 是否多选
 * @param  { ctx } context 当前组件实例
 */
export const getRect = (selector: string, all = false, context?: any) => {
    return new Promise((resolve, reject) => {
        let qurey = uni.createSelectorQuery()
        if (context) {
            qurey = uni.createSelectorQuery().in(context)
        }
        qurey[all ? 'selectAll' : 'select'](selector)
            .boundingClientRect(function (rect) {
                if (all && Array.isArray(rect) && rect.length) {
                    return resolve(rect)
                }
                if (!all && rect) {
                    return resolve(rect)
                }
                reject('找不到元素')
            })
            .exec()
    })
}

/**
 * @description 获取当前页面实例
 */
export function currentPage() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    return currentPage || {}
}

/**
 * @description 后台选择链接专用跳转
 */
interface Link {
    path: string
    name?: string
    type: string
    canTab: boolean
    query?: Record<string, any>
}

export enum LinkTypeEnum {
    'SHOP_PAGES' = 'shop',
    'CUSTOM_LINK' = 'custom',
    'MINI_PROGRAM' = 'mini_program'
}

// export function navigateTo(link: Link, navigateType: 'navigateTo' | 'reLaunch' = 'navigateTo') {
//     const url = link.query ? `${link.path}?${objectToQuery(link.query)}` : link.path
//     navigateType == 'navigateTo' && uni.navigateTo({ url })
//     navigateType == 'reLaunch' && uni.reLaunch({ url })
// }
export function navigateTo(link: Link, navigateType: 'navigateTo' | 'switchTab' | 'reLaunch' = 'navigateTo') {
    // 如果是小程序跳转
    if (link.type === LinkTypeEnum.MINI_PROGRAM) {
        navigateToMiniProgram(link)
        return
    }

    const url = link?.query ? `${link.path}?${objectToQuery(link?.query)}` : link.path;

    (navigateType == 'switchTab' || link.canTab) && uni.switchTab({url})
    navigateType == 'navigateTo' && uni.navigateTo({url})
    navigateType == 'reLaunch' && uni.reLaunch({url})
}

/**
 * @description 小程序跳转
 * @param link 跳转信息，由装修数据进行输入
 */
export function navigateToMiniProgram(link: Link) {
    const query = link.query;
    // #ifdef H5
    window.open(
        `weixin://dl/business/?appid=${query?.appId}&path=${query?.path}&env_version=${query?.env_version}&query=${encodeURIComponent(query?.query)}`
    )
    // #endif
    // #ifdef MP
    uni.navigateToMiniProgram({
        appId: query?.appId,
        path: query?.path,
        extraData: parseQuery(query?.query),
        envVersion: query?.env_version,
    })
    // #endif
}

/**
 * @description 是否为空
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value: unknown) => {
    return value == null && typeof value == 'undefined'
}

/**
 * @description 显示消息提示框。
 * @param  { String } title 弹出内容
 * @param  { Number } duration 延时多少毫秒
 */
export const toast = (title: string | undefined, duration = 1000) => {
    uni.showToast({
        title: title,
        duration: duration,
        icon: 'none'
    })
}

/**
 * @description 对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params: Record<string, any>): string {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        const part = encodeURIComponent(props) + '='
        if (!isEmpty(value)) {
            console.log(encodeURIComponent(props), isObject(value))
            if (isObject(value)) {
                for (const key of Object.keys(value)) {
                    if (!isEmpty(value[key])) {
                        const params = props + '[' + key + ']'
                        const subPart = encodeURIComponent(params) + '='
                        query += subPart + encodeURIComponent(value[key]) + '&'
                    }
                }
            } else {
                query += part + encodeURIComponent(value) + '&'
            }
        }
    }
    return query.slice(0, -1)
}
/**
 * @description 上传图片
 * @param  { String } path 选择的本地地址
 */
export function uploadFile(path: any) {
    return new Promise((resolve, reject) => {
        const userStore = useUserStore()
        uni.uploadFile({
            url: `${import.meta.env.VITE_APP_BASE_URL || ''}/api/Upload/image`,
            filePath: path,
            name: 'file',
            header: {
                token: userStore.token,
                version: '1.0.0'
            },
            fileType: 'image',
            success: (res) => {
                console.log('uploadFile res ==> ', res)
                const data = JSON.parse(res.data)
                if (data.code == 1) {
                    resolve(data.data)
                } else {
                    reject()
                }
            },
            fail: (err) => {
                console.log('。。。。', err)
                reject()
            }
        })
    })
}

/**
 * @description jsonp请求跨域地址
 * @param  { Object } url 请求地址
 * @param  { Object } data 请求参数
 */
export const jsonp = (url, data) => {
    // #ifdef H5
    return new Promise((resolve, reject) => {
        // 1.初始化url
        const dataString = url.indexOf('?') === -1 ? '?' : '&'
        const callbackName = `jsonpCB_${Date.now()}`
        url += `${dataString}callback=${callbackName}`
        if (data) {
            // 2.有请求参数，依次添加到url
            for (const k in data) {
                url += `&${k}=${data[k]}`
            }
        }
        const scriptNode = document.createElement('script')
        scriptNode.src = url
        // 3. callback
        window[callbackName] = (result) => {
            result ? resolve(result) : reject('没有返回数据')
            delete window[callbackName]
            document.body.removeChild(scriptNode)
        }
        // 4. 异常情况
        scriptNode.addEventListener(
            'error',
            () => {
                reject('接口返回数据失败')
                delete window[callbackName]
                document.body.removeChild(scriptNode)
            },
            false
        )
        // 5. 开始请求
        document.body.appendChild(scriptNode)
    })
    // #endif
}

// 清除本地缓存
export const removeStorageData = (key: string) => {
    uni.removeStorage({
        key,
        success: (res) => {
            console.log('清除成功', res)
        }
    })
}

/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'rpx') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

// 匹配6-20位纯数字和字母组合的正则表达式
export const validateInput = (inputStr) => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/

    // 检查输入是否符合规则
    if (regex.test(inputStr)) {
        return true
    } else {
        return false
    }
}


/**
 * @description 将一个数组分成几个同等长度的数组
 * @param  { Array } array[分割的原数组]
 * @param  { Number } size[每个子数组的长度]
 */
export const sliceArray = (array: any[], size: number) => {
    const result = []
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
        const start = x * size
        const end = start + size
        result.push(array.slice(start, end))
    }
    return result
}


/**
 * @description 格式化输出价格
 * @param  { string } price 价格
 * @param  { string } take 小数点操作
 * @param  { string } prec 小数位补
 */
export function formatPrice({price, take = 'all', prec = undefined}: any) {
    let [integer, decimals = ''] = (price + '').split('.')

    // 小数位补
    if (prec !== undefined) {
        const LEN = decimals.length
        for (let i = prec - LEN; i > 0; --i) decimals += '0'
        decimals = decimals.substr(0, prec)
    }

    switch (take) {
        case 'int':
            return integer
        case 'dec':
            return decimals
        case 'all':
            return integer + '.' + decimals
    }
}