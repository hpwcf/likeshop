<template>
    <widget-root :styles="styles">
        <div
            class="rubik"
            :style="{
                margin: `${styles.image_gap}px`,
            }"
        >
            <div class="rubik-item1" v-if="content.style == 1">
                <div
                    class="item-image"
                    :style="{ margin: `${styles.image_gap}px` }"
                    v-if="imgLists[0] && imgLists[0].url"
                >
                    <el-image fit="cover" :src="getImageUrl(imgLists[0].url)"></el-image>
                </div>
                <el-image v-else style="height: 375px; width: 100%">
                    <template #error>
                        <div class="flex justify-center items-center w-full h-full">
                            <Icon name="el-icon-Picture" size="40" color="#999"></Icon>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="rubik-item2" v-if="content.style == 2">
                <div
                    class="item-image"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{ margin: `${styles.image_gap}px` }"
                >
                    <el-image fit="cover" :src="getImageUrl(item.url)" v-if="item && item.url"></el-image>
                    <el-image v-else style="height: 188px; width: 100%">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item3" v-if="content.style == 3">
                <div
                    class="item-image"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{ margin: `${styles.image_gap}px` }"
                >
                    <el-image fit="cover" :src="getImageUrl(item.url)" v-if="item && item.url"></el-image>
                    <el-image v-else style="height: 125px; width: 100%">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item4" v-if="content.style == 4">
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        height: '188px',
                        top: 0,
                        left: 0
                    }"
                >
                    <el-image fit="cover" :src="imgLists[0] && getImageUrl(imgLists[0].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        height: '94px',
                        top: 0,
                        left: '50%'
                    }"
                >
                    <el-image fit="cover" :src="imgLists[1] && getImageUrl(imgLists[1].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        height: '94px',
                        top: '94px',
                        left: '50%'
                    }"
                >
                    <el-image fit="cover" :src="imgLists[2] && getImageUrl(imgLists[2].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item5" v-if="content.style == 5">
                <div class="item-image" v-for="(item, index) in imgLists" :key="index">
                    <el-image fit="cover" :src="item && getImageUrl(item.url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item6" v-if="content.style == 6">
                <div
                    class="item-image"
                    :style="{
                        width: '100%',
                        height: '94px',
                        top: 0,
                        left: 0
                    }"
                >
                    <el-image fit="cover" :src="imgLists[0] && getImageUrl(imgLists[0].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        height: '94px',
                        top: '94px',
                        left: 0
                    }"
                >
                    <el-image fit="cover" :src="imgLists[1] && getImageUrl(imgLists[1].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        height: '94px',
                        top: '94px',
                        left: '50%'
                    }"
                >
                    <el-image fit="cover" :src="imgLists[2] && getImageUrl(imgLists[2].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type {PropType} from 'vue'
import type options from './options'
import useAppStore from "@/stores/modules/app";
import WidgetRoot from '../widget-root.vue'

type OptionsType = ReturnType<typeof options>
const props = defineProps({
    content: {
        type: Object as PropType<OptionsType['content']>,
        default: () => ({})
    },
    styles: {
        type: Object as PropType<OptionsType['styles']>,
        default: () => ({})
    }
})
const {getImageUrl} = useAppStore()

const imgLists = computed(() => props.content.data || [])
</script>

<style lang="scss" scoped>
.rubik {
    .el-image {
        display: block;
    }

    .rubik-item2 {
        display: flex;

        .item-image {
            flex: 1 1 auto;
            width: 50%;
        }
    }

    .rubik-item3 {
        display: flex;

        .item-image {
            flex: 1 1 auto;
            width: 33.3%;
        }
    }

    .rubik-item4,
    .rubik-item6 {
        position: relative;
        width: 100%;
        height: 190px;

        .item-image {
            position: absolute;

            .el-image {
                height: 100%;
            }
        }
    }

    .rubik-item5 {
        display: flex;
        flex-wrap: wrap;

        .item-image {
            flex: 1 1 auto;
            width: 50%;
            height: 94px;

            .el-image {
                height: 100%;
            }
        }
    }
}
</style>
