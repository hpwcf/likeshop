<template>
    <z-paging ref="paging" v-model="accountLogLists" @query="queryList" :fixed="false" height="100%">
        <!-- 余额明细列表 -->
        <view class="balance-details">
			<view v-for="(item, index) in accountLogLists" :key="index">
				<view class="balance-details-item flex">
					<view
						class="flex-none flex items-center justify-center bg-primary-light-9 rounded-full"
						style="width: 84rpx; height: 84rpx;"
					>
						<u-icon name="coupon-fill" :color="$theme.primaryColor" size="40"></u-icon>
					</view>
					<view class="flex-1 flex items-center justify-between ml-2">
						<view>
							<view class="flex-1 balance-details-item-text">
								{{ item.change_type_desc }}
							</view>
							<view class="balance-details-item-time">{{ item.create_time }}</view>
						</view>
						<view v-if="item.action == 2" class="balance-details-item-amount-add text-primary">
							+{{ item.change_amount }}
						</view>
						<view v-else class="balance-details-item-amount-reduce text-primary">
							-{{ item.change_amount }}
						</view>
					</view>
				</view>
			</view>
		</view>
    </z-paging>
</template>

<script lang="ts" setup>
import { reactive, ref, shallowRef } from 'vue'
import { apiAccountLogLists } from '@/api/wallet'
import { onLoad } from '@dcloudio/uni-app'

const props = withDefaults(
    defineProps<{
        status: string | number
        i: number
        index: number
    }>(),
    {
        status: ''
    }
)

const accountLogLists = ref<any>([])
const changeObject = ref()
// 下拉组件的Ref
const paging = shallowRef()

const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiAccountLogLists({
            page_no,
            page_size,
            action: props.status,
            change_object: changeObject.value
        })
        paging.value.complete(lists)
    } catch (e) {
        paging.value.complete(false)
    }
}

onLoad((options: any) => {
    changeObject.value = options?.changeObject || 1

    if (changeObject.value == 2) {
        uni.setNavigationBarTitle({
            title: '佣金明细'
        })
    }
})
</script>

<style lang="scss" scoped>
.balance-details {
    margin: 30rpx;

    .balance-details-item {
        background-color: #fff;
        margin-bottom: 24rpx;
        padding: 36rpx 20rpx;
        border-radius: 20rpx;

        .balance-details-item-text {
            font-size: 30rpx;
            font-weight: 400;
        }

        .balance-details-item-amount-add {
            font-size: 40rpx;
            font-weight: 900;
        }

        .balance-details-item-amount-reduce {
            font-size: 40rpx;
            font-weight: 900;
        }

        .balance-details-item-time {
            font-size: 24rpx;
            font-weight: 400;
            color: #999;
            margin-top: 20rpx;
        }
    }
}

.empty {
    padding-top: 300rpx;
}
</style>
