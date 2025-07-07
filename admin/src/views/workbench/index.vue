<template>
    <div class="workbench">
        <div class="lg:flex">
            <el-card
                class="!border-none mb-4 md:mr-4"
                shadow="never"
                :body-style="{
                    width: '400px'
                }"
            >
                <template #header>
                    <span class="card-title">平台信息</span>
                </template>
                <div>
                    <div class="flex leading-9">
                        <div class="mr-3">平台名称</div>
                        <div>{{ workbenchData.version.website }}</div>
                    </div>
                    <div class="flex leading-9">
                        <div class="mr-3">当前版本</div>
                        <div class="flex">
                            <div>{{ workbenchData.version.version }}</div>

                            <div class="ml-5 text-xs text-[#F36161]" v-if="checkData.hasNewVersion">
                                有新的版本可用
                            </div>
                        </div>
                    </div>
                    <div class="flex leading-9 items-center" v-if="config.document_status">
                        <is-copyright />

                        <div>
                            <el-tag type="success" class="mr-2 ml-2" effect="dark">
                                <a href="https://www.likeshop.cn/" target="_blank">官网 </a>
                            </el-tag>
                            <el-tag type="danger" class="mx-1" effect="dark">
                                <a href="https://www.likeshop.cn/doc" target="_blank"> 开发文档 </a>
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-card>

            <el-card class="!border-none mb-4 flex-1" shadow="never">
                <template #header>
                    <div>
                        <span class="card-title">数据统计</span>
                        <span class="text-tx-secondary text-xs ml-4">
                            更新时间：{{ workbenchData.today.time }}
                        </span>
                    </div>
                </template>

                <div class="flex flex-wrap">
                    <div class="w-1/2 md:w-1/4">
                        <div class="leading-10">今日销量（笔）</div>
                        <div class="text-6xl">
                            {{ workbenchData.today.today_sales_count }}
                        </div>
                        <div class="text-tx-secondary text-xs">
                            总销量：{{ workbenchData.today.total_sales_count }}
                        </div>
                    </div>
                    <div class="w-1/2 md:w-1/4">
                        <div class="leading-10">今日销售金额（元）</div>
                        <div class="text-6xl">
                            {{ workbenchData.today.today_sales_amount }}
                        </div>
                        <div class="text-tx-secondary text-xs">
                            总销售金额：{{ `￥${workbenchData.today.total_sales_amount}` }}
                        </div>
                    </div>
                    <div class="w-1/2 md:w-1/4">
                        <div class="leading-10">新增会员（人）</div>
                        <div class="text-6xl">{{ workbenchData.today.today_new_user }}</div>
                        <div class="text-tx-secondary text-xs">
                            总会员量：{{ workbenchData.today.total_new_user }}
                        </div>
                    </div>
                    <div class="w-1/2 md:w-1/4">
                        <div class="leading-10">用户访问量（人）</div>
                        <div class="text-6xl">{{ workbenchData.today.today_visitor }}</div>
                        <div class="text-tx-secondary text-xs">
                            总访问量：{{ workbenchData.today.total_visitor }}
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="function mb-4">
            <el-card class="flex-1 !border-none" shadow="never">
                <template #header>
                    <span>常用功能</span>
                </template>
                <div class="flex flex-wrap">
                    <div
                        v-for="item in workbenchData.menu"
                        class="md:w-[12.5%] w-1/4 flex flex-col items-center"
                        :key="item"
                    >
                        <router-link :to="item.url" class="mb-3 flex flex-col items-center">
                            <image-contain width="40px" height="40px" :src="item?.image" />
                            <div class="mt-2">{{ item.name }}</div>
                        </router-link>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="lg:flex">
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>销售额趋势图（近15天）</span>
                </template>
                <div>
                    <v-charts
                        style="height: 350px"
                        :option="workbenchData.businessOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>

            <el-card class="flex-1 !border-none mb-4" shadow="never">
                <template #header>
                    <span>用户访问量（近15天）</span>
                </template>
                <div>
                    <v-charts
                        style="height: 350px"
                        :option="workbenchData.visitorOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
        </div>

        <div class="text-sm text-[#999] mt-8">
            <div class="flex justify-center">
                <a class="mr-10" href="https://www.likeshop.cn/" target="_blank">官网</a>
                <a class="mr-10" href="https://www.likeshop.cn/doc" target="_blank">文档</a>
                <a href="https://gitee.com/likeshop_gitee/likeshop" target="_blank">Gitee</a>
            </div>
            <div class="text-center mt-[10px]" v-if="config.copyright_config">
                <a :href="config.copyright_config[0]?.value" target="_blank">{{
                    config.copyright_config[0]?.key
                }}</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="workbench">
import { getWorkbench, apiCheckVersion } from '@/api/app'
import vCharts from 'vue-echarts'
import useAppStore from '@/stores/modules/app'

// 表单数据
const appStore = useAppStore()
const config = computed(() => appStore.config)
const workbenchData: any = reactive({
    version: {
        version: '', // 系统版本
        website: '' // 平台名称
    },
    today: {}, // 今日数据
    menu: [], // 常用功能
    visitor: [], // 访问量
    business: [], // 销售额

    businessOption: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        itemStyle: {
            // 点的颜色。
            color: 'red'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name: '销售量',
                data: [],
                type: 'line'
            }
        ]
    },

    visitorOption: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        itemStyle: {
            // 点的颜色。
            color: 'red'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name: '访问量',
                data: [],
                type: 'line'
            }
        ]
    }
})

// 获取工作台主页数据
const getData = async () => {
    const res = await getWorkbench()
    workbenchData.version = res.version
    workbenchData.today = res.today
    workbenchData.menu = res.menu
    workbenchData.visitor = res.visitor
    workbenchData.support = res.support

    // 清空echarts 数据
    workbenchData.visitorOption.xAxis.data = []
    workbenchData.visitorOption.series[0].data = []

    // 写入从后台拿来的数据
    workbenchData.visitorOption.xAxis.data = res.visitor.date.reverse()
    workbenchData.visitorOption.series[0].data = res.visitor.list[0].data.reverse()

    workbenchData.businessOption.xAxis.data = res.business.date.reverse()
    workbenchData.businessOption.series[0].data = res.business.list[0].data.reverse()
}
// 检测新版本
const checkData = reactive({
    hasNewVersion: false,
    newVersion: ''
})
const getCheckVersion = async () => {
    const res = await apiCheckVersion(null)
    checkData.hasNewVersion = res.result
    checkData.newVersion = res.version
}
onMounted(() => {
    getData()
    getCheckVersion()
})
</script>

<style lang="scss" scoped></style>
