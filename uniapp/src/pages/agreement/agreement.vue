<template>
    <view class="">
        <u-parse :html="agreementContent"></u-parse>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiPolicyAgreement } from '@/api/app'

let agreementType = ref('') // 协议类型
const agreementContent = ref('') // 协议内容

const getData = async () => {
    const res = await apiPolicyAgreement()
    agreementContent.value = res.content
    uni.setNavigationBarTitle({
        title: String(res.title)
    })
}

onLoad((options: any) => {
    if (options.type) {
        agreementType = options.type
        getData()
    }
})
</script>

<style lang="scss" scoped></style>
