<template>
    <div class="full-screen h-full cursor-pointer flex items-center px-2" @click="openDialog">
        <el-tag type="success" effect="dark">正版检测</el-tag>
    </div>

    <popup
        ref="popupRef"
        width="510px"
        @confirm="goPage"
        :confirmButtonText="!checking ? '前往官网' : false"
        :cancelButtonText="!checking ? '关闭' : false"
        title="正版检测"
    >
        <div
            v-if="checking"
            v-loading="checking"
            element-loading-text="正在检测中"
            style="height: 200px"
        ></div>

        <div v-else>
            <template v-for="(item, index) in state" :key="index">
                <div v-if="item.flag">
                    <div class="text-center">
                        <el-image
                            style="width: 48px; height: 48px"
                            :src="item.img"
                            :fit="'cover'"
                            class="mb-[20px]"
                        />
                    </div>
                    <div class="mb-[60px] px-[45px]">
                        {{ item.ctx_one }}
                        <span class="text-[#4073FA]">{{ item.ctx_two }}</span>
                        {{ item.ctx_three }}
                    </div>
                </div>
            </template>
        </div>
    </popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import successImg from '@/assets/images/success.png'
import errorImg from '@/assets/images/error.png'
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const isCopyright = computed(() => true)

const state = reactive([
    {
        flag: isCopyright.value,
        img: successImg,
        ctx_one: `恭喜您，系统检测到您的域名`,
        ctx_two: '已授权',
        ctx_three: '，可前往likeadmin.cn官网享受所有正版权益'
    },
    {
        flag: !isCopyright.value,
        img: errorImg,
        ctx_one: '很遗憾，系统检测到您的域名',
        ctx_two: '未授权',
        ctx_three:
            '，请前往likeadmin.cn官网【个人中心】-【产品授权】登记域名授权，否则将视为盗版行为!'
    }
])

const checking = ref(true)
const openDialog = () => {
    popupRef.value?.open()
    setTimeout(() => (checking.value = false), 2000)
}

const goPage = () => {
    window.open('https://www.likeadmin.cn/', '_blank')
}
</script>
