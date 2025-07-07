<template>
    <!-- #ifdef H5 -->
    <scroll-view scroll-y @scrolltolower="handelScrolltolower" :refresher-threshold="80" :refresher-enabled="true"
        @refresherpulling="refresherpulling" refresher-background="#f2f2f2" :refresher-triggered="refresherTriggered"
        @refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort"
        class="scroll-view">
    <!-- #endif -->
    <!-- #ifndef H5 -->
        <scroll-view scroll-y @scrolltolower="handelScrolltolower" :refresher-threshold="80" :refresher-enabled="true"
            @refresherpulling="refresherpulling" refresher-default-style="#f2f2f2" :refresher-triggered="refresherTriggered"
            @refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort"
            class="scroll-view">
    <!-- #endif -->
        
        <!-- #ifndef H5 -->
        <!-- 下拉的动画 -->
        <view slot="refresher"
            style="width: 100%; height: 80px; background: #F2F2F2; display: flex; align-items: center;justify-content: center;">
            <view style="position: absolute; display: flex; align-items: center;justify-content: center;width: 100%;">
                <view class="loading" :class="{'loading-load': refresherTriggered}" :style="{'transform': `rotate(${refresherRotate}deg);`}"></view>
                <view class="loading-name">{{ refresherTips }}</view>
            </view>
        </view>
        <!-- #endif -->

        <!-- 内容 -->
        <view v-show="!isEmpty">
            <view :style="{ 'padding-bottom': bottom +'rpx' }">
                <slot></slot>
                <!-- 底部触底动画 -->
                <template v-if="_refresherEnd">
                    <view class="flex justify-center p-[50rpx]">
                        <view class="loading loading-load"></view>
                        <view class="loading-name">{{ endLoadingTips }}</view>
                    </view>
                </template>
                <template v-else>
                    <view class="text-center text-muted text-base p-[50rpx]">没有更多了～</view>
                </template>
            </view>
        </view>
        
        <!-- 空状态时 -->
        <view class="empty" v-show="isEmpty">
            <u-empty :text="emptyText" :src="empty" mode="data" :icon-size="300" margin-top="0" color="#888888"></u-empty>
        </view>
        
        <!-- 返回顶部按钮 (暂时未写) -->
    </scroll-view>
</template>

