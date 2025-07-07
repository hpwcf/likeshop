<template>
    <view class="uploader-container flex wrap">
        <u-upload
            @on-change="handleCallback"
            :action="action"
            :header="{ token: token, version: '1.0.0' }"
            :deletable="deletable"
            :max-count="maxUpload"
            :showProgress="showProgress"
            @on-remove="remove"
            :multiple="mutiple"
            :custom-btn="customBtn"
            :width="width"
            :height="height"
            ref="uploadRef"
			:file-list="fileList"
			:image-mode="imageMode"
			@on-error="handleError"
        >
			<template v-slot:addBtn>
				<view
				    class="uplader-upload u-flex justify-center"
					:style="{'width':width+'rpx','height':height+'rpx'}"
				    hover-class="slot-btn__hover"
				    hover-stay-time="150"
					v-if="customBtn"
				>	
					<view class="text-center text-[#bbb]">
						<u-icon size="48" color="#dcdee0" name="camera" />
						<view class="xs mt-[10rpx]">
						    {{ fileList.length >= 1 ? fileList.length + '/' + maxUpload : tips }}
						</view>
					</view>
				</view>
			</template>
            
        </u-upload>
    </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/util'
import config from '@/config'

const userStore = useUserStore()

/** Emit Start **/
const emit = defineEmits(['update:modelValue'])
/** Emit End **/

/** Props Start **/
const props = withDefaults(
    defineProps<{
        mutiple?: boolean // 默认不允许多选图片
        maxUpload?: number // 限制上传文件数量
        width?: number // upload显示的宽
        height?: number // upload显示的高
        deletable?: boolean // 是否可删除
        tips?: string //提示
        showProgress?: boolean // 是否显示进度条
		modelValue?: any
		imageMode?: string //预览图片等显示模式
		customBtn?: boolean //自定义选择图片的按钮
    }>(),
    {
        mutiple: false,
        maxUpload: 1,
        width: 160,
        height: 160,
        deletable: true,
        tips: '上传图片',
        showProgress: false,
        modelValue: null,
		customStyle: {},
		imageMode: 'aspectFill',
        customBtn: true,
    }
)
/** Props End **/

/** Data Start **/
const action = ref<string | null>('')
const token = ref<string | null>('')
const fileList = ref<Array<any>>([])
const uploadRef = shallowRef()

// const versions = ref<string | null>(version)
/** Data End **/

/** Methods Start **/
/**
 * @param { params } 上传返回值
 * @return { void }
 * @description 上传，不管成不成功都返回数据｜提示
 */
const handleCallback = (params: any) => {
    toast(JSON.parse(params.data).msg)

    if (JSON.parse(params.data).code == 1) {
		fileList.value.push({url:JSON.parse(params.data).data.uri})
		let returnValue = []
		if (!props.mutiple) {
			returnValue = fileList.value[0].url
		} else {
			fileList.value.forEach((item,index) => {
				returnValue.push(item.url)
			})
		}
        
        emit('update:modelValue', returnValue)
    }
}

//上传错误
const handleError = (res, index, lists, name) => {
	uploadRef.value.remove(index)
}

/**
 * @param { event } 索引值
 * @return { void }
 * @description 删除一个图片
 */
const remove = (event: number | string) => {
    fileList.value.splice(event, 1)
	let returnValue: any = []
	if (!props.mutiple) {
		returnValue = undefined
	} else {
		fileList.value.forEach((item,index) => {
			returnValue.push(item.url)
		})
	}
	
	emit('update:modelValue', returnValue)
}
/** Methods End **/

/** Life Cycle Start **/
onMounted(() => {
    action.value = `${import.meta.env.VITE_APP_BASE_URL}/${config.urlPrefix}/Upload/image`
    token.value = userStore.token
})


watch(
    () => props.modelValue,
    (value) => {
        if (props.modelValue) {
        	if (props.mutiple) {
        		props.modelValue.forEach((item,index) => {
        			fileList.value.push({url:item})
        		})
        	} else {
        		fileList.value.push({url:props.modelValue})
        	}
        }
    },
    {
        immediate: true
    }
)
/** Life Cycle End **/
</script>

<style lang="scss" scoped>
.uploader-container {
    .uplader-upload {
        position: relative;
        border: 2px dashed #e5e5e5;
        background-color: #ffffff;

        // > view {
        //     color: #bbb;
        // }
    }
}

::v-deep .u-upload .u-list-item {
	margin: 0 !important;
}
</style>
