<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <!-- Main Start -->
    <view class="mt-[20rpx] p-[30rpx]">
        <view class="u-flex justify-between bg-[#edf1f3] py-[30rpx] px-[20rpx]" style="border-radius: 14rpx;">
            <text class="normal font-medium text-base mr-[20rpx]">评价</text>
            <u-rate
                :count="5"
                v-model="formData.service_comment"
                :min-count="1"
                inactive-icon="star-fill"
                size="34"
            ></u-rate>
        </view>

        <view class="mt-[30rpx] bg-[#edf1f3] py-[30rpx] px-[20rpx]" style="border-radius: 20rpx;">
            <u-input
                v-model="formData.comment"
                type="textarea"
                placeholder="请输入您对本次服务的评价"
                height="200"
				:maxlength="200"
            />
			<view class="mt-[30rpx]">
			    <uploader
			        v-model="formData.image"
					:mutiple="true"
			        :maxUpload="4"
			        :deletable="true"
			    />
			</view>
        </view>
    </view>

    <view class="footer">
        <button
            class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
            @click="onSubmit"
        >
            提交
        </button>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiEvaluateAdd } from '@/api/user'
import uploader from '@/components/uploader/index.vue'

interface FormDataObj {
    order_goods_id: number | string
    service_comment: number
    comment: string
    image: Array<string | null>
}

const formData = ref<FormDataObj>({
    order_goods_id: 0,
    service_comment: 5,
    comment: '',
    image: []
})

const onSubmit = async (): Promise<void> => {
    try {
        await apiEvaluateAdd({ ...formData.value })
		uni.showToast({
			title: '操作成功！',
			icon: 'none',
			duration: 1500,
			complete: function() {
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			}
		})
    } catch (error) {
        console.log('提交评价: ', error)
    }
}

onLoad((options) => {
    formData.value.order_goods_id = options.order_goods_id || 0
})
</script>

<style lang="scss" >
	page {
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
.footer {
    left: 0;
    bottom: 30rpx;
    width: 100%;
    position: fixed;
    padding: 0 30rpx;
}
</style>
