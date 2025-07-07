<template>
    <u-popup
        v-model="showPopup"
        mode="center"
        :mask-close-able="false"
        :customStyle="{
            'background': `none`
        }"
        :closeable="closeable"
        @close="emits('close')"
    >
        <view
            style="width: 600rpx;border-radius: 20rpx;"
            class="modal-popup p-[40rpx] text-center"
        >
            <view class="py-2 font-medium text-2xl text-black relative z-10">
                {{ title }}
            </view>

            <view
                class="py-[16px] text-base text-content relative z-10"
                style="width: 500rpx; margin: 0 auto;"
            >
                <slot name="content">{{ content }}</slot>
            </view>

            <slot name="footer">
                <view
                    class="flex gap-[20rpx] mt-[40rpx]"
                >
                    <view class="flex-1">
                        <u-button
                            @click="cancel"
                        >
                            取消
                        </u-button>
                    </view>

                    <view class="flex-1">
                        <u-button
                            type="primary"
                            @click="confirm"
                        >
                            确定
                        </u-button>
                    </view>
                </view>
            </slot>
        </view>
    </u-popup>
</template>


<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    show: boolean
    title: string
    content: string
    closeable: boolean
}>()

const emits = defineEmits<{
    (event: 'update:show', show: boolean): void
    (event: 'update', value: any): void
    (event: 'refresh'): void
    (event: 'close'): void
    (event: 'cancel'): void
    (event: 'confirm'): void
}>()

const showPopup = computed({
    get() {
        return props.show
    },
    set(val) {
        emits('update:show', val)
    }
})

const cancel = () => {
    showPopup.value = false
    emits('cancel')
}

const confirm = async () => {
    showPopup.value = false
    emits('confirm')

    // 检测定位权限, 如果是就打开设置
    if (props.title === '定位权限未授权') {
        const settings = await uni.openSetting()
        if (settings.authSetting['scope.userLocation']) {
            emits('refresh') // 重新获取定位
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-popup {
    position: relative;
    background: linear-gradient(to bottom, var(--color-primary-light-9) 0%, #fff 50%, #fff 100%);
    z-index: 2; // 确保内容的z-index高于伪元素

    &::before,
    &::after {
        content: '';
        position: absolute;
        width: 160px;
        height: 160px;
        opacity: 0.3;
        border-radius: 50%;
        z-index: 1; // 确保伪元素的z-index低于内容
    }

    &::before {
        left: -50px;
        top: -90px;
        background: linear-gradient(200deg, var(--color-primary-light-3) 0%, #fff 100%);
    }

    &::after {
        right: -50px;
        top: -90px;
        background: linear-gradient(150deg, var(--color-primary-light-3) 0%, #fff 100%);
    }
}
</style>
