<template>
    <el-card shadow="never" class="!border-none">
        <el-page-header content="审核" @back="$router.back()" />
    </el-card>
    <el-form ref="formRef" :model="formData" label-width="120px" inline disabled>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">基本信息</div>
            <div class="flex">
                <el-form-item label="手机号:" prop="mobile">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.mobile"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.mobile_changed" >有修改</el-text>
                    </div>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.name"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.name_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="年龄:" prop="age">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.age"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.age_changed" >有修改</el-text>
                    </div>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio v-model="formData.sex" name="1" :label="1">男</el-radio>
                    <el-radio v-model="formData.sex" name="2" :label="2">女</el-radio>
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.sex_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="身份证号码:" prop="identity_number">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.identity_number"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.identity_number_changed" >有修改</el-text>
                    </div>
                </el-form-item>
                <el-form-item label="学历:" prop="education">
                    <el-select v-model="formData.education" placeholder="请选择" class="ls-input">
                        <el-option
                            v-for="(item,index) in enumLists.education"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.education_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="民族:" prop="nation">
                    <el-select v-model="formData.nation" placeholder="请选择" class="ls-input">
                        <el-option
                            v-for="(item,index) in enumLists.nation"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.nation_changed" >有修改</el-text>
                    </div>
                </el-form-item>
                <el-form-item label="地址:" prop="district_id">
                    <area-select
                        class="ls-input w-56"
                        v-model:province="formData.province_id"
                        v-model:city="formData.city_id"
                        v-model:district="formData.district_id"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.province_id_changed || formData?.city_id_changed || formData?.district_id_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="详细地址:">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.address"
                    />
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.address_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label=" ">
                    <div id="container" class="map-container mt-2 w-[600px]"></div>
                </el-form-item>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">技能</div>
            <div class="flex">
                <el-form-item label="服务技能:" prop="skill_id">
                    <el-select
                        class="mr-2 w-[340px]"
                        v-model="formData.skill_id"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in skillData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.skill_id_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="服务项目:" prop="goods_id">
                    <el-button type="primary">选择服务</el-button>
                    <div class="ml-[10px] w-[60px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.goods_id_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label=" ">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column label="服务名称" min-width="600">
                            <template #default="scope">
                                <div class="flex items-center">
                                    <div class="w-[60px] h-[60px]">
                                        <el-image
                                            style="width: 60px; height: 60px"
                                            :src="scope.row.image"
                                            :fit="'cover'"
                                        />
                                    </div>

                                    <el-tooltip :content="scope.row.name" placement="top">
                                        <div class="ml-2 truncate">{{ scope.row.name }}</div>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="120" fixed="right">
                            <template #default="scope">
                                <div class="flex">
                                    <el-button
                                        type="primary"
                                        link
                                        >移除</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">资料</div>
            <div class="flex">
                <el-form-item label=" ">
                    <div class="flex">
                        <div class="mr-[40px]">
                            <el-image :src="formData.identity_portrait_image" fit="cover"  style="width: 100px;height: 100px;border-radius: 6px;" :preview-src-list="[formData.identity_portrait_image]" />
                            <div class="text-center mt-[5px] w-[100px]">
                                <span class="text-[#F56C6C]">*</span>身份证人像面
                            </div>
                            <div class="w-[100px] text-center">
                                <el-text class="mx-1" type="danger" v-if="formData?.identity_portrait_image_changed" >有修改</el-text>
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <el-image :src="formData.identity_emblem_image" fit="cover"  style="width: 100px;height: 100px;border-radius: 6px;" :preview-src-list="[formData.identity_emblem_image]" />
                            <div class="text-center mt-[5px] w-[100px]">
                                <span class="text-[#F56C6C]">*</span>身份证国徽面
                            </div>
                            <div class="text-center w-[100px]">
                                <el-text class="mx-1" type="danger" v-if="formData?.identity_emblem_image_changed" >有修改</el-text>
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <el-image :src="formData.portrait_image" fit="cover"  style="width: 100px;height: 100px;border-radius: 6px;" :preview-src-list="[formData.portrait_image]" />
                            <div class="text-center mt-[5px] w-[100px]">
                                <span class="text-[#F56C6C]">*</span>人像实拍
                            </div>
                            <div class="text-center w-[100px]">
                                <el-text class="mx-1" type="danger" v-if="formData?.portrait_image_changed" >有修改</el-text>
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <el-image :src="formData.work_image" fit="cover"  style="width: 100px;height: 100px;border-radius: 6px;" :preview-src-list="[formData.work_image]" />
                            <div class="text-center mt-[5px] w-[106px]">
                                <span class="text-[#F56C6C]">*</span>工作照（头像）
                            </div>
                            <div class="text-center w-[100px]">
                                <el-text class="mx-1" type="danger" v-if="formData?.work_image_changed" >有修改</el-text>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">证书</div>
            <div class="flex">
                <el-form-item label=" ">
                    <view class="flex">
                        <view class="mr-[20px]" v-for="(item,index) in formData.credentials_image" :key="index">
                            <el-image :src="item" fit="cover"  style="width: 100px;height: 100px;border-radius: 6px;" :preview-src-list="[item]" />
                        </view>
                     </view>
                    <div class="ml-[10px]">
                        <el-text class="mx-1" type="danger" v-if="formData?.credentials_image_changed" >有修改</el-text>
                    </div>
                </el-form-item>
            </div>
        </el-card>
    </el-form>
    <footer-btns v-if="formData.verify_status == 0">
        <el-button type="danger" @click="verify(2)">拒绝</el-button>
        <el-button type="primary" @click="verify(1)">通过</el-button>
    </footer-btns>

    <!-- 审核拒绝弹窗 -->
    <Verify
        v-if="verifyRefShow"
        ref="verifyRef"
        :id="id"
        :verify_status="2"
        @close="verifyRefShow = false"
        @confirm="router.back()"
    ></Verify>
