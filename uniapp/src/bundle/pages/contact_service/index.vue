<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <uni-transition
        mode-class="zoom-in"
        needLayout="true"
        :show="kefuInfo.qr_code.length"
        :duration="500"
    >
        <view class="box">
            <view class="flex justify-center">
                <u-image :src="getImageUrl(kefuInfo.qr_code)" width="300" height="300"></u-image>
            </view>
            <view class="text-center mt-[20rpx] normal text-base">
                {{ kefuInfo.name }}
            </view>
            <view class="text-center mt-[20rpx] text-muted text-sm" v-if="kefuInfo.business_time">
                服务时间：{{ kefuInfo.business_time }}
            </view>
            <view class="text-center mt-[20rpx] text-muted text-sm" v-if="kefuInfo.phone">
                服务电话：{{ kefuInfo.phone }}
            </view>
            <view class="mt-[40rpx]">
                <!-- #ifdef H5 -->
                <button
                    class="bg-primary text-lg text-white rounded-full"
                    @click="toast('长按二维码保存')"
                >
                    长按二维码保存
                </button>
                <!-- #endif -->
                <!-- #ifndef H5 -->
                <button
                    class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx] rounded-full"
                    @click="saveImageQr"
                >
                    保存二维码
                </button>
                <!-- #endif -->
            </view>
        </view>
    </uni-transition>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import { toast } from '@/utils/util'
import { useAppStore } from '@/stores/app'

/** Interface Start **/

/** Interface End **/

/** Data Start **/
const { getImageUrl } = useAppStore()
const kefuInfo = computed(() => useAppStore().kefuInfo)

/** Data End **/

/** Methods Start **/

// 保存二维码
const saveImageQr = async (): Promise<void> => {
    try {
        const res = await uni.getImageInfo({ src: kefuInfo.value.qr_code })
        try {
            await uni.saveImageToPhotosAlbum({ filePath: res.path })
            toast('保存成功')
        } catch (e) {
            const modelRes = await uni.showModal({
                title: '图片保存失败',
                content: '请确认是否已开启授权'
            })
            if (modelRes.confirm) uni.openSetting()
        }
    } catch (err) {
        toast('请在小程序后台配置downloadFile')
    }
}
/** Methods End **/

/** Life Cycle Start **/

/** Life Cycle End **/
</script>

<style lang="scss">
page {
    padding: 24rpx;
    box-sizing: border-box;
    background-color: #ffffff;
}

.box {
    padding: 64rpx 120rpx;
    background: linear-gradient(
        to bottom,
        rgba(var(--color-primary, #FFC244), 0.1),
        rgba(var(--color-primary, #FFC244), 0) 164rpx,
        transparent 0
    );
}
</style>
