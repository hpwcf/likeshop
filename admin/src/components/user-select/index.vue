<template>
    <popup
        class="mr-2 inline"
        :clickModalClose="false"
        :title="btnText"
        :center="true"
        :disabled="id !== ''"
        @close="handleClose(userFormRef)"
        @confirm="handleConfirm"
        width="1000px"
    >
        <!-- Trigger Start -->
        <template #trigger>
            <!-- trigger -->
            <div v-if="!modelValue">
                <el-button type="primary">{{ btnText }}</el-button>
            </div>
            <div v-if="modelValue" class="flex items-center">
                <el-image
                    style="width: 48px; height: 48px"
                    :src="userData.avatar || user.avatar"
                    :fit="'cover'"
                />
                <div class="ml-2">
                    {{ userData.nickname || user.nickname }}
                </div>
            </div>
        </template>
        <!-- Trigger End -->

        <!-- Form Start -->
        <el-form :model="userForm" ref="userFormRef" :inline="true" label-width="auto">
            <el-form-item label="用户信息">
                <el-input
                    class="ls-input"
                    v-model="userForm.user_info"
                    placeholder="请输入用户账号/昵称/手机号"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getLists">搜索</el-button>
                <el-button @click="resetParams">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- Form End -->

        <!-- Table Start -->
        <div>
            <el-table ref="tableDataRef" :data="pager.lists" border style="width: 100%">
                <el-table-column label="选择" width="60">
                    <template #default="scope">
                        <div class="flex justify-center">
                            <el-radio v-model="radio" :name="scope.row.id" :label="scope.row.id"
                                >&nbsp;</el-radio
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="account" label="用户账号" max-width="220" />
                <el-table-column label="用户头像" max-width="120">
                    <template #default="scope">
                        <el-image
                            style="width: 48px; height: 48px"
                            :src="scope.row.avatar"
                            :fit="'contain'"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column property="nickname" label="用户昵称" max-width="220" />
                <el-table-column property="mobile" label="手机号码" max-width="200" />
                <el-table-column property="create_time" label="注册时间" max-width="205" />
            </el-table>
        </div>
        <!-- Table End -->

        <div class="flex justify-end">
            <pagination v-model="pager" @change="getLists" />
        </div>
    </popup>
</template>

<script lang="ts" setup>
import { apiUserLists } from '@/api/user'
import Popup from '@/components/popup/index.vue'
import { ref, withDefaults } from 'vue'
import type { ElForm } from 'element-plus'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'

interface userFormObj {
    user_info?: string
}

type FormInstance = InstanceType<typeof ElForm>
const userFormRef = ref<FormInstance>()

/** Props Start **/
const props = withDefaults(
    defineProps<{
        modelValue?: any
        user?: any
        id?: string
        btnText?: string
    }>(),
    {
        modelValue: '',
        user: {},
        id: '',
        btnText: '',
    }
)
/** Props End **/

/** Emit Start **/
const emit = defineEmits(['update:modelValue'])
/** Emit End **/

/** Data Start **/
const userForm = ref<userFormObj>({
    user_info: '',
})
const userData = ref<any>(props.user)
const radio = ref<number>(props.modelValue)

const { pager, getLists, resetPage, resetParams } = usePaging({
    size: 5,
    fetchFun: apiUserLists,
    params: userForm.value,
})
/** Data End **/

/** Methods Start **/
// 弹窗关闭
const handleClose = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.resetFields()
}
// 确认选择
const handleConfirm = (): void => {
    const row = pager.lists.filter((item) => item.id === radio.value)
    userData.value = row[0]
    console.log(userData.value)
    emit('update:modelValue', row[0].id)
}
/** Methods End **/

/** Life Cycle Start **/
getLists()
/** Life Cycle End **/
</script>

<style lang="scss" scoped>
.ls-input {
    width: 240px;
}
:deep(.el-table__inner-wrapper) {
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>
