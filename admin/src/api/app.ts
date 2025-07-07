import request from '@/utils/request'

// 配置
export function getConfig() {
    return request.get({ url: '/config/getConfig' })
}

// 工作台主页
export function getWorkbench() {
    return request.get({ url: '/workbench/index' })
}

export function apiFileCateAdd(params: any) {
    return request.post({ url: '/file/addCate', params })
}

export function apiFileCateEdit(params: { id: number; name: string }) {
    return request.post({ url: '/file/editCate', params })
}

// 文件分类删除
export function apiFileCateDelete(params: { id: number }) {
    return request.post({ url: '/file/delCate', params })
}

// 文件分类列表
export function apiFileCateLists(params: any) {
    return request.get({ url: '/file/listCate', params })
}

// 文件列表
export function apiFileList(params: any) {
    return request.get({ url: '/file/lists', params })
}

// 文件删除
export function apiFileDelete(params: { ids: any[] }) {
    return request.post({ url: '/file/delete', params })
}

// 文件移动
export function apiFileMove(params: { ids: any[]; cid: number }) {
    return request.post({ url: '/file/move', params })
}

// 文件重命名
export function apiFileRename(params: { id: number; name: string }) {
    return request.post({ url: '/file/rename', params })
}

// 配置
export function apiConfig() {
    return request.get({ url: '/config/getConfig' })
}
//检测新版本
export function apiCheckVersion(params: any) {
    return request.get({ url: '/config/checkVersion', params })
}
//正版检测
export function apiCheckLegal(params: any) {
    return request.get({ url: '/config/checkLegal', params })
}

// 获取腾讯地图key
export function getTencentMapKey(params: { is_delete: boolean }) {
    return request.get({ url: '/config/getTencentMapKey', params })
}

// 校验腾讯地图返回结果
export function checkTencentMapResult(params: any) {
    return request.get({ url: '/config/checkTencentMapResult', params })
}
