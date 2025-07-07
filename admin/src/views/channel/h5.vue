<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert type="warning" title="温馨提示：H5商城设置" :closable="false" show-icon />
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-form ref="formRef" :model="formData" label-width="160px">
                <el-form-item label="渠道状态" required prop="status">
                    <div>
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="1">开启</el-radio>
                            <el-radio :label="0">关闭</el-radio>
                        </el-radio-group>
                        <div class="form-tips">状态为关闭时，将不对外提供服务，请谨慎操作</div>
                    </div>
                </el-form-item>
                <el-form-item label="关闭后访问页面" prop="close">
                    <el-radio-group v-model="formData.close_page">
                        <el-radio :label="1">空页面</el-radio>
                        <el-radio :label="2">自定义链接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="url" v-if="formData.close_page == 2">
                    <div class="w-80">
                        <el-input v-model="formData.close_url" placeholder="请输入完整的url" />
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <footer-btns v-perms="['channel:h5:save']">
            <el-button type="primary" @click="handelSave">保存</el-button>
        </footer-btns>
    </div>
</template>
<script lang="ts" setup name="channelH5">
import { getH5Config, setH5Config } from '@/api/channel/h5'
const formData = reactive({
    status: 0, // 0-关闭 1-开启
    close_page: 0, // 1-空白页 2-自定义链接
    close_url: '' // 自定义链接
})

const getDetail = async () => {
    const data = await getH5Config()
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

const handelSave = async () => {
    await setH5Config(formData)
    getDetail()
}

getDetail()
</script>
