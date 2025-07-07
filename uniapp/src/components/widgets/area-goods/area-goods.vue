<template>
    <widget-root :styles="styles">
        <div class="goods-group">
            <div
                class="goods-lists gap-y-2"
                :style="{
                    'row-gap': `${styles.goods_vertical}px`,
                    'column-gap': `${styles.goods_horizontal}px`
                }"
                :class="{
                    larger: content.goods_type == 4,
                    perline: content.goods_type == 2,
                    swiper: content.goods_type == 3,
                    lists: content.goods_type == 1
                }"
            >
                <div
                    class="goods-wrap"
                    v-for="(item, index) in content.goods_list"
                    :key="index"
                    :style="{
                        background: styles.component_bg_color,
                        'border-radius': `${styles.border_top_radius}px ${styles.border_top_radius}px ${styles.border_bottom_radius}px ${styles.border_bottom_radius}px`
                    }"
                    @click="router.navigateTo('/pages/goods/index?id=' + item.id)"
                >
                    <div class="goods-item">
                        <div
                            class="goods-image overflow-hidden flex-none"
                            :style="{ '--img-radius': `${styles.image_radius}px` }"
                        >
                            <u-image :src="item?.image" width="100%" height="100%" fit="cover">
                            </u-image>
                        </div>
                        <div
                            class="goods-info"
                            :class="{
                                'p-2': content.goods_type === 1,
                                'mt-2': content.goods_type === 2
                            }"
                        >
                            <!--    非大图样式下显示    -->
                            <template v-if="content.goods_type !== 4">
                                <div
                                    v-if="content.show_title"
                                    class="mb-1 name"
                                    :style="{ color: styles.title_color }"
                                >
                                    <div
                                        :class="
                                            content.style == 3 ? 'line-clamp-2' : 'line-clamp-1'
                                        "
                                    >
                                        {{ item.name || '' }}
                                    </div>
                                </div>
                                <div
                                    v-if="content.show_server && content.goods_type != 3"
                                    class="text-xs mb-1"
                                    :style="{ color: styles.server_color }"
                                    :class="{ 'mt-4': content.goods_type === 1 }"
                                >
                                    服务时间：<span class="text-[#59b870] font-medium">{{
                                        item.min_duration || '60'
                                    }}</span
                                    >分钟
                                </div>
                            </template>

                            <div class="flex price-btn items-center justify-between">
                                <div class="flex items-baseline">
                                    <price
                                        v-if="content.show_price"
                                        mainSize="32rpx"
                                        minorSize="26rpx"
                                        fontWeight="500"
                                        :color="styles.price_color"
                                        :content="item.price"
                                    />
                                    <price
                                        v-if="
                                            content.show_scribing_price &&
                                            content.goods_type != 3 &&
                                            item.scribing_price != 0
                                        "
                                        mainSize="24rpx"
                                        minorSize="24rpx"
                                        fontWeight="400"
                                        :lineThrough="true"
                                        :color="styles.scribing_price_color"
                                        :content="item.scribing_price"
                                    />
                                </div>
                                <div
                                    v-if="content.show_sales && content.goods_type !== 1"
                                    class="text-muted text-xs flex-none"
                                >
                                    已售{{ item.order_num }}
                                </div>
                            </div>

                            <!--    大图样式下显示    -->
                            <template v-if="content.goods_type === 4">
                                <div
                                    v-if="content.show_server"
                                    class="text-xs mt-3"
                                    :style="{ color: styles.server_color }"
                                >
                                    服务时间：<span class="text-[#59b870] font-medium">{{
                                        item.min_duration || '60'
                                    }}</span
                                    >分钟
                                </div>
                                <div class="flex justify-between items-center mt-3">
                                    <div
                                        v-if="content.show_title"
                                        class="mb-1 name"
                                        style="width: 250px"
                                        :style="{ color: styles.title_color }"
                                    >
                                        <div class="line-clamp-2">
                                            {{
                                                item.name || ''
                                            }}
                                        </div>
                                    </div>
                                    <div
                                        class="buy-btn text-xs"
                                        :style="{ 'border-radius': `${styles.btn_radius}px` }"
                                    >
                                        {{ content.btn_text }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!--    单列样式下显示    -->
                    <div
                        class="flex justify-between items-center mt-2"
                        v-if="content.goods_type == 1"
                    >
                        <div class="text-muted text-xs" v-if="content.show_sales">
                            超{{ item.order_num }}人选择
                        </div>
                        <div
                            class="buy-btn text-xs"
                            :style="{ 'border-radius': `${styles.btn_radius / 2}px` }"
                        >
                            {{ content.btn_text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </widget-root>
</template>

<script setup lang="ts">
import { useRouter } from 'uniapp-router-next'
import Price from '@/components/other_price/price.vue'

const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    }
})

const router = useRouter()
console.log(props.content.goods_list, props.content)
</script>

<style lang="scss" scoped>
.goods-group {
    overflow: hidden;

    .goods-lists {
        display: grid;
        overflow: hidden;

        &.larger {
            row-gap: 20rpx !important;
            .goods-wrap {
                .goods-item {
                    .goods-info {
                        padding: 10px;
                        border-radius: 0 0 12px 12px;
                    }

                    .goods-image {
                        height: 660rpx;
                        overflow: hidden;
                        border-radius: var(--img-radius) var(--img-radius) 0 0;
                    }
                }
            }
        }

        &.perline {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            //padding: 0 10px;
            column-gap: 10px;

            .goods-wrap {
                .goods-item {
                    padding: 10px;

                    .goods-image {
                        width: 100%;
                        height: 312rpx;
                        overflow: hidden;
                        border-radius: var(--img-radius);
                    }
                }
            }
        }

        &.swiper {
            display: flex;
            column-gap: 10px;

            .goods-wrap {
                flex: 0 0 40%;
                width: 40%;

                .goods-image {
                    width: 288rpx;
                    height: 288rpx;
                    overflow: hidden;
                    border-radius: var(--img-radius) var(--img-radius) 0 0;
                }

                .goods-info {
                    padding: 10px;
                    border-radius: 0 0 12px 12px;
                }
            }
        }

        &.lists {
            .goods-wrap {
                padding: 10px;

                .goods-item {
                    flex-direction: row;

                    .goods-image {
                        width: 174rpx;
                        height: 174rpx;
                        //padding-top: 120px;
                        overflow: hidden;
                        border-radius: var(--img-radius);
                    }

                    .goods-info {
                        position: relative;
                        padding: 0rpx 20rpx;

                        .name {
                            font-size: 14px;
                            font-weight: 500;
                        }

                        .price-btn {
                            position: absolute;
                            right: 10px;
                            left: 10px;
                            bottom: 10px;
                        }
                    }
                }
            }
        }

        .goods-wrap {
            overflow: hidden;

            .goods-item {
                overflow: hidden;
                display: flex;
                flex-direction: column;

                .goods-image {
                    position: relative;
                    width: 100%;
                    //padding-top: 100%;

                    .el-image {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        width: 100%;

                        .image-error {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }

        .buy-btn {
            flex: none;
            background: #59b870;
            //height: 64rpx;
            padding: 12rpx 24rpx;
            font-weight: bold;
            color: #fff;
            border-radius: 24rpx;
            border: 1px solid transparent;
        }
    }
}
</style>
