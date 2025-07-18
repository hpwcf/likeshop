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

namespace app\adminapi\lists\staff;


use app\adminapi\lists\BaseAdminDataLists;
use app\common\model\staff\StaffSkill;

class StaffSkillLists extends BaseAdminDataLists
{
    /**
     * @notes 服务技能列表
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     * @author ljj
     * @date 2024/8/21 上午10:17
     */
    public function lists(): array
    {
        $lists = (new StaffSkill())->field('id,status,name,create_time,update_time')
            ->order('id', 'desc')
            ->append(['goods_num','staff_num'])
            ->limit($this->limitOffset, $this->limitLength)
            ->select()
            ->toArray();

        return $lists;
    }

    /**
     * @notes 服务技能数量
     * @return int
     * @author ljj
     * @date 2024/8/21 上午10:17
     */
    public function count(): int
    {
        return (new StaffSkill())->count();
    }
}