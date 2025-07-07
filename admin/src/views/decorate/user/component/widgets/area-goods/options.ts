export default () => ({
    title: '区域商品组',
    name: 'area-goods',
    content: {
        enabled: 1, // 是否启用
        type: 1, // 1-自动获取
        goods_type: 1, // 1-单列 2-双列 3-横向滑动 4-大图模式
        show_title: 1, // 商品标题
        show_server: 1, // 服务
        show_price: 1, // 商品价格
        show_scribing_price: 1, // 划线价格
        show_sales: 1, // 销量

        btn_text: '购买', // 按钮文字
        show_num: 1, // 显示数量
    },
    styles: {
        title_color: '#000000', // 标题颜色
        server_color: '#888888', // 服务颜色
        price_color: '#fc5447', // 价格颜色
        scribing_price_color: '#888888', // 划线价格颜色
        sales_color: '#888888', // 销量颜色
        btn_radius: 10, // 按钮圆角

        root_bg_color: '', // 根背景颜色
        component_bg_color: '', // 组件背景颜色
        goods_bg_color: '', // 商品背景颜色
        padding_top: 0, // 上内边距
        padding_horizontal: 0, // 左右内边距
        padding_bottom: 0, // 下内边距
        goods_horizontal: 0, // 商品左右内边距
        goods_vertical: 0, // 商品上下内边距

        border_top_radius: 20,
        border_bottom_radius: 20,
        image_radius: 0
    }
})
