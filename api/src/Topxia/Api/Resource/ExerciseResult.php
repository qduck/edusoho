<?php

namespace Topxia\Api\Resource;

use Biz\Activity\Service\ExerciseActivityService;
use Biz\Testpaper\Wrapper\AssessmentResponseWrapper;
use Biz\Testpaper\Wrapper\TestpaperWrapper;
use Codeages\Biz\ItemBank\Answer\Service\AnswerQuestionReportService;
use Codeages\Biz\ItemBank\Answer\Service\AnswerRecordService;
use Codeages\Biz\ItemBank\Answer\Service\AnswerReportService;
use Codeages\Biz\ItemBank\Answer\Service\AnswerSceneService;
use Codeages\Biz\ItemBank\Answer\Service\AnswerService;
use Codeages\Biz\ItemBank\Assessment\Service\AssessmentService;
use Silex\Application;
use AppBundle\Common\ArrayToolkit;
use Symfony\Component\HttpFoundation\Request;

class ExerciseResult extends BaseResource
{
    public function post(Application $app, Request $request, $exerciseId)
    {
        $answers = $request->request->all();

        $answers = $this->answerFormat($answers);
        $answers['usedTime'] = 0;

        $user = $this->getCurrentUser();
        $assessment = $this->getAssessmentService()->showAssessment($exerciseId);
        if (empty($assessment)) {
            return $this->error('404', '该练习不存在!');
        }

        $answerRecords = $this->getAnswerRecordService()->search(
            array('user_id' => $user['id'], 'assessment_id' => $assessment['id']),
            array('created_time' => 'desc'),
            0,
            1
        );

        if (empty($answerRecords)) {
            return $this->error('404', '该练习任务不存在!');
        }

        $exerciseActivity = $this->getExerciseActivityService()->getByAnswerSceneId($answerRecords[0]['answer_scene_id']);
        if (empty($exerciseActivity)) {
            return $this->error('404', '该练习任务不存在!');
        }

        $conditions = array(
            'mediaId' => $exerciseActivity['id'],
            'mediaType' => 'exercise',
        );
        $activities = $this->getActivityService()->search($conditions, null, 0, 1);
        if (!$activities) {
            return $this->error('404', '该练习任务不存在!');
        }
        $activity = $activities[0];

        $canTakeCourse = $this->getCourseService()->canTakeCourse($activity['fromCourseId']);
        if (!$canTakeCourse) {
            return $this->error('500', '无权限访问!');
        }

        $record = $this->getAnswerRecordService()->getLatestAnswerRecordByAnswerSceneIdAndUserId($exerciseActivity['answerSceneId'], $user['id']);
        if (empty($record) || 'finished' == $record['status']) {
            $record = $this->getAnswerService()->startAnswer($exerciseActivity['answerSceneId'], $assessment['id'], $user['id']);
        }

        $wrapper = new AssessmentResponseWrapper();
        $responses = $wrapper->wrap($answers, $assessment, $record);
        $this->getAnswerService()->submitAnswer($responses);

        return array(
            'id' => $record['id'],
        );
    }

    public function get(Application $app, Request $request, $lessonId)
    {
        $user = $this->getCurrentUser();

        $task = $this->getTaskService()->getTask($lessonId);
        $activity = $this->getActivityService()->getActivity($task['activityId'], true);

        $answerRecord = $this->getAnswerRecordService()->getLatestAnswerRecordByAnswerSceneIdAndUserId($activity['ext']['answerSceneId'], $user['id']);
        if (empty($answerRecord)) {
            return $this->error('404', '没有该练习的结果记录!');
        }

        $testpaperWrapper = new TestpaperWrapper();
        $assessment = $this->getAssessmentService()->getAssessment($answerRecord['assessment_id']);
        $scene = $this->getAnswerSceneService()->get($answerRecord['answer_scene_id']);
        $answerReport = $this->getAnswerReportService()->get($answerRecord['answer_report_id']);
        $result = $testpaperWrapper->wrapTestpaperResult($answerRecord, $assessment, $scene, $answerReport);

        return $result;
    }

    private function filterItem($items)
    {
        $questionIds = ArrayToolkit::column($items, 'questionId');
        $questions = $this->getQuestionService()->findQuestionsByIds($questionIds);

        $materialMap = array();
        $itemIndexMap = array();
        $newItems = array();
        foreach ($items as &$item) {
            unset($item['answer']);
            unset($item['userId']);

            $question = $questions[$item['questionId']];
            $item['questionType'] = $question['type'];
            $item['questionParentId'] = $question['parentId'];

            if ('material' == $item['questionType']) {
                $itemIndexMap[$item['questionId']] = $item['id'];
                $materialMap[$item['questionId']] = array();
            }

            if (0 != $item['questionParentId'] && isset($materialMap[$item['questionParentId']])) {
                $materialMap[$item['questionParentId']][] = $item;
                continue;
            }

            $newItems[$item['id']] = $item;
        }

        foreach ($materialMap as $id => $material) {
            $newItems[$itemIndexMap[$id]]['items'] = $material;
        }

        return array_values($newItems);
    }

    public function filter($res)
    {
        $res['usedTime'] = date('c', $res['usedTime']);
        $res['updatedTime'] = date('c', $res['updatedTime']);
        $res['createdTime'] = date('c', $res['createdTime']);

        return $res;
    }

    private function answerFormat($answers)
    {
        if (empty($answers['data'])) {
            return array();
        }

        $data = array();
        foreach ($answers['data'] as $questionId => $value) {
            $data[$questionId] = empty($value['answer']) ? '' : $value['answer'];
        }

        return array('data' => $data);
    }

    protected function getQuestionService()
    {
        return $this->getServiceKernel()->createService('Question:QuestionService');
    }

    private function getCourseService()
    {
        return $this->getServiceKernel()->createService('Course:CourseService');
    }

    protected function getTaskService()
    {
        return $this->getServiceKernel()->createService('Task:TaskService');
    }

    protected function getActivityService()
    {
        return $this->getServiceKernel()->createService('Activity:ActivityService');
    }

    /**
     * @return ExerciseActivityService
     */
    protected function getExerciseActivityService()
    {
        return $this->getServiceKernel()->createService('Activity:ExerciseActivityService');
    }

    /**
     * @return AssessmentService
     */
    protected function getAssessmentService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Assessment:AssessmentService');
    }

    /**
     * @return AnswerRecordService
     */
    protected function getAnswerRecordService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Answer:AnswerRecordService');
    }

    /**
     * @return AnswerService
     */
    protected function getAnswerService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Answer:AnswerService');
    }

    /**
     * @return AnswerSceneService
     */
    protected function getAnswerSceneService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Answer:AnswerSceneService');
    }

    /**
     * @return AnswerQuestionReportService
     */
    protected function getAnswerQuestionReportService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Answer:AnswerQuestionReportService');
    }

    /**
     * @return AnswerReportService
     */
    protected function getAnswerReportService()
    {
        return $this->getServiceKernel()->createService('ItemBank:Answer:AnswerReportService');
    }
}
