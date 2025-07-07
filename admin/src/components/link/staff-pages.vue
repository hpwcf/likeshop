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
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/pages/order/index',
        name: '我的订单',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/pages/user/index',
        name: '个人中心',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/pages/about_us/index',
        name: '关于我们',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/pages/user_set/index',
        name: '个人设置',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/pages/agreement/agreement',
        name: '政策协议',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/bundle/pages/user_info/index',
        name: '个人资料',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/bundle/pages/contact_service/index',
        name: '联系客服',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/bundle/pages/evaluate/index',
        name: '我的评价',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/bundle/pages/withdraw_bind/index',
        name: '提现绑定',
        type: LinkTypeEnum.STAFF_PAGES
    },
    {
        path: '/bundle/pages/authentication/index',
        name: '实名信息',
        type: LinkTypeEnum.STAFF_PAGES
    }
])

const handleSelect = (value: Link) => {
    // console.log(value)
    emit('update:modelValue', value)
}
</script>
