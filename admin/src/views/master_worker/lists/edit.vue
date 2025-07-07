<template>
    <el-card shadow="never" class="!border-none">
        <el-page-header :content="id ? '编辑师傅' : '新增师傅'" @back="$router.back()" />
    </el-card>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" inline>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none" v-if="id">
            <div class="flex justify-between items-center pl-[80px] pr-[100px]">
                <div class="flex items-center">
                    <el-avatar :size="60" :src="formData.work_image" fit="cover" />
                    <div class="ml-2">
                        <div class="truncate">{{ formData.name }}<span v-if="!formData.status" class="text-[#f63737]">（冻结）</span></div>
                        <div class="text-sm text-[#909399]">工号：{{ formData.sn }}</div>
                    </div>
                </div>
                <div class="flex">
                    <div class="mr-[80px]">
                        <div class="mb-[5px]">保证金</div>
                        <div class="flex items-center">
                            <span class="mr-[5px]">{{ formData.staff_deposit }}</span>
                            <el-button type="primary" link @click="handleAdjust(1,formData.staff_deposit)">编辑</el-button>
                        </div>
                    </div>
                    <div>
                        <div class="mb-[5px]">佣金</div>
                        <div class="flex items-center">
                            <span class="mr-[5px]">{{ formData.staff_earnings }}</span>
                            <el-button type="primary" link @click="handleAdjust(2,formData.staff_earnings)">编辑</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">基本信息</div>
            <div class="flex">
                <el-form-item label="手机号:" prop="mobile">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.mobile"
                        placeholder="请输入手机号"
                    />
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.name"
                        placeholder="真实姓名"
                    />
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="年龄:" prop="age">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.age"
                        placeholder="年龄"
                        type="number"
                    />
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio v-model="formData.sex" name="1" :label="1">男</el-radio>
                    <el-radio v-model="formData.sex" name="2" :label="2">女</el-radio>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="身份证号码:" prop="identity_number">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.identity_number"
                        placeholder="身份证号码"
                    />
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
                </el-form-item>
                <el-form-item label="地址:" prop="district_id">
                    <area-select
                        class="ls-input w-56"
                        v-model:province="formData.province_id"
                        v-model:city="formData.city_id"
                        v-model:district="formData.district_id"
                        :data="areaData"
                    />
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="详细地址:">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.address"
                        placeholder="请输入详细地址 例：1号楼1单元203室"
                    />
                </el-form-item>
                <el-button type="primary" @click="search">搜索地图</el-button>
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
                        @change="skillChange"
                    >
                        <el-option
                            v-for="item in skillData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="服务项目:" prop="goods_id">
                    <el-button type="primary" v-if="!formData.skill_id" @click="serviceTips">选择服务</el-button>
                    <service-popup
                        v-else
                        v-model:goodsId="formData.goods_id"
                        v-model:selectData="tableData"
                        :skill_id="formData.skill_id"
                        :key="'goods_id'+formData.skill_id"
                    >
                        <template #popup>
                            <el-button type="primary" >选择服务</el-button>
                        </template>
                    </service-popup>
                    <el-button v-if="tableData.length > 0" type="primary" link @click="handleAllDeleteItem()">清空</el-button>
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
                                        @click="handleDeleteItem(scope.$index)"
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
                            <material-picker
                                v-model="formData.identity_portrait_image"
                                :limit="1"
                            ></material-picker>
                            <div class="text-center mt-[5px]">
                                <span class="text-[#F56C6C]">*</span>身份证人像面
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <material-picker
                                v-model="formData.identity_emblem_image"
                                :limit="1"
                            ></material-picker>
                            <div class="text-center mt-[5px]">
                                <span class="text-[#F56C6C]">*</span>身份证国徽面
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <material-picker
                                v-model="formData.portrait_image"
                                :limit="1"
                            ></material-picker>
                            <div class="text-center mt-[5px]">
                                <span class="text-[#F56C6C]">*</span>人像实拍
                            </div>
                        </div>
                        <div class="mr-[40px]">
                            <material-picker
                                v-model="formData.work_image"
                                :limit="1"
                            ></material-picker>
                            <div class="text-center mt-[5px]">
                                <span class="text-[#F56C6C]">*</span>工作照（头像）
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
                    <material-picker v-model="formData.credentials_image" :limit="6"></material-picker>
                </el-form-item>
            </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px" class="!border-none">
            <div class="font-bold text-[20px] mb-[30px]">服务信息</div>
            <div class="flex">
                <el-form-item label="工作状态:" prop="work_status">
                    <el-select v-model="formData.work_status" placeholder="请选择" class="ls-input">
                        <el-option label="接单中" :value="1"></el-option>
                        <el-option label="休息中" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务状态:" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择" class="ls-input">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="冻结" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="flex">
                <el-form-item label="排序:" prop="sort">
                    <el-input
                        class="ls-input w-56"
                        v-model="formData.sort"
                        placeholder="排序"
                        type="number"
                    />
                </el-form-item>
            </div>
        </el-card>
    </el-form>
    <footer-btns>
        <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
    </footer-btns>

    <adjust-amount
        v-if="showAdjust"
        ref="adjustRef"
        @close="showAdjust = false"
        :id="id"
        :type="adjustInfo.type"
        :value="adjustInfo.amount"
        @success="getMasterWorkerDetail(id)"
    ></adjust-amount>
