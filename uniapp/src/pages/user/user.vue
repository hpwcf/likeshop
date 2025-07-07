<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="user">
		<view :style="pageStyle" style="background-repeat: no-repeat;background-size: 100% auto;">
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
			<view class="h-[300rpx]">
				<view class="flex justify-between user--info items-center">
					<view class="flex flex-1 items-center ml-[20rpx]" @click="goPage('/bundle/pages/user_profile/index')">
						<!-- 用户头像 -->
						<u-avatar :src="userInfo.avatar" shape="square" :size="120" img-mode="scaleToFill"></u-avatar>
						<!-- 用户名字 -->
						<view class="ml-[20rpx] flex-1">
							<view
							    class="user-name mb-[10rpx]"
							>
							    {{ userInfo?.nickname || '未登录' }}
							</view>
							<view class="text-[#ffffff]" v-if="userInfo?.mobile">账号：{{ decoratePage.data.find((item: any) => item.name === 'user-info')?.content.user_info === 1 ? userInfo?.account : userInfo?.mobile}}</view>
						</view>
					</view>
				    
				    <!-- 设置 -->
				    <u-icon
				        name="setting"
				        color="#fff"
				        size="44"
				        @click="goPage('/pages/user_set/user_set')"
				    ></u-icon>
				</view>
			</view>
		</view>
        
		<view class="mt-[-100rpx]">
			<!-- <view class="flex justify-around bg-white user--data">
				<view class="comment-card flex-1 h-[140rpx] mr-[20rpx]">
					<view class="text-[#5cc09e] text-1xl">我的评价</view>
					<view>
						<text class="text-[#46a283] text-1xl font-bold">{{ userInfo?.comment_count || 0 }}</text>
						<text class="text-muted text-[24rpx] ml-[6rpx]">条</text>
					</view>
				</view>
				<view class="wallet-card flex-1 h-[140rpx]">
					<view class="text-[#ecaa58] text-1xl">我的钱包</view>
					<view class="text-[#c68a40] text-1xl font-bold">{{ userInfo?.user_money || 0.00 }}</view>
				</view>
			</view> -->
			
			<view v-for="(item, index) in decoratePage.data" :key="index">
			    <template v-if="item.name == 'user-order'">
			        <userOrder :content="item.content" :user-info="userInfo" :styles="item.styles" />
			    </template>
			    <template v-if="item.name == 'user-service'">
			        <userService :content="item.content" :styles="item.styles" />
			    </template>
			    <!-- <template v-if="item.name == 'user-banner'">
			        <w-user-banner :content="item.content" :styles="item.styles" />
			    </template> -->
			</view>
		</view>
    </view>
    <!-- 底部导航栏 -->
    <Tabbar />
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { onLoad, onShow } from '@dcloudio/uni-app'
import Tabbar from '@/components/tabbar/index.vue'
import userService from '@/components/widgets/user-service/user-service.vue'
import userOrder from '@/components/widgets/user-order/user-order.vue'
import { getDecoratePage } from '@/api/decorate'
import { useAppStore } from '@/stores/app'

/** Data Start **/
const {getImageUrl} = useAppStore()
const userStore = useUserStore()
const decoratePage = reactive<{
    data: any[]
    meta: any
}>({
    data: [],
    meta: []
})

const userInfo = computed(() => userStore.userInfo)

const initUserInfoFunc = async (): Promise<void> => {
	const pageRes = await getDecoratePage({
	    id: 2
	})
	decoratePage.data = pageRes.data
	decoratePage.meta = pageRes.meta[0]?.content
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
    const {bg_type, bg_color, bg_image} = decoratePage.meta || {}
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
    // padding: 0 20rpx;
    padding-bottom: 100rpx;
    // background: linear-gradient(to bottom, #f36161 280rpx, transparent 0);
	height: 100vh;
	background-repeat: no-repeat;
	background-size: 100% auto;

    .card {
        border-radius: 14rpx;
        background-color: #ffffff;
    }

    // 用户信息
    &--info {
        padding: 50rpx 24rpx 30rpx;

        .user-name {
            color: #ffffff;
            font-size: 36rpx;
            font-weight: 500;
        }
    }

    // 用户数据
    &--data {
        margin: 0 24rpx;
		padding: 12rpx;
		border-radius: 14rpx;

        .comment-card {
			padding: 20rpx;
            background-image: url('../../static/images/user_comment_bg.png');
			background-color: #9dd9c575;
            background-size: 100% 100%;
            background-repeat: no-repeat;
			border-radius: 14rpx;
        }
        .wallet-card {
			padding: 20rpx;
            background-image: url('../../static/images/user_wallet_bg.png');
			background-color: #f4cd9c7d;
            background-size: 100% 100%;
            background-repeat: no-repeat;
			border-radius: 14rpx;
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
        background-color: var(--color-primary, #FFC244);
    }
}
</style>
