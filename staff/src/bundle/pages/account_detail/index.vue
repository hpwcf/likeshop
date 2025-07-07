<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view>
        <view class="list">
            <z-paging
                auto-show-back-to-top
                ref="paging"
                v-model="dataList"
                @query="queryList"
                :fixed="false"
                height="100%"
            >
                <view class="card u-flex justify-between" v-for="(item, index) in dataList" :key="index">
                    <view>
                        <view class="font-bold text-1xl">{{ item.change_type_desc }}</view>
                        <view class="mt-[16rpx] text-[24rpx] text-muted">{{ item.create_time }}</view>
                    </view>
                                    
                    <view class="font-bold text-1xl">
                        <view class="text-[#2189ff]" v-if="item.action == 2">{{ item.change_amount }}</view>
                        <view class="text-[#ff2c3c]" v-if="item.action == 1">{{ item.change_amount }}</view>
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed } from 'vue'
import { apiAccountLogLists } from '@/api/wallet'
import { AccountLogChangeObject } from '@/enums/appEnums'
import { onLoad } from '@dcloudio/uni-app'

const dataList = ref<Array<any>>([])
const paging = shallowRef<any>(null)
const changeObject = ref(AccountLogChangeObject.DEPOSIT)

//获取佣金明细
const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiAccountLogLists({
            change_object: changeObject.value,
            page_no,
            page_size
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

onLoad(async (options:any) => {
    changeObject.value = options.change_object as number
})

</script>

<style lang="scss" scoped>
.list {
	padding: 30rpx 24rpx;
	height: 100vh;
	
	.card {
	    background-color: #ffffff;
	    padding: 30rpx 24rpx;
	    border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
}
</style>