</template>

<script lang="ts" setup>
import {
    apiMasterWorkerAdd,
    apiMasterWorkerEdit,
    apiMasterWorkerDetail,
    apiMasterWorkerEnumLists
} from '@/api/master_worker'
import { ref, reactive, nextTick } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'
import AreaSelect from '@/components/area-select/index.vue'
import ServicePopup from './components/service-popup.vue'
import type { ElForm } from 'element-plus'
import MaterialPicker from '@/components/material/picker.vue'
import { useMap } from '@/hooks/useMap'
import feedback from '@/utils/feedback'
import { apiOpenCityCommonIntactLists } from '@/api/setting/open_city'
import { apiAllStaffSkillLists } from '@/api/master_worker/skill'
import AdjustAmount from './components/adjust-amount.vue'

/** Interface Start **/
interface formDataObj {
    mobile: string //手机号码
    name: string //姓名
    sex: number | string //性别
    age: number | string //年龄
    identity_number: string //身份证号码
    education?: number | string //学历
    nation?: number | string //民族
    province_id: number | string //省
    city_id: number | string //市
    district_id: number | string //区
    address: string //详细地址
    longitude: string //经度
    latitude: string //纬度
    skill_id: number | string //服务技能
    goods_id: Array<any> //服务项目
    identity_portrait_image: string //身份证人像面
    identity_emblem_image: string //身份证国徽面
    portrait_image: string //人像实拍
    work_image: string //工作照
    credentials_image: Array<any> //证书
    work_status?: number | string //工作状态
    status?: number | string //服务状态
    sort?: number | string //排序
    sn?: string //工号
    staff_deposit?: number //保证经
    staff_earnings?: number //佣金
}
type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
/** Interface End **/

