<template>
    <u-empty
        :text="errText"
        :src="'/static/images/empty/order.png'"
        :icon-size="300"
        color="#888888"
    >
        <template #bottom>
            <view class="empty-bottom">
                <!-- <u-button @click="goHome" shape="circle" :ripple="true" size="large" :hair-line="false" type="info">
                    返回重试</u-button> -->
            </view>
        </template>
    </u-empty>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

/** Data Start **/
const errText = ref<string | null | undefined | number>('错误')
/** Data End **/

onLoad((options) => {
    errText.value = JSON.stringify(options.obj)
})
</script>

<style></style>
