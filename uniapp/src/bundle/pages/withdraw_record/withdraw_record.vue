<template>
    <view class="withdrawal-record">
        <view class="List pt-[20rpx]" v-if="isLogin">
            <List />
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import List from './components/list.vue'
import { useUserStore } from '@/stores/user'

// 是否登录
const userStore = useUserStore()
const isLogin = computed(() => userStore.token)
</script>

<style lang="scss" scoped>
.List {
    height: calc(100vh - env(safe-area-inset-bottom));
}
</style>
