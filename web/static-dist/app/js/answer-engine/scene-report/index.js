!function(i){function e(e){for(var t,n,a=e[0],r=e[1],o=e[2],l=0,c=[];l<a.length;l++)n=a[l],Object.prototype.hasOwnProperty.call(u,n)&&u[n]&&c.push(u[n][0]),u[n]=0;for(t in r)Object.prototype.hasOwnProperty.call(r,t)&&(i[t]=r[t]);for(p&&p(e);c.length;)c.shift()();return d.push.apply(d,o||[]),s()}function s(){for(var e,t=0;t<d.length;t++){for(var n=d[t],a=!0,r=1;r<n.length;r++){var o=n[r];0!==u[o]&&(a=!1)}a&&(d.splice(t--,1),e=l(l.s=n[0]))}return e}var n={},u={66:0},d=[];function l(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,l),t.l=!0,t.exports}l.m=i,l.c=n,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(t,e){if(1&e&&(t=l(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)l.d(n,a,function(e){return t[e]}.bind(null,a));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/static-dist/";var t=window.webpackJsonp=window.webpackJsonp||[],a=t.push.bind(t);t.push=e,t=t.slice();for(var r=0;r<t.length;r++)e(t[r]);var p=a;d.push([725,0]),s()}({725:function(e,t,n){"use strict";n.r(t);var a,r=n(20),o=n.n(r),l={data:function(){return{showCKEditorData:{publicPath:$("[name=ckeditor_path]").val(),filebrowserImageUploadUrl:$("[name=ckeditor_image_upload_url]").val(),filebrowserImageDownloadUrl:$("[name=ckeditor_image_download_url]").val(),language:"zh_CN"===document.documentElement.lang?"zh-cn":document.documentElement.lang,jqueryPath:$("[name=jquery_path]").val()},cdnHost:$("[name=cdn_host]").val(),fileId:0}},created:function(){this.assessment=JSON.parse($("[name=assessment]").val()),this.answerSceneReport=JSON.parse($("[name=answer_scene_report]").val()),this.answerScene=JSON.parse($("[name=answer_scene]").val())},methods:{previewAttachment:function(e){this.fileId=e},downloadAttachment:function(e){this.fileId=e},previewAttachmentCallback:function(){var e=this,n=this;return new o.a(function(t){$.ajax({url:$("[name=preview-attachment-url]").val(),type:"post",data:{id:e.fileId},beforeSend:function(e){e.setRequestHeader("X-CSRF-Token",$("meta[name=csrf-token]").attr("content"))}}).done(function(e){console.log(app),console.log(e),e.data.playServer=app.cloudPlayServer,e.data.sdkBaseUri=app.cloudSdkBaseUri,e.data.disableDataUpload=app.cloudDisableLogReport,e.data.disableSentry=app.cloudDisableLogReport,t(e),n.fileId=0})})},downloadAttachmentCallback:function(){var e=this,n=this;return new o.a(function(t){$.ajax({url:$("[name=download-attachment-url]").val(),type:"post",data:{id:e.fileId},beforeSend:function(e){e.setRequestHeader("X-CSRF-Token",$("meta[name=csrf-token]").attr("content"))}}).done(function(e){t(e),n.fileId=0})})}}},c=n(91),i=Object(c.a)(l,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"ibs-vue",attrs:{id:"app"}},[n("scene-report",{attrs:{cdnHost:"cdnHost",assessment:e.assessment,answerScene:e.answerScene,answerSceneReport:e.answerSceneReport,previewAttachmentCallback:e.previewAttachmentCallback,downloadAttachmentCallback:e.downloadAttachmentCallback},on:{previewAttachment:e.previewAttachment,downloadAttachment:e.downloadAttachment}})],1)},[],!1,null,null,null).exports;Vue.config.productionTip=!1,"en"==app.lang&&(a=local.default,itemBank.default.install(Vue,{locale:a})),new Vue({render:function(e){return e(i)}}).$mount("#app")}});