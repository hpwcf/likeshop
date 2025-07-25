<?php
// +----------------------------------------------------------------------
// | likeshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/likeshop_gitee
// | github下载：https://github.com/likeshop-github
// | 访问官网：https://www.likeshop.cn
// | 访问社区：https://home.likeshop.cn
// | 访问手册：http://doc.likeshop.cn
// | 微信公众号：likeshop技术社区
// | likeshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  likeshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | likeshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: likeshop.cn.team
// +----------------------------------------------------------------------

namespace app\common\model\goods;


use app\common\enum\GoodsCommentEnum;
use app\common\model\BaseModel;
use app\common\model\order\OrderGoods;
use app\common\model\user\User;
use think\model\concern\SoftDelete;

class GoodsComment extends BaseModel
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';


    /**
     * @notes 关联评论图片模型
     * @return \think\model\relation\HasMany
     * @author ljj
     * @date 2022/2/9 5:51 下午
     */
    public function goodsCommentImage()
    {
        return $this->hasMany(GoodsCommentImage::class,'comment_id','id');
    }

    /**
     * @notes 关联用户模型
     * @return \think\model\relation\HasOne
     * @author ljj
     * @date 2022/2/17 6:19 下午
     */
    public function user()
    {
        return $this->hasOne(User::class,'id','user_id')->field('id,sn,nickname,avatar,mobile');
    }

    /**
     * @notes 获取回复状态
     * @param $value
     * @param $data
     * @return string|string[]
     * @author ljj
     * @date 2022/2/9 5:54 下午
     */
    public function getStatusDescAttr($value,$data)
    {
        return GoodsCommentEnum::getStatusDesc($data['status']);
    }

    /**
     * @notes 获取评价等级
     * @param $value
     * @param $data
     * @return string
     * @author ljj
     * @date 2022/2/9 5:56 下午
     */
    public function getCommentLevelAttr($value,$data)
    {
        if ($data['service_comment'] < 3) {
            return '差评';
        }
        if ($data['service_comment'] == 3) {
            return '中评';
        }
        if ($data['service_comment'] > 3) {
            return '好评';
        }
        return '未知';
    }

    /**
     * @notes 服务规格
     * @param $value
     * @param $data
     * @return mixed
     * @author ljj
     * @date 2024/10/15 下午4:53
     */
    public function getGoodsSkuDescAttr($value,$data)
    {
        return OrderGoods::where(['id'=>$data['order_goods_id']])->value('goods_sku');
    }
}