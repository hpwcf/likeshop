<template>
    <div class="shop-pages">
        <div class="flex flex-wrap link-list">
            <div
                class="link-item border border-br px-5 py-[5px] rounded-[3px] cursor-pointer mr-[10px] mb-[10px]"
                v-for="(item, index) in linkList"
                :class="{
                    'border-primary text-primary':
                        modelValue.path == item.path && modelValue.name == item.name
                }"
                :key="index"
                @click="handleSelect(item)"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { LinkTypeEnum, type Link } from '.'

defineProps({
    modelValue: {
        type: Object as PropType<Link>,
        default: () => ({})
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: Link): void
}>()

const linkList = ref([
    {
        path: '/pages/index/index',
        name: '商城首页',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/category/index',
        name: '分类页面',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/user/user',
        name: '个人中心',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/collection_list/index',
        name: '我的收藏',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/order/index',
        name: '我的订单',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/contact_service/index',
        name: '联系客服',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/user_set/user_set',
        name: '个人设置',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/as_us/as_us',
        name: '关于我们',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/user_profile/index',
        name: '个人资料',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/user_address/index',
        name: '地址管理',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/service_explan/index',
        name: '政策协议',
        query: {
            type: 'service'
        },
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/search/index',
        name: '搜索页面',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/evaluate_list/index',
        name: '评价管理',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/bundle/pages/user_wallet/user_wallet',
        name: '我的钱包',
        type: LinkTypeEnum.SHOP_PAGES
    }
])

const handleSelect = (value: Link) => {
    // console.log(value)
    emit('update:modelValue', value)
}
</script>
