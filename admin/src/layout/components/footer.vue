<template>
    <footer class="layout-footer bg-[#f0f1f3] text-center">
        <div class="p-2 text-xs text-tx-secondary max-w-[900px] mx-auto">
            <div>
                <a class="mr-[30px]" href="https://www.likeadmin.cn/" target="_blank">官网</a>
                <!-- <a class="mx-[30px]" href="https://www.likeadmin.cn/doc/3/17" target="_blank"
                    >文档</a
                > -->
                <a href="https://gitee.com/likeadmin/likeadmin_php" target="_blank">Gitee</a>
            </div>
            <div class="my-[10px]">Copyright © 2022 粤ICP备2022147728号</div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/modules/app'

const appStore = useAppStore()
const copyright = computed(() => appStore.config.copyright_config || [])
</script>
