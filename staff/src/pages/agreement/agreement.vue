<template>
    <view class="p-[24rpx]">
        <mp-html :content="content" />
    </view>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app";
import { apiPolicyAgreement } from "@/api/app"

let content = ref<string | null>('')
let id = ref<number | string | null | any>(3)
// 获取服务协议
const getPolicyAgreement = async (): Promise<void> => {
    const res = await apiPolicyAgreement({'id':id.value})
	const title = id.value == 3 ? '服务协议' : '隐私协议'
    uni.setNavigationBarTitle({
        title: title
    })
    content.value = res.content
}

onLoad((options) => {
    id.value = options.id || 3
    getPolicyAgreement()
})
</script>