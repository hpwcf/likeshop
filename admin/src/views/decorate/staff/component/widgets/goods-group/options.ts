export default () => ({
    title: '商品组',
    name: 'goods-group',
    content: {
        enabled: 1, // 是否启用
        goods_type: 1, // 1-手动添加 2-分类
        style: 1, // 1-单列 2-双列 3-横向滑动 4-大图模式
        show_title: 1, // 商品标题
        show_server: 1, // 服务
        show_price: 1, // 商品价格
        show_scribing_price: 1, // 划线价格
        show_sales: 1, // 销量

        btn_text: '购买', // 按钮文字
        category: {
            id: '',
            name: '',
            num: 1
        },
        data: [
            {
                image: '',
                name: '导航名称',
                link: {}
            }
        ]
    },
    styles: {
        title_color: '#000000', // 标题颜色
        server_color: '#888888', // 服务颜色
        price_color: '#fc5447', // 价格颜色
        scribing_price_color: '#888888', // 划线价格颜色
        sales_color: '#888888', // 销量颜色
        btn_radius: 10 // 按钮圆角
    }
})
