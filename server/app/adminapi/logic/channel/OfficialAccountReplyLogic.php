<?php
// +----------------------------------------------------------------------
// | likeadmin快速开发前后端分离管理后台（PHP版）
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | 开源版本可自由商用，可去除界面版权logo
// | gitee下载：https://gitee.com/likeshop_gitee/likeadmin
// | github下载：https://github.com/likeshop-github/likeadmin
// | 访问官网：https://www.likeadmin.cn
// | likeadmin团队 版权所有 拥有最终解释权
// +----------------------------------------------------------------------
// | author: likeadminTeam
// +----------------------------------------------------------------------

namespace app\adminapi\logic\channel;

use app\common\enum\OfficialAccountEnum;
use app\common\enum\YesNoEnum;
use app\common\logic\BaseLogic;
use app\common\model\channel\OfficialAccountReply;
use EasyWeChat\Factory;
use EasyWeChat\Kernel\Messages\Text;

/**
 * 微信公众号回复逻辑层
 * Class OfficialAccountReplyLogic
 * @package app\adminapi\logic\channel
 */
class OfficialAccountReplyLogic extends BaseLogic
{
    /**
     * @notes 添加回复(关注/关键词/默认)
     * @param $params
     * @return bool
     * @author 段誉
     * @date 2022/3/29 10:57
     */
    public static function add($params)
    {
        try {
            // 关键字回复排序值须大于0
            if ($params['reply_type'] == OfficialAccountEnum::REPLY_TYPE_KEYWORD && $params['sort'] <= 0) {
                throw new \Exception('排序值须大于0');
            }
            if ($params['reply_type'] != OfficialAccountEnum::REPLY_TYPE_KEYWORD && $params['status']) {
                // 非关键词回复只能有一条记录处于启用状态，所以将该回复类型下的已有记录置为禁用状态
                OfficialAccountReply::where(['reply_type' => $params['reply_type']])->update(['status' => YesNoEnum::NO]);
            }
            OfficialAccountReply::create($params);
            return true;
        } catch (\Exception $e) {
            self::setError($e->getMessage());
            return false;
        }
    }


    /**
     * @notes 查看回复详情
     * @param $params
     * @return array
     * @author 段誉
     * @date 2022/3/29 11:00
     */
    public static function detail($params)
    {
        $field = 'id,name,keyword,reply_type,matching_type,content_type,content,status,sort';
        $field .= ',reply_type as reply_type_desc, matching_type as matching_type_desc, content_type as content_type_desc, status as status_desc';
        return OfficialAccountReply::field($field)->findOrEmpty($params['id'])->toArray();
    }


    /**
     * @notes 编辑回复(关注/关键词/默认)
     * @param $params
     * @return bool
     * @author 段誉
     * @date 2022/3/29 11:01
     */
    public static function edit($params)
    {
        try {
            // 关键字回复排序值须大于0
            if ($params['reply_type'] == OfficialAccountEnum::REPLY_TYPE_KEYWORD && $params['sort'] <= 0) {
                throw new \Exception('排序值须大于0');
            }
            if ($params['reply_type'] != OfficialAccountEnum::REPLY_TYPE_KEYWORD && $params['status']) {
                // 非关键词回复只能有一条记录处于启用状态，所以将该回复类型下的已有记录置为禁用状态
                OfficialAccountReply::where(['reply_type' => $params['reply_type']])->update(['status' => YesNoEnum::NO]);
            }
            OfficialAccountReply::update($params);
            return true;
        } catch (\Exception $e) {
            self::setError($e->getMessage());
            return false;
        }
    }


    /**
     * @notes 删除回复(关注/关键词/默认)
     * @param $params
     * @author 段誉
     * @date 2022/3/29 11:01
     */
    public static function delete($params)
    {
        OfficialAccountReply::destroy($params['id']);
    }


    /**
     * @notes 更新排序
     * @param $params
     * @author 段誉
     * @date 2022/3/29 11:01
     */
    public static function sort($params)
    {
        $params['sort'] = $params['new_sort'];
        OfficialAccountReply::update($params);
    }


    /**
     * @notes 更新状态
     * @param $params
     * @author 段誉
     * @date 2022/3/29 11:01
     */
    public static function status($params)
    {
        $reply = OfficialAccountReply::findOrEmpty($params['id']);
        $reply->status = !$reply->status;
        $reply->save();
    }

    /**
     * @notes 微信公众号回调
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \ReflectionException
     * @author 段誉
     * @date 2022/3/29 11:01
     */
    public static function index()
    {
        // 确认此次GET请求来自微信服务器，原样返回echostr参数内容，接入生效，成为开发者成功
        if (isset($_GET['echostr'])) {
            echo $_GET['echostr'];
            exit;
        }

        $officialAccountSetting = (new OfficialAccountSettingLogic())->getConfig();
        $config = [
            'app_id' => $officialAccountSetting['app_id'],
            'secret' => $officialAccountSetting['app_secret'],
            'response_type' => 'array',
        ];
        $app = Factory::officialAccount($config);

        $app->server->push(function ($message) {
            switch ($message['MsgType']) { // 消息类型
                case OfficialAccountEnum::MSG_TYPE_EVENT: // 事件
                    switch ($message['Event']) {
                        case OfficialAccountEnum::EVENT_SUBSCRIBE: // 关注事件
                            $reply_content = OfficialAccountReply::where(['reply_type' => OfficialAccountEnum::REPLY_TYPE_FOLLOW, 'status' => YesNoEnum::YES])
                                ->value('content');

                            if (empty($reply_content)) {
                                // 未启用关注回复 或 关注回复内容为空
                                $reply_content = OfficialAccountReply::where(['reply_type' => OfficialAccountEnum::REPLY_TYPE_DEFAULT, 'status' => YesNoEnum::YES])
                                    ->value('content');
                            }
                            if ($reply_content) {
                                $text = new Text($reply_content);
                                return $text;
                            }
                            break;
                    }
                    break;

                case OfficialAccountEnum::MSG_TYPE_TEXT: // 文本
                    $reply_list = OfficialAccountReply::where(['reply_type' => OfficialAccountEnum::REPLY_TYPE_KEYWORD, 'status' => YesNoEnum::YES])
                        ->order('sort asc')
                        ->select();
                    $reply_content = '';
                    foreach ($reply_list as $reply) {
                        switch ($reply['matching_type']) {
                            case OfficialAccountEnum::MATCHING_TYPE_FULL:
                                $reply['keyword'] === $message['Content'] && $reply_content = $reply['content'];
                                break;
                            case OfficialAccountEnum::MATCHING_TYPE_FUZZY:
//                                stripos($message['Content'], $reply['keyword']) !== false && $reply_content = $reply['content'];
                                strstr($reply['keyword'],$message['Content']) !== false && $reply_content = $reply['content'];
                                break;
                        }
                        if ($reply_content) {
                            break; // 得到回复文本，中止循环
                        }
                    }
                    //消息回复为空的话，找默认回复
                    if (empty($reply_content)) {
                        $reply_content = OfficialAccountReply::where(['reply_type' => OfficialAccountEnum::REPLY_TYPE_DEFAULT, 'status' => YesNoEnum::YES])
                            ->value('content');
                    }
                    if ($reply_content) {
                        $text = new Text($reply_content);
                        return $text;
                    }
                    break;
            }
        });
        $response = $app->server->serve();
        $response->send();
    }
}