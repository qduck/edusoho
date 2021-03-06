<?php

namespace Biz\Visualization\Service\Impl;

use AppBundle\Common\ArrayToolkit;
use Biz\BaseService;
use Biz\Visualization\Dao\CoursePlanLearnDailyDao;
use Biz\Visualization\Service\CoursePlanLearnDataDailyStatisticsService;

class CoursePlanLearnDataDailyStatisticsServiceImpl extends BaseService implements CoursePlanLearnDataDailyStatisticsService
{
    public function sumLearnedTimeByCourseIdGroupByUserId($courseId, array $userIds)
    {
        if (empty($userIds)) {
            return [];
        }

        return ArrayToolkit::index($this->getCoursePlanLearnDailyDao()->sumLearnedTimeByCourseIdGroupByUserId($courseId, $userIds), 'userId');
    }

    public function sumPureLearnedTimeByCourseIdGroupByUserId($courseId, array $userIds)
    {
        if (empty($userIds)) {
            return [];
        }

        return ArrayToolkit::index($this->getCoursePlanLearnDailyDao()->sumPureLearnedTimeByCourseIdGroupByUserId($courseId, $userIds), 'userId');
    }

    public function sumLearnedTimeByCourseId($courseId)
    {
        return $this->getCoursePlanLearnDailyDao()->sumLearnedTimeByCourseId($courseId);
    }

    protected function getSettingService()
    {
        return $this->createService('System:SettingService');
    }

    /**
     * @return CoursePlanLearnDailyDao
     */
    protected function getCoursePlanLearnDailyDao()
    {
        return $this->createDao('Visualization:CoursePlanLearnDailyDao');
    }
}
