<!-- 网站信息 -->
<template>
    <div class="user-setup">
        <el-card shadow="never" class="!border-none">
            <div class="font-medium mb-7">基本设置</div>
            <el-form ref="formRef" :model="formData" label-width="120px">
                <el-form-item label="用户默认头像">
                    <div>
                        <material-picker v-model="formData.default_avatar" :limit="1" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <div class="form-tips">
                            用户默认头像，建议尺寸：200*200像素，支持jpg，jpeg，png格式
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="师傅默认头像">
                    <div>
                        <material-picker v-model="formData.default_staff_avatar" :limit="1" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <div class="form-tips">
                            师傅默认头像，建议尺寸：200*200像素，支持jpg，jpeg，png格式
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <footer-btns v-perms="['setting.user.user/setConfig']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="settingUserSetup">
import { apiUserConfigGet, apiUserConfigSet } from '@/api/setting/user'
import feedback from '@/utils/feedback'
// import type { FormInstance } from 'element-plus'

// 表单数据
const formData = reactive({
    default_avatar: '', // 用户默认头像
    default_staff_avatar: '' // 师傅默认头像
})

// 获取用户设置数据
const getData = async () => {
    try {
        const data = await apiUserConfigGet()
        for (const key in formData) {
            //@ts-ignore
            formData[key] = data[key]
        }
    } catch (error) {
        console.log('获取=>', error)
    }
}

// 保存用户设置数据
const handleSubmit = async () => {
    try {
        await apiUserConfigSet(formData)
        getData()
    } catch (error) {
        console.log('保存=>', error)
    }
}

getData()
</script>

<style lang="scss" scoped></style>
