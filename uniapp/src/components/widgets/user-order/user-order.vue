<template>
    <div
        class="user-order bg-white mx-[20rpx] mt-[20rpx] rounded-lg p-[30rpx]"
        v-if="content?.enabled"
    >
        <div
            v-if="content?.title"
            class="title flex justify-between font-medium text-lg"
        >
            <div>{{ content?.title }}</div>
            <div
                class="flex items-center text-muted font-normal text-xs"
                @click.stop="navigateToOrder"
            >
                <span class="mr-1">查看全部订单</span>
                <u-icon name="arrow-right" size="22"/>
            </div>
        </div>
        <div class="order-nav grid grid-cols-4 gap-x-6 relative">
            <div
                class="nav-item relative flex flex-col justify-center items-center"
                v-if="content?.pay_show"
                @click.stop="navigateToOrder(1)"
            >
                <u-badge
                    :offset="[-10, 10]"
                    type="error"
                    :count="content?.pay_order_num || 0"
                >
                </u-badge>
                <u-image
                    width="68"
                    height="68"
                    :src="getImageUrl(content?.pay_icon)"
                ></u-image>
                <div class="text-xs mt-1">{{ content?.pay_name }}</div>
            </div>
            <div
                class="nav-item relative flex flex-col justify-center items-center"
                v-if="content?.subscribe_show"
                @click.stop="navigateToOrder(2)"
            >
                <u-badge
                    :offset="[-10, 10]"
                    type="error"
                    :count="content?.subscribe_order_num || 0"
                >
                </u-badge>
                <u-image
                    width="68"
                    height="68"
                    :src="getImageUrl(content?.subscribe_icon)"
                ></u-image>
                <div class="text-xs mt-1">{{ content?.subscribe_name }}</div>
            </div>
            <div
                class="nav-item relative flex flex-col justify-center items-center"
                v-if="content?.service_show"
                @click.stop="navigateToOrder(3)"
            >
                <u-badge
                    :offset="[-10, 10]"
                    type="error"
                    :count="content?.service_order_num || 0"
                >
                </u-badge>
                <u-image
                    width="68"
                    height="68"
                    :src="getImageUrl(content?.service_icon)"
                ></u-image>
                <div class="text-xs mt-1">{{ content?.service_name }}</div>
            </div>
            <div
                class="nav-item relative flex flex-col justify-center items-center"
                v-if="content?.completed_show"
                @click.stop="navigateToOrder(4)"
            >
                <!-- <u-badge
                    :offset="[-10, 10]"
                    type="error"
                    :count="userInfo?.complete_order_num || 0"
                >
                </u-badge> -->
                <u-image
                    width="68"
                    height="68"
                    :src="getImageUrl(content?.completed_icon)"
                ></u-image>
                <div class="text-xs mt-1">{{ content?.completed_name }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useRouter} from "uniapp-router-next";
import { useAppStore } from '@/stores/app'

const router = useRouter()
const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    },
    userInfo: {
        type: Object,
        default: () => ({})
    }
})
const { getImageUrl } = useAppStore()
const navigateToOrder = (type: string | number = '') => {
    // router.switchTab({
    //     path: '/pages/order/index',
    //     query: {
    //         type: value
    //     }
    // })
	uni.reLaunch({
		url: '/pages/order/index?type='+type
	})
}
</script>

<style lang="scss" scoped>
.user-order {
    .order-title {
        padding: 24rpx 30rpx;
    }

    .order-nav {
        padding: 26rpx 0 0 0;

        .nav-item {
            width: 100%;
            height: 100%;

            .nav-icon {
                width: 52rpx;
                height: 52rpx;
                margin-bottom: 12rpx;
            }
        }
    }
}
</style>


