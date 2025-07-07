<template>
    <l-painter
        ref="painterRef"
        :isCanvasToTempFilePath="false"
        :css="`width: 640rpx;`"
        custom-style="position: fixed; left: 200%;"
		useCORS
    >
        <l-painter-view
            :css="`
                border-radius: 20rpx;
                overflow: hidden;
                background-color: white;
                padding: 30rpx;
            `"
        >
            <!--  主要视图  -->
            <l-painter-image
                :src="goodsImage"
                css="object-fit: cover; object-position: 50% 50%; width: 590rpx; height: 590rpx; border-radius: 20rpx;"
            />
            <!--  中部内容区域  -->
            <l-painter-view
                :css="`
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                `"
            >
                <l-painter-view
                    :css="`
                        box-sizing: border-box;
                        border-radius: 20rpx;
                        background: #fff;
                        margin-top: 30rpx;
                        display: flex;
                    `"
                >
                    <l-painter-view
                        :css="`
                            box-sizing: border-box;
                        `"
                    >
                        <l-painter-text
                            :text="goodsName"
                            :css="`
                                width: 400rpx;
                                line-clamp: 2;
                                color: #333333;
                                font-size: 32rpx;
                                font-weight: bold;
                            `"
                        />
                    </l-painter-view>

                    <l-painter-view
                        :css="`
                            width: 2rpx;
                            height: 60rpx;
                            margin: 0 20rpx;
                            flex-shrink: 0;
                            background: #EAEAEA;
                            box-sizing: border-box;
                        `"
                    >
                    </l-painter-view>
                    <l-painter-view
                        :css="`
                            box-sizing: border-box;
                        `"
                    >
                        <l-painter-text
                            text="¥"
                            :css="`
                                color: #E86016;
                                font-size: 24rpx;
                                margin-top: 18rpx;
                            `"
                        />
                        <l-painter-text
                            :text="goodsPrice"
                            :css="`
                                color: #E86016;
                                font-size: 40rpx;
                                font-weight: bold;
                            `"
                        />
                    </l-painter-view>
                </l-painter-view>

                <!--  底部信息区域  -->
                <l-painter-view
                    :css="`
                        display: inline-block;
                        margin-top: 40rpx;
                        padding-bottom: 40rpx;
                    `"
                >
                    <!--  扫码区域  -->
                    <l-painter-view
                        :css="`
                            display: inline-block;
                            width: 480rpx;
                         `"
                    >
                        <l-painter-view
                            :css="`
                                display: inline-block;
                                width: 100rpx;
                                text-align: center;
                             `"
                        >
                            <!--  H5二维码  -->
                            <!-- #ifdef H5 || APP-PLUS -->
                            <l-painter-qrcode
                                :css="`
                                    box-sizing: border-box;
                                    width: 100rpx;
                                    height: 100rpx;
                                    padding: 10rpx;
                                    border-radius: 8rpx;
                                    background-color: #FFFFFF;
                                `"
                                :text="link"
                            >
                            </l-painter-qrcode>
                            <!-- #endif -->
                            <!--  小程序二维码  -->
                            <!-- #ifdef MP -->
                            <l-painter-image
                                :src="mnpQrcode"
                                :css="`
                                    box-sizing: border-box;
                                    width: 100rpx;
                                    height: 100rpx;
                                    border-radius: 8rpx;
                                    background-color: #FFFFFF;
                                `"
                            />
                            <!-- #endif -->
                        </l-painter-view>

                        <!--  邀请文案  -->
                        <l-painter-view
                            :css="`
                                display: inline-block;
                                width: 350rpx;
                                margin-top: 16rpx;
                                margin-left: 16rpx;
                             `"
                        >
                            <l-painter-view :css="`display: block;`">
                                <l-painter-text
                                    text="①保存图片到相册"
                                    :css="`
                                        color: #999999;
                                        font-size: 24rpx;
                                        line-height: 30rpx;
                                        font-weight: bold;
                                    `"
                                />
                            </l-painter-view>
                            <l-painter-view :css="`display: block;`">
                                <l-painter-text
                                    text="②微信扫码可识别"
                                    :css="`
                                        color: #999999;
                                        font-size: 24rpx;
                                        line-height: 30rpx;
                                        margin-top: 14rpx;
                                        font-weight: bold;
                                    `"
                                />
                            </l-painter-view>
                        </l-painter-view>
                    </l-painter-view>
                    <!--  店铺logo区域  -->
                    <l-painter-view
						:css="`display: inline-block; width: 100rpx`"
					>
						<l-painter-image
							:src="shopLogo"
							css="width: 100rpx; height: 100rpx; border-radius: 20rpx;display: inline-block;"
						/>
					</l-painter-view>
                </l-painter-view>
            </l-painter-view>
        </l-painter-view>
    </l-painter>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, computed, shallowRef} from 'vue'
import {defineProps} from "vue/dist/vue";
	
const emits = defineEmits<{
    (e: 'success', value: string): void
    (e: 'fail', value: string): void
}>()

// 定义 Props
const props = defineProps({
    show: Boolean,
    link: {
        type: String,
        default: "",
    },
    mnpQrcode: {
        type: String,
        default: "",
    },
    goodsId: {
        type: String,
        default: "",
    },
    goodsPrice: {
        type: String,
        default: "",
    },
    goodsName: {
        type: String,
        default: "",
    },
    goodsImage: {
        type: String,
        default: "",
    },
    shopLogo: {
        type: String,
        default: "",
    },
});


const painterRef = shallowRef()

const handleDrawCanvas = async () => {
    try {
        // 生成图片
        painterRef.value?.canvasToTempFilePathSync({
            fileType: 'png',
            // 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
            // #ifdef MP
            pathType: 'url',
            // #endif
            // #ifdef H5
            pathType: 'base64',
            // #endif
            quality: 1,
            success: ({tempFilePath}: any) => {
                uni.hideLoading()
                emits('success', tempFilePath)
            },
            fail: (error: any) => {
                console.log(error)
                emits('fail', error)
                uni.hideLoading()
                uni.$u.toast('调用海报错误', error)
            }
        })
    } catch (error) {
        console.log('error', error)
        uni.hideLoading()
        uni.$u.toast('调用海报错误', error)
    }
}

defineExpose({handleDrawCanvas})
</script>
