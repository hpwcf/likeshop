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

namespace app\adminapi\controller\finance;


use app\adminapi\controller\BaseAdminController;
use app\adminapi\lists\finance\StaffAccountLogLists;
use app\common\enum\StaffAccountLogEnum;

class StaffAccountLogController extends BaseAdminController
{
    /**
     * @notes 列表
     * @return \think\response\Json
     * @author ljj
     * @date 2024/9/6 下午2:22
     */
    public function lists()
    {
        return $this->dataLists(new StaffAccountLogLists());
    }

    /**
     * @notes 变动类型
     * @return array|\think\response\Json
     * @author ljj
     * @date 2024/9/6 下午2:23
     */
    public function changeTypeLists()
    {
        $params = $this->request->get('change_object',StaffAccountLogEnum::DEPOSIT);
        if ($params == StaffAccountLogEnum::DEPOSIT) {
            return $this->data(StaffAccountLogEnum::getDepositChangeTypeDesc());
        }
        if ($params == StaffAccountLogEnum::EARNINGS) {
            return $this->data(StaffAccountLogEnum::getEarningsChangeTypeDesc());
        }

        return [];
    }
}