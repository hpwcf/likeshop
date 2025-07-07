<template>
    <div class="cube-layout">
        <div class="layout-item1" v-if="facade === 1">
            <div class="item-image" :class="{ active: current === 0 }">
                <el-image
                    v-if="imgLists[0]?.url"
                    fit="cover"
                    :src="getImageUrl(imgLists[0].url)"
                ></el-image>
                <div class="item-tips muted" v-else>
                    <span>750x不限高度</span>
                </div>
            </div>
        </div>
        <div class="layout-item2" v-if="facade === 2">
            <div
                class="item-image"
                v-for="(item, index) in imgLists"
                :key="index"
                :class="{ active: current === index }"
                @click="changeCurrent(index)"
            >
                <el-image fit="cover" :src="getImageUrl(item.url)" v-if="item?.url"></el-image>
                <div class="item-tips muted" v-else>
                    <span>375x不限高度</span>
                </div>
            </div>
        </div>
        <div class="layout-item3" v-if="facade === 3">
            <div
                class="item-image"
                v-for="(item, index) in imgLists"
                :key="index"
                :class="{ active: current === index }"
                @click="changeCurrent(index)"
            >
                <el-image fit="cover" :src="getImageUrl(item.url)" v-if="item?.url"></el-image>
                <div class="item-tips muted" v-else>
                    <span>250x不限高度</span>
                </div>
            </div>
        </div>
        <div class="layout-item4" v-if="facade === 4">
            <div
                class="item-image"
                :class="{ active: current === 0 }"
                @click="changeCurrent(0)"
                :style="{ width: '205px', height: '205px', top: 0, left: 0 }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[0]?.url)"
                    v-if="imgLists[0]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>375x375</span></div>
            </div>
            <div
                class="item-image"
                :class="{ active: current === 1 }"
                @click="changeCurrent(1)"
                :style="{ width: '205px', height: '103px', top: 0, left: '205px' }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[1]?.url)"
                    v-if="imgLists[1]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>375x188</span></div>
            </div>
            <div
                class="item-image"
                :class="{ active: current === 2 }"
                @click="changeCurrent(2)"
                :style="{ width: '205px', height: '103px', top: '102px', left: '205px' }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[2]?.url)"
                    v-if="imgLists[2]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>375x188</span></div>
            </div>
        </div>
        <div class="layout-item5" v-if="facade === 5">
            <div
                class="item-image"
                v-for="(item, index) in imgLists"
                :key="index"
                :class="{ active: current === index }"
                @click="changeCurrent(index)"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(item.url)"
                    v-if="item?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>188x188</span></div>
            </div>
        </div>
        <div class="layout-item6" v-if="facade === 6">
            <div
                class="item-image"
                :class="{ active: current === 0 }"
                @click="changeCurrent(0)"
                :style="{ width: '410px', height: '105px', top: 0, left: 0 }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[0]?.url)"
                    v-if="imgLists[0]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>750x188</span></div>
            </div>
            <div
                class="item-image"
                :class="{ active: current === 1 }"
                @click="changeCurrent(1)"
                :style="{ width: '205px', height: '105px', top: '105px', left: 0 }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[1]?.url)"
                    v-if="imgLists[1]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>375x188</span></div>
            </div>
            <div
                class="item-image"
                :class="{ active: current === 2 }"
                @click="changeCurrent(2)"
                :style="{ width: '205px', height: '105px', top: '105px', left: '205px' }"
            >
                <el-image
                    fit="cover"
                    :src="getImageUrl(imgLists[2]?.url)"
                    v-if="imgLists[2]?.url"
                ></el-image>
                <div class="item-tips muted" v-else><span>375x188</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import useAppStore from "@/stores/modules/app";

const emit = defineEmits(['change'])

const props = defineProps<{
    modelValue: any
    facade: number
}>()

const { getImageUrl } = useAppStore()
const imgLists = useVModel(props, 'modelValue')
const current = ref(0)

function changeCurrent(val: number) {
    current.value = val
    emit('change', val)
}
</script>

<style lang="scss" scoped>
.cube-layout {
    .item-tips {
        background: #fff;
        border: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .item-image {
        cursor: pointer;
        &.active {
            .el-image {
                position: relative;
                z-index: 10;
                border: 1px solid var(--el-color-primary);
            }
            .item-tips {
                position: relative;
                z-index: 10;
                border: 1px solid var(--el-color-primary);
            }
        }
        .el-image {
            width: 100%;
            box-sizing: border-box;
            height: auto;
        }
    }
    .layout-item1 {
        text-align: center;
        font-weight: 400;
        width: 410px;
        .item-tips {
            width: 100%;
            height: 168px;
            line-height: 168px;
        }
    }
    .layout-item2 {
        width: 410px;
        display: flex;
        .item-image {
            flex: none;
            width: 205px;
            .item-tips {
                width: 205px;
                height: 168px;
            }
        }
    }
    .layout-item3 {
        display: flex;
        width: 410px;
        .item-image {
            flex: none;
            width: 136.6px;
            .item-tips {
                width: 136.6px;
                height: 140px;
            }
        }
    }
    .layout-item4 {
        position: relative;
        width: 410px;
        height: 205px;
        .item-image {
            position: absolute;
            .el-image {
                height: 100%;
            }
            .item-tips {
                width: 205px;
                height: 100%;
            }
        }
    }
    .layout-item5 {
        width: 410px;
        height: 205px;
        display: flex;
        flex-wrap: wrap;
        .item-image {
            flex: none;
            width: 205px;
            height: 105px;
            .el-image {
                height: 100%;
            }
            .item-tips {
                width: 205px;
                height: 105px;
            }
        }
    }
    .layout-item6 {
        position: relative;
        width: 410px;
        height: 205px;
        .item-image {
            position: absolute;
            .el-image {
                height: 100%;
            }
            &:first-of-type {
                .item-tips {
                    width: 410px;
                }
            }
            .item-tips {
                width: 205px;
                height: 100%;
            }
        }
    }
}
</style>