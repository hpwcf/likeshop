<template>
    <el-card class="!border-none" shadow="never">
        <el-page-header content="设置支付方式" @back="$router.back()" />
    </el-card>

    <el-card shadow="never" class="mt-4 !border-none">
        <div style="padding-bottom: 50px" v-for="(item, index) in tableData" :key="index">
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
                <el-table-column prop="icon" label="图标" width="150">
                    <template #default="scope">
                        <!-- {{scope.row}} -->
                        <el-image :src="scope.row.icon" style="width: 34px; height: 34px" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pay_way_desc"
                    label="支付方式"
                    min-width="150"
                ></el-table-column>
                <el-table-column label="默认支付" min-width="150">
                    <template #default="scope">
                        <el-radio
                            v-model="scope.row.is_default"
                            :label="1"
                            :name="1"
                            @change="changeRadioPaymentSet(scope.$index, index)"
                            >设为默认</el-radio
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" min-width="150">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-card>

    <footer-btns>
        <el-button type="primary" @click="onSubmit">保存</el-button>
    </footer-btns>
</template>

<script lang="ts" setup>
import { apiPaymentWaySet, apiPaymentWayLists } from '@/api/setting/payment'
import { ref } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'

const route = useRoute()
const router = useRouter()
const tableData = ref<Array<any>>([])
// 切换默认支付方式,去除其它选项
const changeRadioPaymentSet = (cIndex: number, index: number): void => {
    tableData.value[index].forEach((item: any, i: number) => {
        tableData.value[index][i].is_default = 0
    })
    tableData.value[index][cIndex].is_default = 1
}
// 获取列表
const getPaymentWayDetail = async (): Promise<void> => {
    ;(tableData.value as object) = await apiPaymentWayLists()
}
// 编辑
const handlePaymentWayEdit = async (): Promise<void> => {
    await apiPaymentWaySet({ ...tableData.value })
    router.back()
}
// 提交数据
const onSubmit = (): void => {
    handlePaymentWayEdit()
}
getPaymentWayDetail()
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
