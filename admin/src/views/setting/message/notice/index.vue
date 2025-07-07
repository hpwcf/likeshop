<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：平台配置在各个场景下的通知发送方式和内容模板"
                :closable="false"
                show-icon
            ></el-alert>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-tabs v-model="form.recipient" @tab-change="getLists">
                <el-tab-pane
                    v-for="(item, index) in tabsMap"
                    :key="index"
                    :label="item.name"
                    :name="item.type"
                    lazy
                ></el-tab-pane>
            </el-tabs>
            <el-table size="large" :data="pager.lists" v-loading="state.loading">
                <el-table-column label="通知场景" prop="scene_name" min-width="120" />
                <el-table-column label="通知类型" prop="type_desc" min-width="160" />
                <el-table-column label="短信通知" min-width="80">
                    <template #default="{ row }">
                        <el-tag :type="row.sms_status_desc == '启用' ? 'primary' : 'danger'">{{
                            row.sms_status_desc
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="微信模板" min-width="80">
                    <template #default="{ row }">
                        <div v-if="row.type == 1 && row.support.includes('3')">
                            <el-tag :type="row.oa_status_desc == '启用' ? 'primary' : 'danger'">{{
                                row.oa_status_desc
                            }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="微信小程序" min-width="80">
                    <template #default="{ row }">
                        <div v-if="row.type == 1 && row.support.includes('4')">
                            <el-tag :type="row.mnp_status_desc == '启用' ? 'primary' : 'danger'">{{
                                row.mnp_status_desc
                            }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['setting:notice:detail']" type="primary" link>
                            <router-link
                                :to="{
                                    path: getRoutePath('setting:notice:detail'),
                                    query: {
                                        id: row.id,
                                        recipient: form.recipient
                                    }
                                }"
                            >
                                设置
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup name="settingMessageNotice">
import { noticeLists } from '@/api/setting/message'
import { getRoutePath } from '@/router'
import { usePaging } from '@/hooks/usePaging'

enum NoticeEnums {
    USER = 1,
    PLATFORM = 2,
    MASTER = 3
}

const form = ref({ recipient: NoticeEnums.USER })
const tabsMap = [
    {
        name: '通知用户',
        type: NoticeEnums.USER
        // type: 1
    },
    {
        name: '通知师傅',
        type: NoticeEnums.MASTER
        // type: 3
    },
    {
        name: '通知平台',
        type: NoticeEnums.PLATFORM
        // type: 2
    }
]

// 列表数据
const state = reactive({
    loading: false,
    lists: [1]
})

//分页组件
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: noticeLists,
    params: form.value
})

getLists()
</script>

<style scoped lang="scss">
.el-alert--warning.is-light {
    background-color: rgba(65, 83, 255, 0.06);
    color: #4153ff;
}
</style>
