app.controller('LessonController', ['$scope', '$stateParams', 'LessonService', 'LessonLiveService', 'cordovaUtil', LessonController]);

function LessonController($scope, $stateParams, LessonService, LessonLiveService, cordovaUtil)
{	
	var self = this;
  this.lesson = {};
  this.timeoutNum = 0;

  self.loadLiveTicket = function() {
    $scope.showLoad();
    LessonLiveService.createLiveTickets({
      lessonId : $stateParams.lessonId,
      device : 'android'
    }, function(data) {
      if (data.error) {
        $scope.hideLoad();
        self.showError(data.error);
        return;
      }

      if (! data.no) {
        $scope.hideLoad();
        self.showError({
          message : "获取直播服务失败!"
        });
        return;
      }

      self.getLiveInfoFromTicket($stateParams.lessonId, data.no);
    });
  };

  self.showLiveBySdk = function(sdk) {
    switch(sdk.provider) {
      case "soooner":
        cordovaUtil.startAppView("sooonerLivePlayer", {
          liveClassroomId : sdk.liveClassroomId, 
          exStr : sdk.exStr,
          replayState : sdk.replayState,
        });
        break;
      default:
        self.showError({
          message : "暂不支持该直播类型在客户端上播放!"
        });
    }
  }

  self.getLiveInfoFromTicket = function(lessonId, ticket) {
    LessonLiveService.getLiveInfoByTicket({
      lessonId : lessonId,
      ticket : ticket
    }, function(data) {
      if (data.error) {
        self.showError(data.error);
        return;
      }
      self.timeoutNum ++;

      if (data.sdk) {
        $scope.hideLoad();
        self.showLiveBySdk(data.sdk);
        cordovaUtil.closeWebView();
        return;
      }

      if (! data.roomUrl || "" == data.roomUrl) {
        if (self.timeoutNum >= 10) {
          self.showError({
              message : "获取直播服务失败!"
          });
          return;
        }
        self.getLiveInfoFromTicket(lessonId, ticket);
        return;
      }

      $scope.hideLoad();
      cordovaUtil.openWebView(data.roomUrl);
      cordovaUtil.closeWebView();
    });
  };

  self.showError = function(error) {
    var dia = $.dialog({
            title : '直播提醒' ,
            content : error.message,
            button : [ "确定" ]
    });

    dia.on("dialog:action",function(e){
      cordovaUtil.closeWebView();
    });
  }

	self.loadLesson = function() {
    $scope.showLoad();
		LessonService.getLesson({
			courseId : $stateParams.courseId,
			lessonId : $stateParams.lessonId
		},function(data) {
      $scope.hideLoad();
			if (data.error) {
				$scope.toast(data.error.message);
				return;
			}
      
      self.lesson = data;
			var lesson = data;
      if (!lesson) {
        alert("请先加入学习");
        cordovaUtil.closeWebView();
        return;
      }

      if (lesson.type == "flash" || "qqvideo" == lesson.mediaSource) {
        alert("客户端暂不支持该课时类型，敬请期待新版");
        cordovaUtil.closeWebView();
        return;
      }

      if ("live" == lesson.type) {
        self.loadLiveTicket();
        return;
      }

      cordovaUtil.learnCourseLesson(lesson.courseId, lesson.id, []);  
      cordovaUtil.closeWebView();
		});
	}

	this.loadLesson();
}

app.controller('CourseLessonController', ['$scope', '$stateParams', 'LessonService', '$state', 'cordovaUtil', CourseLessonController]);
function CourseLessonController($scope, $stateParams, LessonService, $state, cordovaUtil)
{

  var self = this;
  $scope.loading = true;
  this.loadLessons = function() {
      LessonService.getCourseLessons({
        courseId : $stateParams.courseId,
        token : $scope.token
      }, function(data) {
        $scope.loading = false;
        $scope.lessons = data.lessons;
        $scope.learnStatuses = data.learnStatuses;

        for( index in data.learnStatuses ) {
            $scope.lastLearnStatusIndex = index;
        }

        self.continueLearnLesson();
      });
    }

    this.continueLearnLesson = function() {
      $scope.$root.$on("continueLearnCourse", function(event, data) {
          if (! $scope.lastLearnStatusIndex) {
            alert("还没有开始学习!");
            return
          }
          
          var continueLesson =  self.findLessonById($scope.lastLearnStatusIndex);
          if (! continueLesson) {
            alert("还没有开始学习");
            return
          }
          $scope.learnLesson(continueLesson);
        });
    };

    this.findLessonById = function(lessonId) {
      var lessons = $scope.lessons;
      for (var i = 0; i < lessons.length; i++) {
        if (lessonId == lessons[i].id) {
          return lessons[i];
        }
      };

      return null;
    };

    this.createLessonIds = function() {
      var index = 0;
      var lessonIds = [];
      var lessons = $scope.lessons;
      for (var i = 0; i < lessons.length; i++) {
        if ("lesson" == lessons[i].itemType) {
          lessonIds[index++] = lessons[i].id;
        }
      };

      return lessonIds;
    };

    //lesson.free=1 is free
    $scope.learnLesson = function(lesson) {
      if (!$scope.user) {
        var dia = $.dialog({
                title : '课程提醒' ,
                content : '你还未登录网校',
                button : [ "登录网校" ]
        });

        dia.on("dialog:action",function(e){
            cordovaUtil.openWebView(app.rootPath + "#/login/course");
        });
        return;
      }
      if (! $scope.member && 1 != lesson.free) {
        alert("请先加入学习");
        return;
      }

      if ("lesson" != lesson.itemType) {
        return;
      }

      if (lesson.type == "flash" || "qqvideo" == lesson.mediaSource) {
        alert("客户端暂不支持该课时类型，敬请期待新版");
        return;
      }

      if ("live" == lesson.type) {
        cordovaUtil.openWebView(app.rootPath + "#/lesson/" + lesson.courseId + "/" + lesson.id);
        return;
      }
      cordovaUtil.learnCourseLesson(lesson.courseId, lesson.id, self.createLessonIds());     
    }

    $scope.getLessonBoxStyle = function($index) {

      var style = "";
      $prevItem = $scope.lessons[$index -1];
      $nextItem = $scope.lessons[$index +1];

      var isNoTop = false, isNoBottom = false;
      if (!$prevItem || 'chapter' == $prevItem.itemType) {
        style += " no-top";
        isNoTop = true;
      }

      if (! $nextItem || 'lesson' != $nextItem.itemType) {
        style += " no-bottom";
        isNoBottom = true;
      }

      if (isNoTop && isNoBottom) {
        style = "hidden";
      }

      return style;
    }

    this.loadLessons();
    $scope.$on("$destroy", function(event, data) {
      console.log(11);
        $scope.$root.$on("continueLearnCourse", null);
    });
}