export default () => ({
    title: '导航菜单',
    name: 'nav',
    content: {
        enabled: 1,

        navigator_type: 1, // 导航样式 1-图+文，2-图片 3-文字
        style: 1, // 展示样式1=固定显示，2=分页显示
        per_line: 5, // 每行显示数量
        show_line: 2, // 显示行数
        data: [
            {
                image: '',
                name: '导航名称',
                link: {}
            }
        ]
    },
    styles: {
        root_bg_color: '', // 根背景颜色
        component_bg_color: '#ffffff', // 组件背景颜色
        text_color: "#999999", // 文本颜色
        padding_top: 0,
        padding_horizontal: 0,
        padding_bottom: 0,
        border_top_radius: 20,
        border_bottom_radius: 20,
        image_radius: 0
    }
})
