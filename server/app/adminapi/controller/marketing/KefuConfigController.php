<?php
// +----------------------------------------------------------------------
// | likeshop100%开源免费商用商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | 开源版本可自由商用，可去除界面版权logo
// | 商业版本务必购买商业授权，以免引起法律纠纷
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | gitee下载：https://gitee.com/likeshop_gitee
// | github下载：https://github.com/likeshop-github
// | 访问官网：https://www.likeshop.cn
// | 访问社区：https://home.likeshop.cn
// | 访问手册：http://doc.likeshop.cn
// | 微信公众号：likeshop技术社区
// | likeshop团队 版权所有 拥有最终解释权
// +----------------------------------------------------------------------
// | author: likeshopTeam
// +----------------------------------------------------------------------

namespace app\adminapi\controller\marketing;

use app\adminapi\controller\BaseAdminController;
use app\adminapi\logic\marketing\KefuConfigLogic;

class KefuConfigController extends BaseAdminController
{
    /**
     * @notes 获取
     * @return \think\response\Json
     * @author ljj
     * @date 2024/8/27 下午5:17
     */
    public function getConfig()
    {
        $result = KefuConfigLogic::getConfig();
        return $this->data($result);
    }

    /**
     * @notes 设置
     * @return \think\response\Json
     * @author ljj
     * @date 2024/8/27 下午5:181
     */
    public function setConfig()
    {
        $params = $this->request->post();
        $result = KefuConfigLogic::setConfig($params);
        if (true !== $result) {
            return $this->fail($result);
        }
        return $this->success('设置成功', [], 1, 1);
    }
}