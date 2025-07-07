export enum LinkTypeEnum {
    'SHOP_PAGES' = 'shop',
    'CUSTOM_LINK' = 'custom',
    'SERVICE_LIST' = 'goods_list',
    'SERVICE_CLASSIFY' = 'goods_classify',
    'STAFF_PAGES' = 'staff'
}

export interface Link {
    path: string
    name?: string
    type: string
    query?: Record<string, any>
}
