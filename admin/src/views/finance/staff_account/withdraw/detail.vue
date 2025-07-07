<template>
    <el-card shadow="never" class="!border-none">
        <el-page-header content="提现审核" @back="$router.back()" />
    </el-card>
    <el-form ref="formRef" :model="formData" label-width="120px" inline disabled>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[18px] mb-[30px]">提现信息</div>
            <div class="flex">
                <el-form-item label="师傅姓名:">
                    <div class="w-[340px]">{{ formData.name }}</div>
                </el-form-item>
                <el-form-item label="师傅工号:">
                    <div class="w-[340px]">{{ formData.staff_sn }}</div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="手机号码:">
                    <div class="w-[340px]">{{ formData.staff_mobile }}</div>
                </el-form-item>
                <el-form-item label="申请时间:">
                    <div class="w-[340px]">{{ formData.create_time }}</div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="提现来源:">
                    <div class="w-[340px]">{{ formData.source_type_desc }}</div>
                </el-form-item>
                <el-form-item label="提现状态:">
                    <div class="w-[340px]">{{ formData.verify_status == 2 ? '审核拒绝' : formData.transfer_status == 2 ? '转账失败' : formData.status_desc }}</div>
                </el-form-item>
            </div>
            <div class="flex" v-if="formData.verify_status > 0 && formData.transfer_status == 0">
                <el-form-item label="审核时间:" class="items-start">
                    <div class="w-[340px]">{{ formData.verify_time }}</div>
                </el-form-item>
                <el-form-item label="拒绝原因:" v-if="formData.verify_status == 2">
                    <div class="w-[340px]">{{ formData.verify_remarks }}</div>
                </el-form-item>
            </div>
            <div class="flex items-baseline" v-if="formData.transfer_status > 0">
                <el-form-item label="转账时间:" class="items-start">
                    <div class="w-[340px]">{{ formData.transfer_time }}</div>
                </el-form-item>
                <el-form-item label="转账凭证:" v-if="formData.transfer_status == 1">
                    <div class="w-[340px]">
                        <el-image
                            style="width: 60px; height: 60px"
                            :src="formData.transfer_voucher"
                            :preview-src-list="[formData.transfer_voucher]"
                            :hide-on-click-modal="true"
                            :preview-teleported="true"
                            :fit="'cover'"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="失败原因:" v-if="formData.transfer_status == 2">
                    <div class="w-[340px]">{{ formData.transfer_remark }}</div>
                </el-form-item>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[18px] mb-[30px]">收款信息</div>
            <div class="flex">
                <el-form-item label="提现方式:">
                    <div class="w-[340px]">{{ formData.type_desc }}</div>
                </el-form-item>
                <el-form-item label="提现金额:">
                    <div class="w-[340px]">{{ formData.money }}</div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="提现手续费:">
                    <div class="w-[340px]">{{ formData.service_ratio }}</div>
                </el-form-item>
                <el-form-item label="到账金额:">
                    <div class="w-[340px] text-[#F56C6C]">{{ formData.left_money }}</div>
                </el-form-item>
            </div>
            <div class="flex" v-if="formData.type == 1">
                <el-form-item label="微信姓名:">
                    <div class="w-[340px]">{{ formData.real_name }}</div>
                </el-form-item>
                <el-form-item label="微信手机号:">
                    <div class="w-[340px]">{{ formData.account }}</div>
                </el-form-item>
            </div>
            <div class="flex" v-if="formData.type == 2">
                <el-form-item label="支付宝姓名:">
                    <div class="w-[340px]">{{ formData.real_name }}</div>
                </el-form-item>
                <el-form-item label="支付宝账号:">
                    <div class="w-[340px]">{{ formData.account }}</div>
                </el-form-item>
            </div>
            <div class="flex" v-if="formData.type == 3">
                <el-form-item label="开户人姓名:">
                    <div class="w-[340px]">{{ formData.real_name }}</div>
                </el-form-item>
                <el-form-item label="开户行:">
                    <div class="w-[340px]">{{ formData.opening_bank }}</div>
                </el-form-item>
            </div>
            <div class="flex" v-if="formData.type == 3">
                <el-form-item label="银行卡号:">
                    <div class="w-[340px]">{{ formData.bank }}</div>
                </el-form-item>
            </div>
        </el-card>
    </el-form>
    <footer-btns v-if="formData.status < 3">
        <el-button v-if="formData.status == 1" type="danger" @click="verify(2)">审核拒绝</el-button>
        <el-button v-if="formData.status == 1" type="primary" @click="verify(1)">审核通过</el-button>
        <el-button v-if="formData.status == 2" type="danger" @click="transfer(2)">转账失败</el-button>
        <el-button v-if="formData.status == 2" type="primary" @click="transfer(1)">转账成功</el-button>
    </footer-btns>

    <el-dialog v-model="transferVoucherDialogShow" title="转账成功" width="300">
        <material-picker
            v-model="transferVoucher"
            :limit="1"
        ></material-picker>
        <template #footer>
      <div class="dialog-footer">
        <el-button @click="transferVoucherDialogShow = false">取消</el-button>
        <el-button type="primary" @click="transferSuccess">确定</el-button>
      </div>
    </template>
    </el-dialog>

    <!-- 审核拒绝弹窗 -->
    <Verify
        v-if="verifyRefShow"
        ref="verifyRef"
        :id="id"
        :verify_status="2"
        @close="verifyRefShow = false"
        @confirm="handleRefresh()"
    ></Verify>
    <!-- 转账失败弹窗 -->
    <Transfer
        v-if="transferRefShow"
        ref="transferRef"
        :id="id"
        :transfer_status="2"
        @close="transferRefShow = false"
        @confirm="handleRefresh()"
    ></Transfer>