/** Data Start **/
const { obj, addressGeocoder, loadTencentMapScript } = useMap()
const route = useRoute()
const router = useRouter()
const id: any = route.query.id
const formData = ref<formDataObj>({
    mobile: '', //手机号码
    name: '', //姓名
    sex: 1, //性别
    age: '', //年龄
    identity_number: '', //身份证号码
    education: '', //学历
    nation: '', //民族
    province_id: '', //省
    city_id: '', //市
    district_id: '', //区
    address: '', //详细地址
    longitude: '', //经度
    latitude: '', //纬度
    skill_id: '', //服务技能
    goods_id: [], //服务项目
    identity_portrait_image: '', //身份证人像面
    identity_emblem_image: '', //身份证国徽面
    portrait_image: '', //人像实拍
    work_image: '', //工作照
    credentials_image: [], //证书
    work_status: '1', //工作状态
    status: '1', //服务状态
    sort: 0, //排序
    sn: '',
    staff_deposit: 0.00,
    staff_earnings: 0.00
})
// 表单娇艳规则
const rules = reactive<object>({
    mobile: [
        { required: true, message: '请输入手机号', trigger: ['blur'] },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号码输入有误', trigger: ['blur'] }
    ],
    name: [{ required: true, message: '请输入师傅名称', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: ['blur', 'change'] }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    identity_number: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
    district_id: [{ required: true, message: '请选择地区', trigger: ['blur', 'change'] }],
    skill_id: [{ required: true, message: '请选择服务技能', trigger: ['blur', 'change'] }],
    goods_id: [{ required: true, message: '请选择服务项目', trigger: ['blur', 'change'] }],
    work_status: [{ required: true, message: '请选择工作状态', trigger: ['blur', 'change'] }],
    status: [{ required: true, message: '请选择服务状态', trigger: ['blur', 'change'] }]
})
const enumLists = ref(<any>[])
const areaData = ref(<any>[])
const tableData = ref(<any>[])
const skillData = ref<Array<object>>([])
const showAdjust = ref(false)
const adjustRef = shallowRef<InstanceType<typeof AdjustAmount>>()
const adjustInfo = ref<any>([])
/** Data End **/

/** Methods Start **/
// 获取详情
const getMasterWorkerDetail = async (id: number): Promise<void> => {
    ;(formData.value as {}) = await apiMasterWorkerDetail({ id })
}
// 添加师傅
const handleMasterWorkerAdd = async (): Promise<void> => {
    await apiMasterWorkerAdd({ ...formData.value })
    router.back()
}
// 编辑师傅
const handleMasterWorkerEdit = async (): Promise<void> => {
    await apiMasterWorkerEdit({ ...formData.value })
    router.back()
}
// 提交数据
const onSubmit = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.validate((valid): boolean | undefined => {
        if (!valid) return false
        if (!id) handleMasterWorkerAdd()
        else handleMasterWorkerEdit()
    })
}
//获取枚举列表
const getEnumLists = async (): Promise<void> => {
    enumLists.value = await apiMasterWorkerEnumLists({})
}
//获取地区数据
const getAreaData = async (): Promise<void> => {
    areaData.value = await apiOpenCityCommonIntactLists({})
}
// 获取技能通用列表
const getSkillLists = async (): Promise<void> => {
    const res = await apiAllStaffSkillLists({})
    skillData.value = res
}
//切换服务技能
const skillChange = (e) => {
    //清空服务项目
    formData.value.goods_id = []
    tableData.value = []
}
//搜索地址
const search = async () => {
    if (!formData.value.province_id || !formData.value.city_id || !formData.value.district_id) {
        feedback.msgWarning('请选择省市区')
        return 
    }
    feedback.loading('地图加载中...')
    await addressGeocoder(
        formData.value.province_id,
        formData.value.city_id,
        formData.value.district_id,
        formData.value.address
    )
    feedback.closeLoading()
}
//选择服务提示
const serviceTips = () => {
    feedback.msgWarning('请选择服务技能')
}
//删除服务项目
const handleDeleteItem = (index: number) => {
    formData.value.goods_id.splice(index, 1)
    tableData.value.splice(index, 1)
}
//删除所有服务项目
const handleAllDeleteItem = () => {
    formData.value.goods_id = []
    tableData.value = []
}
//调整账户金额
const handleAdjust = async (type:number,amount:number | undefined) => {
    adjustInfo.value = {'type':type,'amount':amount}
    showAdjust.value = true
    await nextTick()
    adjustRef.value?.open()
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

watch(
    () => obj,
    (val: Record<string, string>) => {
        Object.keys(val).forEach((key) => {
            let objValue = val[key] as any
            if (key == 'province_id' || key == 'city_id' || key == 'district_id') {
                objValue = parseInt(objValue)
            }
            formData.value[key] = objValue
        })
        console.log('formData',formData.value)
    },
    { deep: true }
)

nextTick(() => {
    formRef.value?.resetFields()
})
/** LifeCycle End **/
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
