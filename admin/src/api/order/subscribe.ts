import request from "@/utils/request";

// 获取预约天数
export function apiGetOrderTime() {
  return request.get({ url: "/order.order_time/getTime" });
}

// 设置预约天数
export function apiSetOrderTime(params: any) {
  return request.post({ url: "/order.order_time/setTime", params });
}

// 获取时间段列表
export function apiOrderTimeLists(params: any) {
  return request.get({ url: "/order.order_time/lists", params });
}

// 获取时间段详情
export function apiOrderTimeDetail(params: any) {
  return request.get({ url: "/order.order_time/detail", params });
}

// 添加时间段
export function apiOrderTimeAdd(params: any) {
  return request.post({ url: "/order.order_time/add", params });
}

// 编辑时间段
export function apiOrderTimeEdit(params: any) {
  return request.post({ url: "/order.order_time/edit", params });
}

// 删除时间段
export function apiOrderTimeDel(params: any) {
  return request.post({ url: "/order.order_time/del", params });
}

// 修改排序
export function apiTimeSort(params: any) {
  return request.post({ url: "/order.order_time/sort", params });
}
