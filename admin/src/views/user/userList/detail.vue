<template>
    <!-- Header Start -->
    <el-card class="!border-none" shadow="never">
        <el-page-header content="用户详情" @back="$router.back()" />
    </el-card>
    <!-- Header End -->

    <!-- Main Start -->
    <el-card shadow="never" class="mt-4 card !border-none" :body-style="{ padding: '20px 0px' }">
        <template #header>
            <span class="text-lg font-semibold">基本资料</span>
        </template>

        <div class="top-container">
            <div class="avatar">
                <div class="mb-2 ml-3">用户头像</div>
                <el-image
                    style="width: 80px; height: 80px; border-radius: 50%"
                    :src="userInfo.avatar"
                    :preview-src-list="[userInfo.avatar]"
                    :fit="'cover'"
                />
            </div>

            <div class="account">
                <div class="my-4">可用余额</div>
                <div class="price-text">
                    ￥{{ userInfo.user_money }}
                    <el-button link type="primary" @click="handleadjust()">调整</el-button>
                </div>
            </div>
        </div>

        <el-form label-position="right" label-width="auto" :model="userInfo" class="mt-6 px-2">
            <el-form-item label="用户账号:">
                {{ userInfo.account || '-' }}
            </el-form-item>
            <el-form-item label="用户昵称:">
                {{ userInfo.nickname || '-' }}
            </el-form-item>
            <el-form-item label="真实姓名:">
                <div class="flex">
                    {{ userInfo.real_name || '-' }}
                    <popover-input
                        @confirm="handleUserInfoEdit($event, 'real_name')"
                        v-model="userInfo.real_name"
                        type="text"
                    >
                        <el-icon style="vertical-align: middle" color="#4A5DFF" class="ml-2">
                            <edit-pen />
                        </el-icon>
                    </popover-input>
                </div>
            </el-form-item>
            <el-form-item label="性别:">
                <div class="flex">
                    {{ userInfo.sex_desc || '-' }}
                    <popover-user
                        @confirm="handleUserInfoEdit($event, 'sex')"
                        changeType="sex"
                        v-model="userInfo.sex"
                    >
                        <el-icon style="vertical-align: middle" color="#4A5DFF" class="ml-2">
                            <edit-pen />
                        </el-icon>
                    </popover-user>
                </div>
            </el-form-item>
            <el-form-item label="联系电话:">
                <div class="flex">
                    {{ userInfo.mobile || '-' }}
                    <popover-input
                        @confirm="handleUserInfoEdit($event, 'mobile')"
                        v-model="userInfo.mobile"
                        type="text"
                    >
                        <el-icon style="vertical-align: middle" color="#4A5DFF" class="ml-2">
                            <edit-pen />
                        </el-icon>
                    </popover-input>
                </div>
            </el-form-item>
            <el-form-item label="注册来源:">
                {{ userInfo.source_desc || '-' }}
            </el-form-item>
            <el-form-item label="注册时间:">
                {{ userInfo.create_time || '-' }}
            </el-form-item>
            <el-form-item label="最近登录时间:">
                {{ userInfo.login_time || '-' }}
            </el-form-item>
        </el-form>
    </el-card>

    <edit-popup
        v-if="showEdit"
        ref="editRef"
        @close="showEdit = false"
        :id="route.query.id"
        :value="userInfo.user_money"
        :type="1"
        @success="initUserInfoFunc"
    ></edit-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiUserDetail, apiSetUserInfo } from '@/api/user'
import PopoverInput from '@/components/popover-input/index.vue'
import PopoverUser from './components/popover-user.vue'
import EditPopup from './components/adjust.vue'

/** Interface Start **/
interface UserInfoObj {
    id: number | string //	int	id
    sn: string //	string	用户编码
    nickname: string //	string	用户昵称
    avatar: string //	string	用户头像
    mobile: number | string //	string	手机号码
    sex: number //	int	用户性别
    sex_desc: string //	string	性别描述
    real_name: string //	string	真实姓名
    login_time: string //	string	最近登录时间
    register_source: number //	int	注册来源
    source_desc: string //	string	来源描述
    create_time: string //	string	注册时间
    account?: string
    user_money: string
}
/** Interface End **/

/** Data Start **/
const showEdit = ref(false)
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const route = useRoute()
const userInfo = ref<UserInfoObj>({
    id: '',
    sn: '',
    nickname: '',
    avatar: '',
    mobile: '',
    sex: 0,
    sex_desc: '',
    real_name: '',
    login_time: '',
    register_source: 0,
    source_desc: '',
    create_time: '',
    user_money: ''
})
/** Data End **/

/** Methods Start **/
// 初始化用户数据
const initUserInfoFunc = async (): Promise<void> => {
    const res: any = await apiUserDetail({ id: route.query.id })
    userInfo.value = res
}

/**
 * @description 编辑用户信息
 */
const handleUserInfoEdit = async (event: string, type: string): Promise<void> => {
    await apiSetUserInfo({
        id: userInfo.value.id,
        field: type,
        value: event
    })
    initUserInfoFunc()
}

const handleadjust = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open()
}
/** Methods End **/

/** Life Cycle Start **/
initUserInfoFunc()
/** Life Cycle End **/
</script>

<style lang="scss">
.card {
    padding: 0 20px;

    .top-container {
        display: flex;
        background-color: #f6f6f6;
        padding: 20px 80px;
        .avatar {
            flex: 0 0 350px;
        }
        .account {
            flex: 0 0 20%;
            text-align: center;
            padding-left: 12px;
        }
    }
}
</style>
