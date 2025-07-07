<!-- 网站信息 -->
<template>
    <div class="website-information">
        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">
            <el-menu
                :default-active="menuActiveName"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleMenuSelect"
            >
                <el-menu-item index="platform">平台设置</el-menu-item>
                <el-menu-item index="user">用户端设置</el-menu-item>
                <el-menu-item index="staff">师傅端设置</el-menu-item>
            </el-menu>

            <div v-if="menuActiveName == 'platform'">
                <el-card shadow="never" class="!border-none mt-4">
                    <div class="text-xl font-medium mb-[20px]">基础设置</div>
                    <el-form-item label="平台名称" prop="name">
                        <div class="w-80">
                            <el-input
                                v-model="formData.name"
                                placeholder="请输入平台名称"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="平台LOGO" prop="web_logo" required>
                        <div>
                            <material-picker v-model="formData.web_logo" :limit="1" />
                            <div class="form-tips">
                                建议尺寸：200*200像素/240*60像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="登录封面图" prop="login_image" required>
                        <div>
                            <material-picker v-model="formData.login_image" :limit="1" />
                            <div class="form-tips">
                                建议尺寸：500*500像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="平台图标" prop="web_favicon" required>
                        <div>
                            <material-picker v-model="formData.web_favicon" :limit="1" />
                            <div class="form-tips">
                                网站favicon图标设置，建议尺寸：100*100像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="登录安全" prop="web_login_security">
                        <div>
                            <el-radio-group v-model="formData.web_login_security">
                                <el-radio :label="0">不限制</el-radio>
                                <el-radio :label="1">限制</el-radio>
                            </el-radio-group>
                            <div class="flex mt-[10px]" v-if="formData.web_login_security">
                                <div class="flex mr-[20px]">
                                    <span class="mr-[5px] text-[#666666]">输错密码</span>
                                    <el-input
                                        v-model="formData.web_login_error_num"
                                        style="width: 140px"
                                        type="number"
                                    >
                                        <template #append>次</template>
                                    </el-input>
                                </div>
                                <div class="flex">
                                    <span class="mr-[5px] text-[#666666]">限制登录</span>
                                    <el-input
                                        v-model="formData.web_login_error_time"
                                        style="width: 140px"
                                        type="number"
                                    >
                                        <template #append>分钟</template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="文档信息" prop="document_status">
                        <div>
                            <el-radio-group v-model="formData.document_status">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                            <div class="form-tips">默认开启，控制工作台商城信息的按钮是否显示</div>
                        </div>
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="!border-none mt-4">
                    <div class="text-xl font-medium mb-[20px]">联系方式</div>
                    <el-form-item label="姓名" prop="web_contact_name">
                        <div class="w-80">
                            <el-input
                                v-model="formData.web_contact_name"
                                placeholder="请输入姓名"
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="web_contact_mobile">
                        <div class="w-80">
                            <el-input
                                v-model="formData.web_contact_mobile"
                                placeholder="请输入联系电话"
                            ></el-input>
                        </div>
                    </el-form-item>
                </el-card>
            </div>
            <div v-if="menuActiveName == 'user'">
                <el-card shadow="never" class="!border-none mt-4">
                    <div class="text-xl font-medium mb-[20px]">基础设置</div>
                    <el-form-item label="用户端名称" prop="shop_name">
                        <div class="w-80">
                            <el-input
                                v-model="formData.shop_name"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="用户端简称" prop="shop_abbrev">
                        <div class="w-80">
                            <el-input
                                v-model="formData.shop_abbrev"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="用户端LOGO" prop="shop_logo">
                        <div>
                            <material-picker v-model="formData.shop_logo" :limit="1" />
                            <div class="form-tips">
                                建议尺寸：200*200像素/240*60像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                </el-card>
            </div>
            <div v-if="menuActiveName == 'staff'">
                <el-card shadow="never" class="!border-none mt-4">
                    <div class="text-xl font-medium mb-[20px]">基础设置</div>
                    <el-form-item label="师傅端名称" prop="staff_name">
                        <div class="w-80">
                            <el-input
                                v-model="formData.staff_name"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="师傅端LOGO" prop="staff_logo">
                        <div>
                            <material-picker v-model="formData.staff_logo" :limit="1" />
                            <div class="form-tips">
                                建议尺寸：200*200像素/240*60像素，支持jpg，jpeg，png格式
                            </div>
                        </div>
                    </el-form-item>
                </el-card>
            </div>
        </el-form>

        <footer-btns v-perms="['setting.web.web_setting/setWebsite']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="settingWebsiteInfomation">
import { getWebsite, setWebsite } from '@/api/setting/website'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const menuActiveName = ref('platform')

// 表单数据
const formData = reactive({
    //平台设置
    name: '', // 平台名称
    web_logo: '', // 平台logo
    login_image: '', // 登录封面图
    web_favicon: '', // 平台图标
    web_login_security: '', //登录安全
    web_login_error_num: '', //输错密码次数
    web_login_error_time: '', //限制登录时间
    document_status: '', //文档信息
    web_contact_name: '', //联系姓名
    web_contact_mobile: '', //联系号码
    //用户端设置
    shop_name: '', // 用户端名称
    shop_abbrev: '', //用户端简称
    shop_logo: '', // 用户端LOGO
    //师傅端设置
    staff_name: '', // 师傅端名称
    staff_logo: '' // 师傅端logo
})

// 表单验证
const rules = {
    name: [
        {
            required: true,
            message: '请输入网站名称',
            trigger: ['blur']
        }
    ],
    web_favicon: [
        {
            required: true,
            message: '请选择网站图标',
            trigger: ['change']
        }
    ],
    web_logo: [
        {
            required: true,
            message: '请选择网站logo',
            trigger: ['change']
        }
    ],
    login_image: [
        {
            required: true,
            message: '请选择登录页广告图',
            trigger: ['change']
        }
    ],
    shop_name: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ],
    shop_abbrev: [
        {
            required: true,
            message: '请输入简称',
            trigger: ['blur']
        }
    ],
    shop_logo: [
        {
            required: true,
            message: '请选择前台LOGO',
            trigger: ['change']
        }
    ],
    staff_name: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ],
    staff_logo: [
        {
            required: true,
            message: '请选择LOGO',
            trigger: ['change']
        }
    ],
    web_contact_name: [
        {
            required: true,
            message: '请输入联系姓名',
            trigger: ['blur']
        }
    ],
    web_contact_mobile: [
        {
            required: true,
            message: '请输入联系号码',
            trigger: ['blur']
        }
    ]
}

//菜单选择
const handleMenuSelect = (key: string, keyPath: string[]) => {
    menuActiveName.value = key
}

// 获取基础配置信息
const getData = async () => {
    const data = await getWebsite()
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

// 设置基础配置信息
const handleSubmit = async () => {
    await formRef.value?.validate()
    await setWebsite(formData)
    getData()
}

getData()
</script>

<style lang="scss" scoped>
.el-menu-demo {
    padding: 5px 10px 10px 20px;
    border-radius: 5px;

    :deep(.el-menu--horizontal) {
        border: unset;
    }
    :deep(.el-menu-item) {
        padding: 0;
        margin: 0 50px 0 10px;
    }
    :deep(.el-menu--horizontal .el-menu-item:focus, .el-menu--horizontal .el-menu-item:hover) {
        background-color: unset;
    }
}
</style>
