export default () => ({
    title: '标题栏',
    name: 'title-bar',
    content: {
        enabled: 1, // 是否启用
        title: '', // 标题
        subtitle: '', // 副标题
        show_right_btn: 1, // 是否显示右侧按钮
    },
    styles: {
        root_bg_color: '', // 根容器背景色
        title_color: '#000000', // 标题颜色}
        title_size: 32, // 标题大小
        subtitle_color: '#888888', // 副标题颜色
        subtitle_size: 24, // 副标题大小
        padding_top: 0,
        padding_horizontal: 0,
        padding_bottom: 0
    }
})
