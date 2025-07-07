<template>
    <view>
		<u-tabs
		    :list="tabList"
		    bg-color="#ffffff"
		    :active-color="$theme.primaryColor"
		    inactive-color="#000000"
		    :is-scroll="false"
		    v-model="current"
		    @change="changeStatus"
		    height="80"
		></u-tabs>
		
        <view class="list">
            <z-paging
                auto-show-back-to-top
                ref="paging"
                v-model="dataList"
                @query="queryList"
                :fixed="false"
                height="100%"
            >
                <view class="card" v-for="(item, index) in dataList" :key="index" @click="goPage('/bundle/pages/withdrawal_details/index?id='+item.id)">
                    <view class="u-flex justify-between font-bold text-2xl">
                        <view>提现至{{ item.type_desc }}</view>
                        <view>{{ item.money }}</view>
                    </view>
                                    
                    <view class="u-flex justify-between mt-[16rpx] text-[24rpx] text-muted">
                        <view> {{ item.create_time }} </view>
                                    
                        <template v-if="item.status == 1">
                            <view class="text-[#666]">{{ item.status_desc }}</view>
                        </template>
                                    
                        <template v-if="item.status == 2">
                            <view class="text-[#2189ff]">{{ item.status_desc }}</view>
                        </template>
                                    
                        <template v-if="item.status == 3">
                            <view class="text-[#0cc267]">{{ item.status_desc }}</view>
                        </template>
                                    
                        <template v-if="item.status == 4">
                            <view class="text-[#ff2c3c]">{{ item.status_desc }}</view>
                        </template>
                    </view>
                                    
                    <template v-if="item.verify_remarks != null">
                        <template v-if="item.verify_remarks != ''">
                            <view class="text-[24rpx] text-[#ff2c3c] mt-[10rpx]">审核提示：{{ item.verify_remarks }}</view>
                        </template>
                    </template>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { apiWithdrawLists } from '@/api/wallet'
import { WithdrawSourceType } from '@/enums/appEnums'
import { onLoad } from '@dcloudio/uni-app'

const tabList = ref<any>([
    {
        name: '全部',
        type: 0
    },
    {
        name: '待审核',
        type: 1
    },
    {
        name: '已审核',
        type: 2
    },
    {
        name: '已转账',
        type: 3
    },
    {
        name: '已拒绝',
        type: 4
    }
])
const current = ref<number>(0)
const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const sourceType = ref<number>(WithdrawSourceType.DEPOSIT)

const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiWithdrawLists({
			source_type: sourceType.value,
			status: current.value,
            page_no,
            page_size
        })
		console.log('列表',lists)
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

//切换状态
const changeStatus = (e) => {
	current.value = e
	paging.value.reload()
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

onLoad(async (options:any) => {
    sourceType.value = options.source_type as number
})
</script>

<style lang="scss" scoped>
.list {
	height: calc(100vh - 100rpx);
	padding: 30rpx 24rpx;
	
	.card {
	    background-color: #ffffff;
	    padding: 30rpx 24rpx;
	    border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
}
</style>
