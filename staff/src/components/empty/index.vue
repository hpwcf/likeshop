<template>
	<view v-if="!userStore.isLogin">
		<u-empty
		    :src="'/static/images/empty/order.png'"
		    text="您当前未登录,登录账号可查看信息"
		    mode="data"
		    :icon-size="300"
		    margin-top="120"
		    color="#888888"
		>
		    <template #bottom>
		        <view class="mt-4">
		            <u-button shape="square" type="primary" size="medium" :custom-style="{'background-color':$theme.primaryColor}" @click="goPage('/pages/login/login')">去登录</u-button>
		        </view>
		    </template>
		</u-empty>
	</view>
    <view v-if="userStore.isLogin && !userInfo.is_staff">
    	<u-empty
    	    :src="'/static/images/empty/order.png'"
    	    text="您当前未入驻,暂时无法接单"
    	    mode="data"
    	    :icon-size="300"
    	    margin-top="120"
    	    color="#888888"
    	>
    	    <template #bottom>
    	        <view class="mt-4">
    	            <u-button shape="square" type="primary" size="medium" :custom-style="{'background-color':$theme.primaryColor}" @click="goPage('/bundle/pages/apply/index')">申请入驻</u-button>
    	        </view>
    	    </template>
    	</u-empty>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}
</script>

<style lang="scss">

</style>
