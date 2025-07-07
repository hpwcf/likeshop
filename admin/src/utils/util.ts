import { isObject } from '@vue/shared'
import { cloneDeep } from 'lodash'
import feedback from '@/utils/feedback'
import area from '@/utils/area'

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */

export const treeToArray = (data: any[], props = { children: 'children' }) => {
    data = cloneDeep(data)
    const { children } = props
    const newData = []
    const queue: any[] = []
    data.forEach((child: any) => queue.push(child))
    while (queue.length) {
        const item: any = queue.shift()
        if (item[children]) {
            item[children].forEach((child: any) => queue.push(child))
            delete item[children]
        }
        newData.push(item)
    }
    return newData
}

/**
 * @description 数组转
 * @param {Array} data  数据
 * @param {Object} props `{ parent: 'pid', children: 'children' }`
 */

export const arrayToTree = (
    data: any[],
    props = { id: 'id', parentId: 'pid', children: 'children' }
) => {
    data = cloneDeep(data)
    const { id, parentId, children } = props
    const result: any[] = []
    const map = new Map()
    data.forEach((item) => {
        map.set(item[id], item)
        const parent = map.get(item[parentId])
        if (parent) {
            parent[children] = parent[children] ?? []
            parent[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * 深拷贝
 * @param {any} target 需要深拷贝的对象
 * @returns {Object}
 */
export function deepClone(target: any) {
    if (typeof target !== 'object' || target === null) {
        return target
    }

    const cloneResult: any = Array.isArray(target) ? [] : {}

    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            const value = target[key]

            if (typeof value === 'object' && value !== null) {
                cloneResult[key] = deepClone(value)
            } else {
                cloneResult[key] = value
            }
        }
    }

    return cloneResult
}

/**
 * @author Jason
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'px') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

/**
 * @author Jason
 * @description 添加单位
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value: unknown) => {
    return value !== null && value !== '' && typeof value !== 'undefined'
}

/**
 * @author Jason
 * @description 获取正确的路经
 * @param {String} path  数据
 */
export function getNormalPath(path: string) {
    if (path.length === 0 || !path || path == 'undefined') {
        return path
    }
    const newPath = path.replace('//', '/')
    const length = newPath.length
    if (newPath[length - 1] === '/') {
        return newPath.slice(0, length - 1)
    }
    return newPath
}

/**
 * @author Jason
 * @description对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params: Record<string, any>): string {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        const part = encodeURIComponent(props) + '='
        if (!isEmpty(value)) {
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
 * @description 时间格式化
 * @param dateTime { number } 时间戳
 * @param fmt { string } 时间格式
 * @return { string }
 */
// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
export const timeFormat = (dateTime: number, fmt = 'yyyy-mm-dd') => {
    // 如果为null,则格式化当前时间
    if (!dateTime) {
        dateTime = Number(new Date())
    }
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length == 10) {
        dateTime *= 1000
    }
    const date = new Date(dateTime)
    let ret
    const opt: any = {
        'y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'h+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        's+': date.getSeconds().toString() // 秒
    }
    for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
        }
    }
    return fmt
}

/**
 * @description 获取不重复的id
 * @param length { Number } id的长度
 * @return { String } id
 */
export const getNonDuplicateID = (length = 8) => {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substring(3, length)
    return idStr
}

/**
 * @description 数组扁平化
 * @param arr { Array } 扁平化对象
 * @return { Array } 扁平化后的数组
 */
export const flatten = (arr: any[]): any[] => {
    return arr.reduce((result, item) => {
        return result.concat(Array.isArray(item) ? flatten(item) : item)
    }, [])
}

/**
 * @description jsonp请求跨域地址
 * @param  { Object } url 请求地址
 * @param  { Object } data 请求参数
 */
export const jsonp = (url, data) => {
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
}

// 匹配省id
export const matchProvinceId = (province: string) => {
    if (province == '北京市') province = '北京'
    if (province == '天津市') province = '天津'
    if (province == '上海市') province = '上海'
    if (province == '重庆市') province = '重庆'
    const item = area.find((item) => item.label == province)
    if (!item) return feedback.msgError('省信息错误')
    return item.value
}

// 匹配市id
export const matchCityId = (province_id: number | string, city: string) => {
    const provinceInfo = area.find((item) => item.value == province_id)
    const cityInfo = provinceInfo?.children.find((item) => item.label == city)
    if (!cityInfo) return feedback.msgError('市信息错误')
    return cityInfo.value
}

// 匹配省市区名称
export const matchAreaName = (
    province_id: number | string,
    city_id: number | string,
    district_id: number | string
) => {
    const provinceInfo = area.find((item) => item.value == province_id)
    const province = provinceInfo?.label
    const cityInfo = provinceInfo?.children.find((item) => item.value == city_id)
    const city = cityInfo?.label
    const districtInfo = cityInfo?.children.find((item) => item.value == district_id)
    const district = districtInfo?.label
    if (!province || !city || !district) return feedback.msgError('获取省市区名称失败')
    return { province: province, city: city, district: district }
}