</template>

<script lang="ts" setup>
import { apiMasterWorkerEnumLists } from '@/api/master_worker'
import { apiMasterWorkerImproveInfoDetail,apiMasterWorkerImproveInfoVerify } from '@/api/master_worker/improve_info'
import { ref, reactive, nextTick } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'
import AreaSelect from '@/components/area-select/index.vue'
import type { ElForm } from 'element-plus'
import { useMap } from '@/hooks/useMap'
import feedback from '@/utils/feedback'
import { apiAllStaffSkillLists } from '@/api/master_worker/skill'
import Verify from './components/verify.vue'

/** Data Start **/
const { obj, addressGeocoder, loadTencentMapScript } = useMap()
const route = useRoute()
const router = useRouter()
const id: any = route.query.id
const formData = ref(<any>{})
const enumLists = ref(<any>[])
const areaData = ref(<any>[])
const tableData = ref(<any>[])
const skillData = ref<Array<object>>([])
const verifyRef = shallowRef<InstanceType<typeof Verify>>()
const verifyRefShow = ref(true)
/** Data End **/

/** Methods Start **/
// 获取详情
const getMasterWorkerDetail = async (id: number): Promise<void> => {
    ;(formData.value as {}) = await apiMasterWorkerImproveInfoDetail({ id })
}
// 审核
const verify = async (verifyStatus:number): Promise<void> => {
    if (verifyStatus == 2) {
        verifyRefShow.value = true
        verifyRef.value?.open()
    }
    if (verifyStatus == 1) {
        await apiMasterWorkerImproveInfoVerify({ 'id':id,'verify_status':verifyStatus })
        router.back()
    }
}
//获取枚举列表
const getEnumLists = async (): Promise<void> => {
    enumLists.value = await apiMasterWorkerEnumLists({})
}
//获取地区数据
const getAreaData = async (): Promise<void> => {
    // areaData.value = await apiOpenCityCommonIntactLists({})
}
// 获取技能通用列表
const getSkillLists = async (): Promise<void> => {
    const res = await apiAllStaffSkillLists({})
    skillData.value = res
}
/** Methods End **/

/** LifeCycle Start **/
onMounted(async () => {
    // 请求详情 => 如果是编辑的话
    if (id) {
        await getMasterWorkerDetail(id)
        tableData.value = formData.value?.goods
        loadTencentMapScript(formData.value.latitude, formData.value.longitude)
    } 
    getEnumLists()
    getAreaData()
    getSkillLists()
})
/** LifeCycle End **/
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