<script lang="ts" setup>
    /**
     * @description 下拉组件
     * @property {String} bottom 底部高度
     * @event {Function} refresherrefresh 下拉组件时触发
     * @event {Function} handelScrolltolower 触底时出发
     * @event {Function} endSuccess 加载成功时触发
     * @event {Function} endErr 加载失败时触发
     * @event {Function} resetUpScroll 重新请求时触发
     */
    
    import { ref, nextTick, computed, onMounted } from "vue"
    
    /** Emit Start **/
    const emit = defineEmits(['up', 'delete'])
    /** Emit End **/
    
    
    /** Props Start **/
    const props = withDefaults(defineProps < {
        bottom ? : string // 底部
        empty ? : string // 空状态图片
        emptyText ? : string // 空状态文字
    } > (), {
        bottom: '40',
        empty: '',
        emptyText: '暂无内容'
    })
    /** Props End **/

    /** Data Start **/
    const param = ref({
        num: 1,
        size: 10
    })
    // 是否为空状态
    const isEmpty = ref < boolean | null > (false)
    // 触发了下拉状态
    const refresherTriggered = ref < boolean | null > (false)
    // 判断是否下拉
    const _refresherTriggered = ref < boolean | null > (false)
    // 下拉icon旋转角度
    const refresherRotate = ref < number > (0)
    // 下提示文字
    const refresherTips = ref < string > ('下拉刷新')
    // 是否还有下一页
    const isNext = ref < boolean | null > (false)
    // 底部加载提示文字
    const endLoadingTips = ref < string > ('加载中')
    // 是否触底加载
    const _refresherEnd = ref < boolean | null > (false)
    /** Data End **/


    /** Methods Start **/
    /**
     * @description 下拉控件被下拉
     */    
    const refresherpulling = (event: Event) => {
        refresherRotate.value = event.detail.dy
        if (event.detail.dy >= 100) refresherTips.value = '释放更新'
        else refresherTips.value = '下拉刷新'
    }

    /**
     * @description 下拉完成触发刷新控件
     */
    const refresherrefresh = () => {
        if (_refresherTriggered.value) return
        _refresherTriggered.value = true;
        refresherTips.value = '加载中'
        //界面下拉触发，triggered可能不是true，要设为true
        if (!refresherTriggered.value) {
            refresherTriggered.value = true;
            // 手动下拉加载
            param.value.num = 1;
            emit('up', param.value)
        }
    }

    /**
     * @description 完成下拉复位控件
     */
    const refresherrestore = () => {
        refresherTriggered.value = false;
        _refresherTriggered.value = false;
        refresherRotate.value = 0;
        refresherTips.value = '下拉刷新'
    }
    
    /**
     * @description 下拉被终止控件
     */
    const refresherabort = () => {
        refresherTriggered.value = false;
        _refresherTriggered.value = false;
        refresherRotate.value = 0
    }
    
    /**
     * @description 触底
     */
    const handelScrolltolower = () => {
        console.log('触底')
        if ( isNext.value ) {
            _refresherEnd.value = true
            param.value.num = (param.value.num + 1);
            emit('up', param.value)
        }
    }
    
    /**
     * @description 加载完毕重置数据等
     * @param { count } 总长度
     * @return { Function }
     */
    const endSuccess = (count: number | string) => {
        
        // 下拉加载提示文字
        refresherTips.value = '加载成功'
        // 触底加载文字
        endLoadingTips.value = '加载成功'
        
        // 延迟关闭，肉眼能看到加载完毕效果
        setTimeout(() => {
            // 下拉加载图标
            refresherTriggered.value = false; //触发onRestore，并关闭刷新图标
            // 下拉加载
            _refresherTriggered.value = false;
            // 触底加载
            _refresherEnd.value = false
            // 触底加载文字
            endLoadingTips.value = '加载中'
            // 为空
            if (count === 0) isEmpty.value = true
            else isEmpty.value = false
        }, 400)
        
        // 算出是否有下一页
        const size = param.value.num * param.value.size;
        if ( size < count ) {
            isNext.value = true
        } else {
            isNext.value = false
        }
        uni.hideLoading()
    }
    
    /**
     * @description 加载失败
     */
    const endErr = () => {
        setTimeout(() => {
            // 下拉加载图标
            refresherTriggered.value = false; //触发onRestore，并关闭刷新图标
            // 下拉加载
            _refresherTriggered.value = false;
            // 触底加载
            _refresherEnd.value = false
            // 触底加载文字
            endLoadingTips.value = '加载中'
            // 为空
            console.log('为空？？')
            isEmpty.value = true
        }, 400)
        
        // 下拉加载提示文字
        refresherTips.value = '加载失败'
        // 触底加载文字
        endLoadingTips.value = '加载失败'
        uni.hideLoading()
    }
    
    /**
     * @description 重新加载
     */
    const resetUpScroll = () => {
        uni.showLoading({
            title: '载入中'
        })
        emit('up', param.value)
    }
    
    /**
     * @description 重置表单
     */
    const resetParams = () => {
        param.value.num = 1;
        param.value.size = 10;
    }
    /** Methods End **/
    
    /** Life Cycle Start **/
    onMounted(() => {
        nextTick(() => {
            emit('up', param.value)
        })
    })
    /** Life Cycle End **/


    /** DefineExpose Start **/
    defineExpose({
        endSuccess,
        endErr,
        resetUpScroll,
        resetParams
    })
    /** DefineExpose End **/
</script>

<style lang="scss" scoped>
    // scroll-view {
    //     flex: 1;
    //     overflow: scroll;
    //     height: 100%;
    //     box-sizing: border-box;
    // }
    
    // .empty {
    //     height: 80%;
    // }

    // .loading {
    //     border: 6rpx solid $color-bg;
    //     border-radius: 50%;
    //     border-right: 6rpx solid $color-primary;
    //     border-bottom: 6rpx solid $color-primary;
    //     border-left: 6rpx solid $color-primary;
    //     width: 48rpx;
    //     height: 48rpx;
    // }

    // .loading-name {
    //     margin-left: 30rpx;
    //     color: $color-primary;
    //     font-size: $font-size-sm;
    // }

    // // 执行动画
    // .loading-load {
    //     animation: load .5s linear infinite;
    // }

    // @keyframes load {
    //     0% {
    //         transform: rotate(0deg);
    //     }

    //     100% {
    //         transform: rotate(360deg);
    //     }
    // }
</style>
