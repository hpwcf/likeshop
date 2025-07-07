<!-- 支付方式 -->
<template>
    <router-link
        class="mr-2"
        :to="{
            path: 'payment_way/edit'
        }"
    >
        <el-button type="primary">设置支付方式</el-button>
    </router-link>
    <el-card shadow="never" class="mt-4 !border-none">
        <!-- 各平台支付 -->
        <div
            style="padding-bottom: 50px"
            v-for="(item, index) in tableData"
            v-loading="tableData.length == 0"
            :key="index"
        >
            <div class="text-lg mb-5 font-medium" v-if="index == 1">
                微信小程序
                <span class="text-xs form-tips font-normal ml-2">在微信小程序中付款的场景</span>
            </div>
            <div class="text-lg mb-5 font-medium" v-if="index == 2">
                微信公众号
                <span class="text-xs font-normal form-tips ml-2"
                    >在微信公众号H5页面中付款的场景，公众号类型一般为服务号</span
                >
            </div>
            <div class="text-lg mb-5 font-medium" v-if="index == 3">
                H5支付
                <span class="text-xs form-tips font-normal ml-2">在浏览器H5页面中付款的场景</span>
            </div>
            <!-- <div class="lg m-b-24 card-title" v-if="index == 4">
                PC商城
                <span class="xs muted m-l-10">在PC商城页面中付款的场景</span>
            </div>
            <div class="lg m-b-24 card-title" v-if="index == 5">
                APP支付
                <span class="xs muted m-l-10">在APP中付款的场景</span>
            </div>
            <div class="lg m-b-24 card-title" v-if="index == 7">
                字节小程序
                <span class="xs muted m-l-10">在字节小程序中付款的场景</span>
            </div> -->

            <!-- 支付列表主体 -->
            <el-table :data="item" style="width: 100%">
                <el-table-column prop="icon" label="图标" min-width="150">
                    <template #default="scope">
                        <el-image
                            :src="scope.row.icon"
                            alt="图标"
                            style="width: 34px; height: 34px"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pay_way_desc"
                    label="支付方式"
                    min-width="150"
                ></el-table-column>
                <el-table-column prop="is_default" label="默认支付" min-width="150">
                    <template #default="scope">
                        <el-tag v-model="scope.row.is_default" :name="1" :label="1">{{
                            scope.row.is_default ? '默认' : '-'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" min-width="150">
                    <template #default="scope">
                        <span style="color: #67c23a">{{
                            scope.row.status == 1 ? '开启' : '关闭'
                        }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script lang="ts" setup name="settingPaymentWay">
import { ref } from 'vue'
import { apiPaymentWayLists } from '@/api/setting/payment'

const tableData = ref<Array<object>>([])
// 获取服务设置
const getPaymentConfig = async (): Promise<void> => {
    ;(tableData.value as object) = await apiPaymentWayLists()
}
getPaymentConfig()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 280px;
}
</style>
