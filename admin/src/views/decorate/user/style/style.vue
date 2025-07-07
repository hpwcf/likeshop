<template>
    <el-card shadow="never" class="!border-none">
        <div class="mt-[-10px]">
            <el-tabs v-model="currentTabIndex">
                <el-tab-pane
                    v-for="(item, index) in tabsList"
                    :key="item.id"
                    :label="item.name"
                    :name="index"
                >
                    <component :is="item.component" v-model="item.data" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
    <footer-btns class="mt-4" :fixed="true">
        <el-button type="primary" @click="setData">保存</el-button>
    </footer-btns>
</template>
<script setup lang="ts" name="decorationUserStyle">
import { markRaw } from 'vue'

import { getStyleDetail, setStyleDetail } from '@/api/decoration'

import MobileStyle from './components/mobile-style.vue'

const currentTabIndex = ref(0)
const tabsList = ref([
    {
        name: '用户端风格',
        id: 1,
        component: markRaw(MobileStyle),
        data: {
            themeColorId: -1,
            themeColor: ''
        }
    }
])

const currentTab = computed(() => tabsList.value[currentTabIndex.value] || {})
//获取数据
const getData = async () => {
    const res = await getStyleDetail({ source: currentTab.value.id })
    currentTab.value.data = JSON.parse(res.data)
}

//保存数据
const setData = async () => {
    await setStyleDetail({
        id: currentTab.value.id,
        type: currentTab.value.id,
        source: currentTab.value.id,
        meta: null,
        data: JSON.stringify(currentTab.value.data)
    })
    getData()
}

//初始化数据
onMounted(async () => {
    await getData()
})
</script>
