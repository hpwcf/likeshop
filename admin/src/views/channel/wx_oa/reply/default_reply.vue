<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：1.粉丝在公众号发送内容时，系统无法匹配情况下发送启用的默认文本回复；2.同时只能启用一个默认回复。"
                :closable="false"
                show-icon
            />
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div>
                <el-button class="mb-4" type="primary" @click="handleAdd()">
                    <template #icon>
                        <icon name="el-icon-Plus" />
                    </template>
                    新增
                </el-button>
            </div>
            <el-table size="large" :data="lists">
                <el-table-column label="规则名称" prop="name" min-width="120" />
                <!-- <el-table-column label="关键词" prop="keyword" min-width="120" /> -->
                <!-- <el-table-column label="匹配方式" prop="matching_type_desc" min-width="120" /> -->
                <el-table-column label="回复类型" min-width="120">
                    <template #default="{ row }">
                        {{ getContentType(1) }}
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="sort" min-width="120" />
                <el-table-column label="状态" min-width="120">
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="changeStatus(row.id)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
                        <el-button type="danger" link @click="handleDelete(row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" @success="getLists" @close="showEdit = false" />
    </div>
</template>
<script lang="ts" setup name="channelReplyDefault">
import { oaReplyDel, getOaReplyList, changeOaReplyStatus } from '@/api/channel/wx_oa'
import EditPopup from './edit.vue'
import feedback from '@/utils/feedback'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const lists = ref([])

const getContentType = computed(() => {
    return (val: number) => {
        switch (val) {
            case 1:
                return '文本'
        }
    }
})

const getLists = async () => {
    const { lists: res } = await getOaReplyList({ reply_type: 3 })
    lists.value = res
}

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add', 3)
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit', 3)
    editRef.value?.getDetail(data)
}

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？')
    await oaReplyDel({ id })
    getLists()
}

const changeStatus = async (id: number) => {
    try {
        await changeOaReplyStatus({ id })
        getLists()
    } catch (error) {
        getLists()
    }
}

getLists()
</script>
