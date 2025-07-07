<!-- 支付配置 -->
<template>
    <el-card class="!border-none" shadow="never">
        <el-alert
            title="温馨提示：设置系统支持的支付方式"
            type="warning"
            show-icon
            :closable="false"
        />
    </el-card>

    <el-card class="mt-4 !border-none" shadow="never">
        <el-table :data="tableData" v-loading="tableData.length == 0" style="width: 100%">
            <el-table-column prop="pay_way_desc" label="支付方式" min-width="150" />
            <el-table-column prop="name" label="显示名称" min-width="150" />
            <el-table-column prop="image" label="图标" min-width="150">
                <template #default="scope">
                    <el-image :src="scope.row.image" alt="图标" style="width: 34px; height: 34px" />
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="150" />
            <el-table-column label="操作" min-width="120" fixed="right">
                <!-- 操作 -->
                <template #default="scope">
                    <config-form :id="scope.row.id" :title="'配置'" @refresh="getPaymentConfig" />
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script lang="ts" setup name="settingPaymentConfig">
import { ref } from 'vue'
import { apiPaymentConfigLists } from '@/api/setting/payment'
import configForm from './component/config-form.vue'

const tableData = ref<Array<object>>([])

// 获取服务设置
const getPaymentConfig = async (): Promise<void> => {
    ;(tableData.value as object) = await apiPaymentConfigLists()
}

getPaymentConfig()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 280px;
}
</style>
