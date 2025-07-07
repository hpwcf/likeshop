<template>
    <u-tabbar
        v-model="current"
        v-bind="tabbarStyle"
        :list="tabbarList"
        :hide-tab-bar="true"
        @change="handleChange"
    ></u-tabbar>
</template>

<script lang="ts" setup>
import {useAppStore} from '@/stores/app'
import {navigateTo} from '@/utils/util'
import {computed, ref, onMounted} from 'vue'
import {getDecorateTabbar} from "@/api/decorate";

const current = ref()
const appStore = useAppStore()

const tabbarStyle = ref({
    activeColor: '#007AFF',
    inactiveColor: '#999999'
})
const tabbarList = ref<any>([])

const getTabbarList = async () => {
    const res = await getDecorateTabbar({})
    const data = JSON.parse(res.data)
    tabbarStyle.value = {
        activeColor: data.style.selected_color,
        inactiveColor: data.style.default_color
    }
    tabbarList.value = data.list?.filter((item: any) => item.is_show == 1)
        .map((item: any) => {
            return {
                iconPath: useAppStore().getImageUrl(item.unselected),
                selectedIconPath: useAppStore().getImageUrl(item.selected),
                text: item.name,
                link: item.link,
                pagePath: item.link.path
            }
        })
}

const nativeTabbar = [
    '/pages/index/index',
    '/pages/order/index',
    '/pages/user/user'
]
const handleChange = (index: number) => {
    const selectTab = tabbarList.value[index]
    const navigateType = nativeTabbar.includes(selectTab.link.path) ? 'switchTab' : 'reLaunch'
    navigateTo(selectTab.link, navigateType)
}

onMounted(() => {
    getTabbarList()
})
</script>
