<template>
    <view class="share-popup">
        <u-mask
            :mask-click-able="true"
            :show="showPopup"
            :zoom="false"
            :safe-area-inset-bottom="true"
            @click="showPopup = false"
        >
            <view class="flex flex-col min-h-0 h-full">
                <view
                    class="flex items-center justify-center flex-1"
                    style="padding-top: 50px;"
                >
                    <!-- #ifndef H5 -->
                    <image style="width: 640rpx" mode="widthFix" :src="poster"></image>
                    <!-- #endif -->
                    <!-- #ifdef H5 -->
                    <img style="width: 640rpx" :src="poster"/>
                    <!-- #endif -->
                </view>
                <view class="share-tab safe-area-inset-bottom bg-white rounded-t-[20rpx]">
                    <view class="flex-col col--center" @tap.stop="savePoster">
                        <image
                            mode="widthFix"
                            class="share-icon"
                            src="/static/images/icon_generate_poster.png"
                        ></image>
                        <view class="m-t-10">存到手机</view>
                    </view>
                    <!-- #ifdef MP-WEIXIN-->
                    <button
                        open-type="share"
                        class="flex-col col--center"
                        hover-class="none"
                    >
                        <image
                            class="share-icon"
                            src="/static/images/icon_wechat.png"
                        ></image>
                        <view class="m-t-10">微信好友</view>
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef H5 || APP-PLUS -->
                    <view oclass="flex-col col--center" @tap.stop="shareWx">
                        <image
                            class="share-icon"
                            src="/static/images/icon_wechat.png"
                        ></image>
                        <view class="m-t-10">微信好友</view>
                    </view>
                    <!-- #endif -->
                </view>
            </view>
        </u-mask>

        <!-- #ifdef H5 -->
        <u-popup class="share-tips" v-model="showTips" mode="top">
            <view style="overflow: hidden;background-color: #82848a;">
                <image src="/static/images/share_arrow.png" class="share-arrow"/>
                <view class="text-white" style="text-align: center; margin-top: 280rpx">
                    <view class="bold lg">立即分享给好友吧</view>
                    <view class="sm m-t-10">点击屏幕右上角将本页面分享给好友</view>
                </view>
            </view>
        </u-popup>
        <!-- #endif -->

        <poster-goods
            ref="posterRef"
            :goodsId="goodsId"
            :goodsPrice="goodsPrice"
            :goodsName="goodsName"
            :goodsImage="handleGoodsImage"
            :shopLogo="handleShopLogo"
            :mnpQrcode="mnpQrcode"
            :link="getLink"
            @success="handleSuccess"
            @fail="handleFail"
        />
    </view>
</template>

<script lang="ts" setup>
import {ref, computed, defineProps, defineEmits, watch} from 'vue';
import {getMiniQrCode,getGoodsImagesBase64} from "@/api/app";
import config from "@/config";
import PosterGoods from "./poster.vue";
import {useAppStore} from '@/stores/app'

const storeConfig = computed(() => useAppStore().config)
// 定义 Props
const props = defineProps({
    show: Boolean,
    shareId: {
        type: [String, Number],
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
});

// 定义 Emits
const emit = defineEmits(["update:show"]);

// 定义状态变量
const poster = ref<string>("");
const posterRef = ref();
const showTips = ref<boolean>(false);
const mnpQrcode = ref<string>("");
const options = ref<object>({});
const handleGoodsImage = ref<string>('')
const handleShopLogo = ref<string>('')

// 计算属性
const getLink = computed(() => `${config.baseUrl}/mobile/pages/goods/index?id=${props.goodsId}`);

const showPopup = computed({
    get: () => props.show,
    set: (val: boolean) => {
        emit("update:show", val);
    },
});


const getPoster = async () => {
	// #ifdef MP-WEIXIN
    await Promise.all([
        getMnpQrcode()
    ]);
	// #endif
	
	handleGoodsImage.value = props.goodsImage
	handleShopLogo.value = storeConfig.value.shop_logo
	
	// #ifdef H5
	await getImagesBase64()
	// #endif
	
    setTimeout(() => {
        drawCanvas();
    }, 1000);
};

const getMnpQrcode = () => {
    return new Promise((resolve, reject) => {
        getMiniQrCode({
            id: props.goodsId,
            page: 'pages/goods/index',
        })
		.then((res) => {
            mnpQrcode.value = res.qr_code;
			resolve(res);
		})
		.catch(() => reject());
    });
};

const getImagesBase64 = () => {
    return new Promise((resolve, reject) => {
        getGoodsImagesBase64({
            id: props.goodsId
        })
		.then((res) => {
			handleGoodsImage.value = res.goods_image;
			handleShopLogo.value = res.shop_logo;
			resolve(res);
		})
		.catch(() => {
			handleGoodsImage.value = props.goodsImage
			handleShopLogo.value = storeConfig.value.shop_logo
			reject()
		});
    });
};

const drawCanvas = () => {
    posterRef.value.handleDrawCanvas();
};

const handleSuccess = (val: string) => {
    poster.value = val;
    showPopup.value = false;
};

const handleFail = () => {
    uni.$u.toast('生成失败')
};

const shareWx = () => {
    // #ifdef H5
    showTips.value = true;
    showPopup.value = false;
    // #endif
    // #ifdef APP-PLUS
    uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: getLink.value,
        title: props.goodsName,
        summary: "",
        imageUrl: props.goodsImage,
        success: () => {
            console.log("分享成功");
        },
        fail: (err) => {
            uni.showToast({title: err.errMsg});
        },
    });
    // #endif
};

const savePoster = async () => {
    // #ifndef H5
    uni.saveImageToPhotosAlbum({
        filePath: poster.value,
        success: () => {
            uni.showToast({title: "保存成功", icon: "success"});
        },
        fail: (err) => {
            uni.$u.toast('保存失败')
            console.log(err);
        },
    });
    // #endif
    // #ifdef H5
    uni.$u.toast('请长按图片保存')
    // #endif
};

watch(() => props.goodsImage, () => {
    getPoster()
},{deep: true})

</script>

<style lang="scss">
.share-popup {
    .share-tab {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 68rpx 50px;

        > view,
        button {
            width: 160rpx;
            height: 160rpx;
            margin: 0;
            padding: 0;
            text-align: center;
            line-height: 1.3;
            font-size: 28rpx;
            font-weight: 500;
            color: #666666;
            background-color: transparent;
        }

        .share-icon {
            width: 100rpx;
            height: 100rpx;
        }
    }

    .cancel {
        height: 98rpx;
    }
}

.share-tips .share-arrow {
    width: 140rpx;
    height: 250rpx;
    float: right;
    margin: 15rpx 31rpx 0 0;
}
</style>