</template>

<script lang="ts" setup>
import { apiWithdrawDetail,apiWithdrawVerify,apiWithdrawTransfer } from '@/api/finance/withdraw'
import { ref } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'
import type { ElForm } from 'element-plus'
import feedback from '@/utils/feedback'
import MaterialPicker from '@/components/material/picker.vue'
import Verify from './components/verify.vue'
import Transfer from './components/transfer.vue'

/** Data Start **/
const route = useRoute()
const router = useRouter()
const id: any = route.query.id
const formData = ref(<any>{})
const transferVoucher = ref()
const transferVoucherDialogShow = ref(false)
const verifyRef = shallowRef<InstanceType<typeof Verify>>()
const verifyRefShow = ref(true)
const transferRef = shallowRef<InstanceType<typeof Transfer>>()
const transferRefShow = ref(true)
/** Data End **/

/** Methods Start **/
// 获取详情
const getDetail = async (id: number): Promise<void> => {
    ;(formData.value as {}) = await apiWithdrawDetail({ id })
}
// 审核
const verify = async (status:number): Promise<void> => {
    //拒绝
    if (status == 2) {
        verifyRefShow.value = true
        verifyRef.value?.open()
    }
    //通过
    if (status == 1) {
        await feedback.confirm('确定通过该师傅的提现申请？请谨慎操作')
        await apiWithdrawVerify({ 'id':id,'verify_status':status })
        handleRefresh()
    }
}
// 转账
const transfer = async (status:number): Promise<void> => {
    //拒绝
    if (status == 2) {
        transferRefShow.value = true
        transferRef.value?.open()
    }
    //通过
    if (status == 1) {
        transferVoucherDialogShow.value = true
    }
}
//转账成功
const transferSuccess = async () => {
    transferVoucherDialogShow.value = false
    await apiWithdrawTransfer({ 'id':id,'transfer_status':1,'transfer_voucher':transferVoucher.value })
    handleRefresh()
}

//刷新
const handleRefresh = async () => {
    getDetail(id)
}
/** Methods End **/

/** LifeCycle Start **/
onMounted(async () => {
    // 请求详情 => 如果是编辑的话
    if (id) {
        await getDetail(id)
    }
})
/** LifeCycle End **/
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
