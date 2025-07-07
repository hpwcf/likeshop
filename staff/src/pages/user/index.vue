<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="user" :style="pageStyle">
		<!-- #ifndef H5 -->
		<u-sticky h5-nav-height="0" bg-color="transparent">
			<u-navbar
				:is-back="false"
				:is-fixed="true"
				:title="decoratePage.meta.title"
				:custom-title="decoratePage.meta.title_type == 2"
				:border-bottom="false"
				:title-bold="true"
				:background="{ background: `rgba(256,256, 256, 0)` }"
				:title-color="decoratePage.meta.text_color == 1 ? '#fff' : '#000'"
			>
				<template #title>
					<image
						class="!h-[54rpx]"
						:src="decoratePage.meta.title_img"
						mode="widthFix"
					></image>
				</template>
			</u-navbar>
		</u-sticky>
		<!-- #endif -->
		<view class="user--info">
			<view class="u-flex">
				<!-- 用户头像 -->
				<u-image
					@click="goPage('/pages/user_set/index')"
					:src="userInfo?.avatar || config.default_avatar"
					width="100"
					height="100"
					border-radius="50"
				>
				</u-image>
				<!-- 用户名字 -->
				<view
					class="ml-[20rpx] text-[#ffffff]"
					@click="goPage('/pages/user_set/index')"
				>
					<view>{{ userStore.isLogin ? userInfo?.name || '未入驻' : '请登录' }}</view>
					<view class="text-[22rpx] text-[#ffffffbd]" v-if="userInfo?.sn && userStore.isLogin">{{ decoratePage.data.find((item: any) => item.name === 'user-info')?.content.user_info === 1 ? '工号：'+userInfo?.sn : '手机号：'+userInfo?.mobile}}</view>
				</view>
			</view>
		</view>

		<view class="main">
			<view class="card u-flex justify-between" v-if="userInfo?.is_staff && (showItem.indexOf('保证金') != -1 || showItem.indexOf('佣金') != -1 || showItem.indexOf('服务项目') != -1)">
				<view v-if="showItem.indexOf('保证金') != -1" class="text-center p-[20rpx]" @click="goPage('/bundle/pages/deposit/index')">
					<view class="text-2xl font-bold text-[#dd6161]">{{ userInfo?.staff_deposit || 0 }}</view>
					<view class="font-bold">保证金</view>
				</view>
				<view v-if="showItem.indexOf('佣金') != -1" class="text-center p-[20rpx]" @click="goPage('/bundle/pages/balance/index')">
					<view class="text-2xl font-bold text-[#dd6161]">{{ userInfo?.staff_earnings || 0 }}</view>
					<view class="font-bold">佣金</view>
				</view>
				<view v-if="showItem.indexOf('服务项目') != -1" class="text-center p-[20rpx]" @click="goPage('/bundle/pages/user_info/index')">
					<view class="text-2xl font-bold text-[#dd6161]">{{ userInfo?.goods_id?.length || 0 }}</view>
					<view class="font-bold">服务项目</view>
				</view>
			</view>
			<view class="mt-[30rpx]">
				<view v-for="(item, index) in decoratePage.data" :key="index">
					<template v-if="item.name == 'user-service'">
						<userService :content="item.content" :styles="item.styles" />
					</template>
				</view>
			</view>
		</view>
    </view>
    <!-- 底部导航栏 -->
    <Tabbar />
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { onLoad, onShow } from '@dcloudio/uni-app'
import Tabbar from '@/components/tabbar/index.vue'
import userService from '@/components/widgets/my-service/my-service.vue'
import { getDecoratePage } from '@/api/decorate'

/** Data Start **/
const appStore = useAppStore()
const {getImageUrl} = useAppStore()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const config = computed(() => appStore.config)
const decoratePage = reactive<{
    data: any[]
    meta: any[]
}>({
    data: [],
    meta: []
})
const showItem = ref<any>([])


const initUserInfoFunc = async (): Promise<void> => {
    const pageRes = await getDecoratePage({
		id: 6
	})
	decoratePage.data = pageRes.data
	decoratePage.meta = pageRes.meta[0]?.content
	showItem.value = pageRes.data.find((item: any) => item.name === 'user-info')?.content.content
    uni.setNavigationBarTitle({
        title: decoratePage.meta.title
    })
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

// 根页面样式
const pageStyle = computed(() => {
    const {bg_type, bg_color, bg_image} = decoratePage.meta ?? {}
    return bg_type == 1 ?
        {'background-color': bg_color} :
        {'background-image': `url(${getImageUrl(bg_image)})`}
})

onLoad(() => {
    initUserInfoFunc()
})
</script>

<style lang="scss">
.user {
	background-repeat: no-repeat;
	background-size: 100% auto;

    .card {
        border-radius: 20rpx;
        background-color: #ffffff;
		padding: 20rpx;
    }

    // 用户信息
    &--info {
		// background: linear-gradient(#2189ff, #75ccfb05);
        padding: 50rpx 20rpx 24rpx;
		height: 500rpx;

        .user-name {
            color: #ffffff;
            font-size: 36rpx;
            font-weight: 500;
        }
    }
	
	.main {
		margin-top: -320rpx;
		padding: 0 20rpx;
		
		.other {
			margin-top: 30rpx;
			.item {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				width: 150rpx;
				margin: 0 20rpx 20rpx 0;
			}
			.item:nth-child(4n) {
				margin-right: 0;
			}
		}
	}

    // 订单信息
    .order-info {
        padding: 30rpx 24rpx;

        &--header {
            padding-bottom: 30rpx;
            border-bottom: 1px solid #e5e5e5;

            .title {
                color: #222222;
                font-size: 32rpx;
                font-weight: 500;
            }
        }

        &--main {
            padding-top: 30rpx;

            .order-menu-item {
                flex: auto;
                text-align: center;
                position: relative;

                image {
                    width: 60rpx;
                    height: 60rpx;
                }

                &--text {
                    color: #222222;
                    font-size: 26rpx;
                }
            }
        }
    }

    // 服务导航
    .service-nav {
        padding: 0 24rpx;

        &--item:last-child {
            border-bottom: 0;
        }

        &--item {
            padding: 26rpx 0;
            position: relative;
            border-bottom: 1px solid #e5e5e5;

            &--left {
                text,
                .name {
                    margin-left: 20rpx;
                    color: #222222;
                    font-size: 30rpx;
                }

                .name {
                    width: 190rpx;
                    position: relative;
                }

                image {
                    width: 48rpx;
                    height: 48rpx;
                }
            }
        }
    }

    // 徽章
    .badge {
        width: 30rpx;
        height: 30rpx;
        text-align: center;
        line-height: 30rpx;
        top: -10rpx;
        right: 30rpx;
        color: #ffffff !important;
        border-radius: 50%;
        position: absolute;
        font-size: 22rpx !important;
        background-color: #f36161;
    }
}
</style>
